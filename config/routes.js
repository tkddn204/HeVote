const election = require('../app/controllers/elections');
const accounts = require('../app/controllers/accounts');
const vote = require('../app/controllers/votes');

const middleware = require('./middlewares');
const requireLogin = middleware.requireLogin;

/* Router Lists */
module.exports = (app, passport) => {
    app
        .get('/', (req, res) => res.render('index'))

        // accounts
        .get('/register', accounts.register)
        .post('/register', accounts.create)
        .get('/login', accounts.login)
        .post('/login', passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }), accounts.signIn)
        .get('/logout', requireLogin, accounts.logout)
        .get('/myInfo', requireLogin, accounts.myInfo)

        // elections
        .get('/election/create', requireLogin, election.electionCreatePage)
        .post('/election/create', requireLogin, election.electionCreate)
        .get('/election/request', requireLogin, election.electionRequestPage)
        .post('/election/request', requireLogin, election.electionRequestUser)
        .get('/:election(public|finite)', election.index)
        .get('/:election(public|finite)/:address', election.detail)
        .post('/:election(public|finite)/:address', requireLogin, election.changeState)
        .post('/:election(public|finite)/:address/modify', requireLogin, election.changeInformation)

        // votes
        .get('/:election(public|finite)/:address/vote', vote.getVote)
        .post('/:election(public|finite)/:address/vote', requireLogin, vote.postVote);

    /**
     * 에러핸들링
     */

    // 404
    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res) {
            res.status(err.status || 500);
            res.render('base/error', {
                message: err.message,
                error: err
            });
        });
    }
};