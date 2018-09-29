const mongoose = require('mongoose');

const accountApi = require('../app/ethereum/api/account.api');
const Account = require('../app/models/account');
const config = require('../config');
const contractAddress = require('../config/contract-address.json');

mongoose.connect(config.db, { useNewUrlParser: true })
    .then(() => console.log("mongoDB connected."))
    .catch(err => console.error(err.message));

const updateUserDeploy = async (user) => {
    user.etherAccount = contractAddress['test_region_address'];
    user.deployElections = [{
        address: contractAddress['test_region_contract'],
        finite: false
    }];
    return await user.save((err) => {
        if (err) return console.log(err.message);
        console.info("지방선거 완료");
        process.exit();
    })
};

// DB 변경
Account.findOne({
    'username': 'region@election.com'
}, async (err, result) => {
    if (err) {
        return console.log(err.message);
    }
    if(result === undefined) {
        return console.log("계정을 만들어주세요!");
    } else {
        return updateUserDeploy(result);
    }
});
