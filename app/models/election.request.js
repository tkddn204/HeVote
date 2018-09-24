const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const electionRequest = new Schema({
    username: String,
    electionOwner: String,
    finiteElection: Boolean,
    electionName: String,
    electionDescription: String,
    voterCount: Number,
    startDate: Number,
    endDate: Number
});

module.exports = mongoose.model('electionRequests', electionRequest);
