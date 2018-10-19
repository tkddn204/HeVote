const ipfs = require('../app/ipfs/ipfs');
const fs = require('fs');
const electionApi = require('../app/ethereum/api/election.api');
const electionInformation = require('./election-contract.json');
const config = require('../config');

const contractAddress = electionInformation.contractAddress;
const ownerAddress = electionInformation.ownerAddress;

const publicKeyFilePath = `${config.root}/data/publicKey/${contractAddress}.bin`;
const publicKeyFile = fs.readFileSync(publicKeyFilePath);
let buffer = new Buffer.from(publicKeyFile);

ipfs.files.add(buffer, async (err, res) => {
    if (err) {
        console.log(err);
        return;
    }
    const publicKeyFileHash = res[0].hash;
    console.log(`publicKey Hash : ${publicKeyFileHash}`);

    await electionApi.setPublicKeyOfHe(contractAddress, ownerAddress, publicKeyFileHash);

    console.log("ipfs-contract saved.");

    fs.unlink("./election-contract.json");
});
