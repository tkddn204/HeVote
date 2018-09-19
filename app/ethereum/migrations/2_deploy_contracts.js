const fs = require('fs');
const timeUtil = require('../../utils/time.util');
const ElectionFactory = artifacts.require('./ElectionFactory.sol');
const Election = artifacts.require('./Election.sol');
const hec = require('../../hec/hec.js');
const config = require('../../../config');

module.exports = (deployer, network, accounts) =>
    deployer.then(async () => {
        await deployer.deploy(ElectionFactory);
        const deployedElectionFactory = await ElectionFactory.deployed();

        await deployedElectionFactory.makeNewElection(
            '6.13 대전 지방선거',
            '이번 선거에서 선출된 공직자의 임기는 4년(2018. 7. 1.~2022. 6. 30.)이며, 재보궐선거의 경우 전임자의 잔여임기(~2020. 5. 29.)까지 업무를 수행하게 된다.',
            accounts[1],
            timeUtil.dateStringToTimestamp('09/10/2018 06:00:00'),
            timeUtil.dateStringToTimestamp('10/10/2018 18:00:00'),
            false);

        const deployedPublicElections = await deployedElectionFactory.getDeployedElections.call(false);
        console.log('지방선거 : ' + deployedPublicElections[0]);

        // 지방선거 투표에 후보자 추가
        const deployedRegionElection = await Election.at(deployedPublicElections[0]);
        const regionCandidateList = ['홍길동', '김영희', '박철수', '고길동'];
        const regionCandidateCommitment = [
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

        // 파일에 저장
        await fs.open(`${config.root}/config/contract-address.json`, 'w', (err, fd) => {
            if (err) throw 'error opening file: ' + err;
            const jsonObj = {
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


        if(!fs.existsSync('./data')) {
            fs.mkdirSync('./data');
            fs.mkdirSync('./data/candidate');
            fs.mkdirSync('./data/publicKey');
            fs.mkdirSync('./data/result');
            fs.mkdirSync('./data/secretKey');
        }

        // hec으로 공개키를 저장합니다.
        await hec.createKeys(deployedPublicElections[0], 10007, 7, 'data', async () => {
            const publicKeyFilePath = "./data/publicKey/" + deployedPublicElections[0] + ".bin";
            const fileSize = fs.statSync(publicKeyFilePath).size;
            if (fileSize > 0) {
                console.log("good. Key files saved");
            } else {
                console.error("failed: file not Saved");
            }
        });
        // 이후 ipfs.region.js 스크립트를 실행하면 됩니다.
    });
