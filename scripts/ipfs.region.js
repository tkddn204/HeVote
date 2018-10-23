const ipfs = require('../app/ipfs/ipfs');
const fs = require('fs');
const Election = require('../app/ethereum/election');
const contractInformation = require('../config/contract-address.json');
const config = require('../config');
const parallel = require('async/parallel');

const contractAddress = contractInformation['test_region_contract'];
const ownerAddress = contractInformation['test_region_address'];

const addPublicKeyOfHe = (contractAddress, ownerAddress) => {
    const publicKeyFilePath = `${config.root}/data/publicKey/${contractAddress}.bin`;
    const publicKeyFile = fs.readFileSync(publicKeyFilePath);
    let buffer = new Buffer.from(publicKeyFile);

    parallel([(cb) => ipfs.files.add(buffer, cb)], async (err, ers) => {
        if (err) {
            console.log(err);
            return;
        }
        const publicKeyFileHash = res[0].hash;
        console.log(`publicKey Hash : ${publicKeyFileHash}`);
        await Election(contractAddress).methods
            .setPublicKeyOfHe(publicKeyFileHash).send({from: ownerAddress});
        console.log("ipfs-contract saved.");
    });
};

module.exports = addPublicKeyOfHe;
