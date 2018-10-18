const electionFactoryApi = require('../app/ethereum/api/election.factory.api');
const electionApi = require('../app/ethereum/api/election.api');
const candidateApi = require('../app/ethereum/api/candidate.api');
const adminAddress = require('../config/contract-address.json')['admin_address'];
const timeUtil = require('../app/utils/time.util');

const ipfs = require('../app/ipfs/ipfs');
const fs = require('fs');
const config = require('../config');

const makeNewContract = async (
    electionName,
    electionDescription,
    electionOwner,
    startDate,
    endDate,
    finiteElection) => {

    const startDateTime = timeUtil.dateStringToTimestamp(startDate);
    const endDateTime = timeUtil.dateStringToTimestamp(startDate);

    // 선거 생성
    await electionFactoryApi.makeNewElection(
        adminAddress,
        electionName,
        electionDescription,
        electionOwner,
        startDateTime,
        endDateTime,
        finiteElection
    );

    const deployedElections = await electionFactoryApi.getDeployedElections(finiteElection);
    const electionAddress = deployedElections[deployedElections.length - 1];

    // 현재 날짜가 시작 날짜와 종료 날짜 사이에 있으면 상태를 진행 중으로 변경
    const currentDateTime = new Date() / 1000;
    if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
        await electionApi.setElectionState(electionAddress, electionOwner, 1);
    }
    return electionAddress;
};

const addCandidates = async (
    electionAddress,
    electionOwner,
    candidateList,
    candidateCommitmentList) => {

    for (let i = 0; i < candidateList.length; i++) {
        await candidateApi.addCandidate(
            electionAddress,
            electionOwner,
            candidateList[i],
            candidateCommitmentList[i]);
    }
};

const createHePublicKey = async (
    electionAddress,
    electionOwner,
    p, L
) => {
    await Hec.createKeys(electionAddress, p, L, 'data', async () => {
        const publicKeyFilePath = "./data/publicKey/" + electionAddress + ".bin";
        const fileSize = fs.statSync(publicKeyFilePath).size;
        if (fileSize > 0) {
            console.log("good. Key files saved");
        } else {
            console.error("failed: file not Saved");
        }
    });
};

const saveHePublicKeyOfIpfsHash = async (
    electionAddress,
    electionOwner
) => {
    const publicKeyFilePath = `${config.root}/data/publicKey/${electionAddress}.bin`;
    const publicKeyFile = fs.readFileSync(publicKeyFilePath);
    let buffer = new Buffer.from(publicKeyFile);

    ipfs.files.add(buffer, async (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        const publicKeyFileHash = res[0].hash;
        console.log(`publicKey Hash : ${publicKeyFileHash}`);
        await electionApi.setPublicKeyOfHe(electionAddress, electionOwner, publicKeyFileHash);
        console.log("ipfs-contract saved.");
    });
};

const makeNewElection = async (
    electionName,
    electionDescription,
    electionOwner,
    startDate,
    endDate,
    finiteElection,
    candidateList,
    candidateCommitmentList,
    p, L
) => {
    const electionAddress = await makeNewContract(
        electionName,
        electionDescription,
        electionOwner,
        startDate,
        endDate,
        finiteElection);
    await addCandidates(
        electionAddress,
        electionOwner,
        candidateList,
        candidateCommitmentList
    );
    await createHePublicKey(
        electionAddress,
        electionOwner,
        p, L);
    await saveHePublicKeyOfIpfsHash(
        electionAddress,
        electionOwner
    );
};

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const electionParams = {};

rl.question('Election Name: ', (electionName) => {
    electionParams['electionName'] = electionName;

    rl.question('Election Description: ', (electionDescription) => {
        electionParams['electionDescription'] = electionDescription;

        rl.question('Election Owner: ', (electionOwner) => {
            electionParams['electionOwner'] = electionOwner;

            rl.question('Election Start Date: ', (startDate) => {
                electionParams['startDate'] = startDate;

                rl.question('Election End Date: ', (endDate) => {
                    electionParams['endDate'] = endDate;

                    rl.question('Is election finite?(y/n) : ', (electionFinite) => {
                        electionParams['finiteElection'] = electionFinite === 'y' || electionFinite === 'Y';

                        rl.question('Candidate List: ', (candidateList) => {
                            electionParams['candidateList'] = candidateList.split(',');

                            rl.question('Candidate Commitment List: ', (candidateCommitmentList) => {
                                electionParams['candidateCommitmentList'] = candidateCommitmentList.split(',');

                                rl.question('The P of Helib : ', (p) => {
                                    electionParams['p'] = parseInt(p);

                                    rl.question('The L of Helib : ', (L) => {
                                        electionParams['L'] = parseInt(L);

                                        console.log(electionParams);
                                        console.log("\n");
                                        rl.question('good?(y/n): ', (good) => {
                                            if (good === 'y' || good === 'Y') {
                                                rl.close();
                                                makeNewElection(
                                                    electionParams.electionName,
                                                    electionParams.electionDescription,
                                                    electionParams.electionOwner,
                                                    electionParams.startDate,
                                                    electionParams.endDate,
                                                    electionParams.finiteElection,
                                                    electionParams.candidateList,
                                                    electionParams.candidateCommitmentList,
                                                    electionParams.p,
                                                    electionParams.L).then(() => {
                                                    console.log("done!");
                                                });
                                            } else {
                                                // TODO: 다시
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


