const mongoose = require('mongoose');

const accountApi = require('../app/ethereum/api/account.api');
const Account = require('../app/models/account');

const passport = require('passport');
require('../config/passport')(passport);

const config = require('../config');
const contractAddress = require('../config/contract-address.json');

mongoose.connect(config.db, { useNewUrlParser: true })
    .then(() => console.log("mongoDB connected."))
    .catch(err => console.error(err.message));

const updateUserDeploy = async (user) => {
    user.etherAccount = contractAddress['test_region_address'];
    user.deployedElections = [{
        address: contractAddress['test_region_contract'],
        finite: false
    }];
    return await user.save((err) => {
        if (err) return console.log(err.message);
        console.info("지방선거 완료");
        process.exit();
    })
};

const admin = {
    'username': 'region@election.com',
    'password': 'asdf1234'
};

// DB 변경
Account.findOne({
    'username': admin.username
}, async (err, result) => {
    if (err) {
        return console.error(err.message);
    }
    if(result === undefined) {
        Account.register(new Account(
            {
                username: admin.username,
                etherAccount: (await accountApi.makeNewAccount(admin.password)).address
            }), admin.password, (err, account) => {
            if (err) {
                return console.error(err.message);
            }
            passport.authenticate('local');
            return updateUserDeploy(result);
        });
    } else {
        return updateUserDeploy(result);
    }
});
