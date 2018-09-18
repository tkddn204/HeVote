'use strict';

exports.requireLogin = (req, res, next) => {
    if(res.locals.user) {
        res.locals.user = req.user;
        return next();
    }
    res.redirect('/login');
};