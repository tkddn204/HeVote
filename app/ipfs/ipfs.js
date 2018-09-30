// using the infura.io node, otherwise ipfs requires you to run a
// daemon on your own computer/server.
require('dotenv').config();
const env = process.env;

const IPFS = require('ipfs-api');
const ipfs = new IPFS({
    host: env.IPFS_URL,
    port: env.IPFS_PORT,
    protocol: 'https'
});

// If IPFS runs with local daemon,
// const ipfs = new IPFS(‘localhost’, ‘5001’, {protocol:‘http’});

module.exports = ipfs;
