const fs = require('fs');
const timeUtil = require('../../utils/time.util');
const ElectionFactory = artifacts.require('./ElectionFactory.sol');
const Election = artifacts.require('./Election.sol');
const config = require('../../../config');
const Hec = require("../../hec/hec");
const ipfsApi = require("../../ipfs/ipfs.api");

module.exports = (deployer, network, accounts) =>
    deployer.then(async () => {
        await deployer.deploy(ElectionFactory);
        const deployedElectionFactory = await ElectionFactory.deployed();

        await deployedElectionFactory.makeNewElection(
            '대전 지방선거',
            // 'Daejeon Mayoral Election',
            '이번 선거에서 선출된 공직자의 임기는 4년이며, 재보궐선거의 경우 전임자의 잔여임기까지 업무를 수행하게 된다.',
            // 'The Daejeon Mayoral Election is an election of the Republic of Korea to elect mayor of Daejeon.',
            accounts[1],
            timeUtil.dateStringToTimestamp('10/10/2018 06:00:00'),
            timeUtil.dateStringToTimestamp('10/30/2018 18:00:00'),
            false);

        const deployedPublicElections = await deployedElectionFactory.getDeployedElections.call(false);
        console.log('지방선거 : ' + deployedPublicElections[0]);

        const deployedRegionElection = await Election.at(deployedPublicElections[0]);

        // 지방선거 상태를 진행 중으로 변경
        await deployedRegionElection.setElectionState(1, {from: accounts[1]});

        // 지방선거 투표에 후보자 추가
        const regionCandidateList = ['홍길동', '김영희', '박철수', '고길동']; //['Hong Gil-Dong','Kim Young-Hee','Park Cheol-soo','Go gil-dong'];
        const regionCandidateCommitment = [
            // 'I will do my best for the citizens!',
            // 'I will do the right politics!',
            // 'I will move forward for a bright society!',
            // 'I will act for economic development!'
            '시민을 위해 노력하겠습니다!',
            '올바른 정치를 하겠습니다!',
            '밝은 사회를 위해 전진하겠습니다!',
            '경제 발전을 위해 행동하겠습니다!'
        ];
        for (let i = 0; i < regionCandidateList.length; i++) {
            await deployedRegionElection.addCandidate(
                regionCandidateList[i],
                regionCandidateCommitment[i],
                {from: accounts[1]}
            );
        }

        // config/contract-address.json에 저장
        await fs.open(`${config.root}/config/contract-address.json`, 'w', (err, fd) => {
            if (err) throw 'error opening file: ' + err;
            const jsonObj = {
                admin_address: accounts[0],
                factory: deployedElectionFactory.address,
                test_region_contract: deployedPublicElections[0],
                test_region_address: accounts[1]
            };
            fs.writeFile(`${config.root}/config/contract-address.json`,
                new Buffer.from(JSON.stringify(jsonObj)), 'utf8', (err) => {
                    if (err) throw 'error writing file: ' + err;
                    fs.close(fd, () => console.log(JSON.stringify(jsonObj)));
                });
        });

        // data 디렉토리 생성
        Hec.makeDataDirectory();
        // hec으로 공개키를 저장합니다.
        try {
            await new Promise((resolve, reject) => series([
                    async (cb) => {
                        await Hec.createKeys(deployedPublicElections[0], 257, 8, 'data', () => {
                            const publicKeyFilePath = "./data/publicKey/" + deployedPublicElections[0] + ".bin";
                            const fileSize = fs.statSync(publicKeyFilePath).size;
                            if (fileSize > 0) {
                                console.log("good. Key files saved");
                                cb(null, true);
                            } else {
                                cb(new Error("failed: file not Saved"), false);
                            }
                        });
                    },
                    async (cb) => {
                        try {
                            const result = await ipfsApi(deployedPublicElections[0], accounts[1]);
                            cb(null, result);
                        } catch (e) {
                            cb(e, false);
                        }
                    }],
                (err, result) => {
                    if (err) {
                        console.log(`Fail to create 대전 지방선거...`);
                        reject(err);
                    } else {
                        console.log(`Success to create 대전 지방선거!`);
                        resolve(result);
                    }
                }
            ));
        } catch (e) {
            console.error(e);
        }
    });
