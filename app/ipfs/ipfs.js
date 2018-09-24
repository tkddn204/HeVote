// using the infura.io node, otherwise ipfs requires you to run a
// daemon on your own computer/server.

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// If IPFS runs with local daemon,
// const ipfs = new IPFS(‘localhost’, ‘5001’, {protocol:‘http’});

module.exports = ipfs;
