
const path = require('path');

const root = path.join(__dirname, '..');
require('dotenv').config({path: `${root}/.env`});
const env = process.env;

let db;
if(env.MONGO_ID) {
    db = `mongodb://${env.MONGO_ID}:${env.MONGO_PASS}@${env.MONGO_URL}:${env.MONGO_PORT}/vote`;
} else {
    db = `mongodb://${env.MONGO_URL}/${env.MONGO_PORT}/vote`;
}

const defaults = {
    root: root,
    db: db
};

module.exports = {
    development: Object.assign({}, defaults)
}[env.NODE_ENV || 'development'];
