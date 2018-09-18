const mongoose = require('mongoose');

const Account = require('../app/models/account');
const config = require('../config');
const contractAddress = require('../config/contract-address.json');

mongoose.connect(config.db, err => {
    if(err) console.error(err.message);
    else console.log("mongoDB connected.")
});

// DB 변경
Account.findOne({
    'username': 'region@election.com'
}, (err, account) => {
    if (err) return console.log(err.message);
    account.etherAccount = contractAddress['test_region_address'];
    account.deployedVotes = [contractAddress['test_region_contract']];
    account.save((err) => {
        if (err) return console.log(err.message);
        console.info("지방선거 완료");
        process.exit();
    })
});
