// author: mjhea0<michael@mherman.org>, Hyein<hyeinu65@gmail.com>
// modified by: SsangWoo<tkddn204@gmail.com>

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
