const electionFactoryApi = require('../app/ethereum/api/election.factory.api');
const electionApi = require('../app/ethereum/api/election.api');
const candidateApi = require('../app/ethereum/api/candidate.api');
const contractInformation = require('../config/contract-address.json');
const timeUtil = require('../app/utils/time.util');

const web3 = require('../app/ethereum/web3');
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
    const endDateTime = timeUtil.dateStringToTimestamp(endDate);
    // 선거 생성
    await electionFactoryApi.makeNewElection(
        contractInformation['admin_address'],
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

const makeNewElection = async (params) => {
    const electionAddress = await makeNewContract(
        params.electionName,
        params.electionDescription,
        params.electionOwner,
        params.startDate,
        params.endDate,
        params.finiteElection);
    console.log("Contract Created! Address: ", electionAddress);
    await addCandidates(
        electionAddress,
        params.electionOwner,
        params.candidateList,
        params.candidateCommitmentList
    );
    console.log("Add Candidates Success.");
    await createHePublicKey(
        electionAddress,
        params.electionOwner,
        params.p, params.L);
    console.log("Create He's PublicKey");
    await saveHePublicKeyOfIpfsHash(
        electionAddress,
        params.electionOwner
    );
    console.log("Save He's PublicKey To Contract And Save To IPFS!")
};

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const electionParams = {};

const questionList = [
    'Election Name: ',
    'Election Description: ',
    'Election Owner: ',
    'Election Start Date: ',
    'Election End Date: ',
    'Is election Finite?(y/n): ',
    'Candidate List: ',
    'Candidate Commitment List: ',
    'The P of Helib: ',
    'The L of Helib: ',
    'good?(y/n): '
];

const functionList = [
    (electionName) => electionParams.electionName = electionName,
    (electionDescription) => electionParams.electionDescription = electionDescription,
    (electionOwner) => electionParams.electionOwner = electionOwner.toLowerCase(),
    (startDate) => electionParams.startDate = startDate,
    (endDate) => electionParams.endDate = endDate,
    (electionFinite) => electionParams.finiteElection = electionFinite === 'y' || electionFinite === 'Y',
    (candidateList) => electionParams.candidateList = candidateList.split(','),
    (candidateCommitmentList) => electionParams.candidateCommitmentList = candidateCommitmentList.split(','),
    (p) => electionParams['p'] = parseInt(p),
    (L) => {
        electionParams['L'] = parseInt(L);
        console.log(electionParams);
    },
    (good) => {
        if (good === 'y' || good === 'Y') {
            rl.close();
            makeNewElection(electionParams).then(() => {
                console.log("done!");
                process.exit(0);
            }).catch(e => {
                console.error(e);
                process.exit(1);
            })
        } else {
            console.log(rl.history);
            rl.close();
            process.exit(0);
        }
    }
];

let questionIndex = 1;

const question = async (questionContent, func) => {
    return rl.question(questionContent, (result) => {
        func(result);
        if (questionIndex < questionList.length) {
            question(questionList[questionIndex], functionList[questionIndex++])
        }
    })
};


question(questionList[0], functionList[0]);
