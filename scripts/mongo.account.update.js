const mongoose = require('mongoose');

const accountApi = require('../app/ethereum/api/account.api');
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
}, async (err, result) => {
    let user = result;
    if (err) {
        console.log(err);
        if(user === undefined) {

            // 계정을 만듦
            const ethAccount = await accountApi.makeNewAccount("asdf1234");

            Account.register(new Account(
                {
                    username: 'region@eleciton.com',
                    etherAccount: ethAccount.address
                }), password, (err, account) => {
                    if (err) {
                        return console.error(err);
                    }
                user = account;
            });
        } else {
            return console.log(err.message);
        }
    }
    user.etherAccount = contractAddress['test_region_address'];
    user.deployElections = [{
        address: contractAddress['test_region_contract'],
        finite: false
    }];
    await user.save((err) => {
        if (err) return console.log(err.message);
        console.info("지방선거 완료");
        process.exit();
    })
});
