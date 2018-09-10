const fs = require('fs');
const path = require('path');
const electionApi = require('../ethereum/api/election.api');
const candidateApi = require('../ethereum/api/candidate.api');
const voterApi = require('../ethereum/api/voter.api');
const mkdirSync = require('../util/fs.util').mkdirSync;
const hec = require('../hec/hec.api');
const ipfs = require('../ipfs/ipfs');

module.exports = {
    getElectionList: async (req, res) => {
        try {
            const electionSummaryList =
                await electionApi.getElectionSummaryList(req.originalUrl === '/finite');
            res.render('election/electionList', {
                isFinite: req.originalUrl === '/finite' ? 'finite' : 'public',
                electionList: electionSummaryList
            });
        } catch (err) {
            res.send(err.toString());
        }
    },
    getElectionDetail: async (req, res) => {
        const electionAddress = req.params.address;
        try {
            let electionDetail = {};

            electionDetail.summary = await electionApi.getElectionSummary(electionAddress);
            electionDetail.candidateList = await candidateApi.getCandidateList(electionAddress);
            electionDetail.ballotCount = await electionApi.getBallotCount(electionAddress);
            if (electionDetail.summary['electionState'] === "완료") {
                const result = await electionApi.getTallyResult(electionAddress);
                if (result) {
                    const resultArray = result.split(',');
                    resultArray.sort((a, b) => b - a);

                    const max = resultArray[0];
                    electionDetail.resultName = [];
                    for (let i = 0; i < resultArray.length; i++) {
                        if (resultArray[i] === max)
                            electionDetail.resultName.push(electionDetail.candidateList[i].name);
                    }
                }
            }
            if (req.user) {
                const voterAddress = req.user.etherAccount;
                electionDetail.voterState = await voterApi.getVoterState(electionAddress, voterAddress);
                const isOwner = await electionApi.isOwner(electionAddress, voterAddress);
                if (isOwner) electionDetail.owner = isOwner;
            }

            res.render('election/electionDetail', {
                electionDetail: electionDetail,
                path: req.path
            });
        } catch (err) {
            console.log(err);
            res.send(err.toString());
        }
    },
    postElectionState: async (req, res) => {

        if (!req.user) res.redirect('/login');

        const electionAddress = req.params.address;
        const ownerAddress = req.user.etherAccount;

        try {
            const isVoteOwner = await electionApi.isOwner(electionAddress, ownerAddress);
            if (isVoteOwner) {
                const state = req.body.electionState;
                await electionApi.setElectionState(electionAddress, ownerAddress, state);
                const electionState = await electionApi.getElectionState(electionAddress);
                if (electionState === '3') {
                    // 투표 집계

                    // 선거 폴더의 파일 이름(=유권자 주소)을 모두 읽는다
                    const electionDirPath = `./hec/data/candidate/${electionAddress}`;
                    const files = fs.readdirSync(path.resolve(electionDirPath));

                    // 선거 결과를 저장할 디렉토리를 만든다
                    const electionResultDirPath = path.resolve(`./hec/data/result/${electionAddress}`);
                    mkdirSync(electionResultDirPath);

                    for (let i = 0; i < files.length; i++) {
                        // 유권자 주소로 이더리움에 저장된 IPFS 해쉬값을 읽는다
                        const fileHash = await electionApi.getBallot(electionAddress, files[i]);
                        // 모든 유권자 주소의 IPFS 파일을 모두 다운받거나, 있으면 그걸 사용한다
                        ipfs.files.get(fileHash, async (err, files) => {
                            if (err) {
                                console.log(err);
                            }
                            fs.writeFileSync(`${electionResultDirPath}/${files[0].path}`,
                                files[0].content.toString('utf8'));
                            if(i === files.length-1) {
                                // 동형암호로 집계를 한다
                                const candidateListLength = await candidateApi.getCandidateLength(electionAddress);
                                await hec.tally(electionAddress, candidateListLength,
                                    "hec/data", async (out, err, result) => {
                                        if (err) {
                                            console.error(err);
                                            return res.send(err);
                                        }
                                        console.log(out);

                                        // 이더리움에 결과 저장
                                        await electionApi.setTallyResult(electionAddress, ownerAddress, result);

                                        res.redirect(req.path);
                                    });
                            }
                        });
                    }
                } else {
                    res.redirect(req.path);
                }
            } else {
                res.redirect('/login');
            }
        } catch (err) {
            res.send(err.toString());
        }
    },
    postElectionInformation: async (req, res) => {

        if (!req.user) res.redirect('/login');

        const electionAddress = req.params.address;
        const ownerAddress = req.user.etherAccount;

        try {
            const isVoteOwner = await electionApi.isOwner(electionAddress, ownerAddress);
            if (isVoteOwner) {

                const electionDescription = req.body.electionDescription;
                const startVoteDate = Date.parse(req.body.startDate) / 1000;
                const endVoteDate = Date.parse(req.body.endDate) / 1000;

                if (electionDescription)
                    await electionApi.setElectionDescription(electionAddress, ownerAddress, electionDescription);
                if (startVoteDate && endVoteDate)
                    await electionApi.setElectionDate(
                        electionAddress, ownerAddress, startVoteDate, endVoteDate);
            } else {
                res.redirect('/login');
            }
            res.redirect(req.path.substring(0, req.path.length - 7));
        } catch (err) {
            res.send(err.toString());
        }
    }
};
