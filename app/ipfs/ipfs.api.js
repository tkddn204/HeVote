const ipfs = require('./ipfs');
const fs = require('fs');

const electionApi = require('../../app/ethereum/api/election.api');
const config = require('../../config');

const addPublicKeyOfHe = (publicKeyFilePath, contractAddress, ownerAddress, cb) => {
    let publicKeyFile;
    if (publicKeyFilePath == null) {
        const publicKeyFilePath = `${config.root}/data/publicKey/${contractAddress}.bin`;
        publicKeyFile = fs.readFileSync(publicKeyFilePath);
    } else {
        publicKeyFile = fs.readFileSync(publicKeyFilePath);
    }
    let buffer = new Buffer.from(publicKeyFile);

    return new Promise((resolve, reject) => ipfs.files.add(buffer, async (err, res) => {
        if (err) {
            console.log(err);
            reject(err, false);
            return;
        }
        const publicKeyFileHash = res[0][0].hash;
        console.log(`publicKey Hash : ${publicKeyFileHash}`);
        await electionApi.setPublicKeyOfHe(contractAddress, ownerAddress, publicKeyFileHash);
        console.log("ipfs-contract saved.");
        resolve(null, true);
   }));
};

module.exports = addPublicKeyOfHe;
