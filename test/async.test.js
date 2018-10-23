
const ipfsApi = require('../app/ipfs/ipfs.api');
const Hec = require('../app/hec/hec');
const waterfall = require('async/waterfall');


const createHePublicKey = async (
    electionAddress,
    electionOwner,
    p, L, cb
) => {
    await Hec.createKeys(electionAddress, p, L, 'data', async () => {
        const publicKeyFilePath = "./data/publicKey/" + electionAddress + ".bin";
        const fileSize = fs.statSync(publicKeyFilePath).size;
        if (fileSize > 0) {
            console.log("Success to create He's PublicKey!");
            cb(null, publicKeyFilePath);
        } else {
            console.error("failed: file not Saved");
            cb(new Error("failed: file not Saved"), null);
        }
    });
};

describe('async test', () => {
    it('...', async ()=> {
        // 공개키 만든 후 IPFS에 공개키 저장
        await waterfall([(cb) => createHePublicKey('0x721404D77e7fb27be7F2dc3C2d432d475aF0Aec5', '0xb84c8ccc2f15bb7c84cd742e9053a29ba1a7023f', 257, 8, cb),
                (publicKeyFilePath, cb) => ipfsApi(publicKeyFilePath, '0x721404D77e7fb27be7F2dc3C2d432d475aF0Aec5', '0xb84c8ccc2f15bb7c84cd742e9053a29ba1a7023f', cb)],
            (err, result) => {
                if(result) {
                    console.log(`Success to create!`);
                } else {
                    console.log(`Fail to create...`);
                }
            }
        );
    });
});