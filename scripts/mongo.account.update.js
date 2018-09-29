const mongoose = require('mongoose');

const accountApi = require('../app/ethereum/api/account.api');
const Account = require('../app/models/account');
const config = require('../config');
const contractAddress = require('../config/contract-address.json');

mongoose.connect(config.db, err => {
    if(err) console.error(err.message);
    else console.log("mongoDB connected.")
});

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

const password = 'asdf1234';

// DB 변경
Account.findOne({
    'username': 'region@election.com'
}, async (err, result) => {
    if (err) {
        return console.log(err.message);
    }
    if(result === undefined) {

        // 계정을 만듦
        const ethAccount = await accountApi.makeNewAccount(password);

        Account.register(new Account(
            {
                username: 'region@eleciton.com',
                etherAccount: ethAccount.address
            }), password, (err, account) => {
            if (err) {
                return console.error(err);
            }
            return updateUserDeploy(account);
        });
    } else {
        return updateUserDeploy(result);
    }
});
