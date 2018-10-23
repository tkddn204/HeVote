const passport = require('passport');
const Account = require('../models/account');
const accountApi = require('../ethereum/api/account.api');
const electionApi = require('../ethereum/api/election.api');
const electionFactoryApi = require('../ethereum/api/election.factory.api');

exports.register = (req, res) =>
    res.render('account/register');

// https://stackoverflow.com/a/46181/6656470
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.create = async (req, res, next) => {
    const {username, password} = req.body;

    if (!validateEmail(username)) {
        return res.render('account/register', {error: "Wrong Email!"});
    }

    // 계정을 만듦
    const ethAccount = await accountApi.makeNewAccount(password);

    Account.register(new Account(
        {
            username: username,
            etherAccount: ethAccount.address
        }), password, (err, account) => {
        if (err) {
            return res.render('account/register', {error: err.message});
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
};

exports.login = (req, res) => {
    if (req.user) res.redirect('/');
    res.render('account/login', {error: req.flash('error')});
};

exports.signIn = (req, res, next) =>
    req.session.save((err) => {
        if (err) return next(err);
        res.redirect('/');
    });

exports.logout = (req, res, next) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
};

exports.myInfo = async (req, res) => {
    if (!req.user) {
        res.redirect('/login')
    }

    const user = req.user;

    let votingElectionsSummaryList = [];
    let deployedElectionsSummaryList = [];
    if (user.votingElections) {
        if (user.votingElections.length) {
            votingElectionsSummaryList = await electionApi.getElectionSummaryList({
                electionList: req.user.votingElections
            });
        }
    } else {
        votingElectionsSummaryList = [];
    }
    if (user.deployedElections) {
        if (user.deployedElections.length) {
            deployedElectionsSummaryList = await electionApi.getElectionSummaryList({
                electionList: req.user.deployedElections
            });
        }
    } else {
        deployedElectionsSummaryList = [];
    }

    const isAdmin = await electionFactoryApi.getOwner() === req.user.etherAccount;

    res.render('account/myInfo', {
        votingElections: votingElectionsSummaryList,
        deployedElections: deployedElectionsSummaryList,
        isAdmin: isAdmin
    });
};