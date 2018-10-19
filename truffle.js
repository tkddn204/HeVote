const path = require('path');
const config = require('./config');
require('dotenv').config({path: `${config.root}/.env`});
const env = process.env;


module.exports = {
    contracts_directory: "./app/ethereum/contracts",
    migrations_directory: "./app/ethereum/migrations",
    contracts_build_directory: path.join(__dirname, "./app/ethereum/build/contracts"),
    test_directory: "./test/ethereum",
    networks: {
        development: {
            host: env.ETHER_URL,
            port: env.ETHER_PORT,
            network_id: env.ETHER_NETWORK_ID
        }
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 500
        }
    }
};
