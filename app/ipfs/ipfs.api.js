const ipfs = require('./ipfs');
const fs = require('fs');

const electionApi = require('../../app/ethereum/api/election.api');
const config = require('../../config');
const parallel = require('async/parallel');

const addPublicKeyOfHe = async (contractAddress, ownerAddress, cb) => {
    const publicKeyFilePath = `${config.root}/data/publicKey/${contractAddress}.bin`;
    const publicKeyFile = fs.readFileSync(publicKeyFilePath);
    let buffer = new Buffer.from(publicKeyFile);

    await parallel([(cb) => ipfs.files.add(buffer, cb)], async (err, res) => {
        if (err) {
            console.log(err);
            cb(err, false);
            return;
        }
        const publicKeyFileHash = res[0][0].hash;
        console.log(`publicKey Hash : ${publicKeyFileHash}`);
        await electionApi.setPublicKeyOfHe(contractAddress, ownerAddress, publicKeyFileHash);
        console.log("ipfs-contract saved.");
        cb(null, true);
    });
};

module.exports = addPublicKeyOfHe;
