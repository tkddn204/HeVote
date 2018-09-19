const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    username: String,
    password: String,
    etherAccount: String,
    votingElections: [{address: String, isFinite: Boolean}],
    deployedElections: [{address: String, isFinite: Boolean}]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
