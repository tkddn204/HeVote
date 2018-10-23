const Election = require('../election');

const voterState = {
    "0": "None",
    "1": "VoteAble",
    "2": "Voted"
};

const addVoterToVoterList = async (electionAddress, ownerAddress, voterAddress) =>
    await Election(electionAddress).methods.addVoterToVoterList(voterAddress)
        .send({from: ownerAddress});

const removeVoterFromVoterList = async (electionAddress, ownerAddress, voterAddress) =>
    await Election(electionAddress).methods.removeVoterFromVoterList(voterAddress)
    .send({from: ownerAddress});

const getVotedVoterList = async (electionAddress) =>
    await Election(electionAddress).methods.getVotedVoterList().call();

const getTotalVoterCount = async (electionAddress) =>
    await Election(electionAddress).methods.getTotalVoterCount().call();

const getVoterState = async (electionAddress, voterAddress) => {
    const rawVoterState = await Election(electionAddress).methods.getVoterState(voterAddress).call();
    return voterState[rawVoterState];
};

module.exports = {
    addVoterToVoterList,
    removeVoterFromVoterList,
    getVotedVoterList,
    getTotalVoterCount,
    getVoterState
};