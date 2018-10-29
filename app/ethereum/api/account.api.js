const web3 = require('../web3');
const contractInformation = require('../../../config/contract-address.json');

const makeNewAccount = async (password) => {
    const account = await web3.eth.accounts.create(password);
    await web3.eth.sendTransaction({
        from: contractInformation['admin_address'],
        to: account.address,
        value: web3.utils.toWei('0.1', 'ether'),
        gasLimit: 21000
    });
    return account
};

module.exports = {
    makeNewAccount
};