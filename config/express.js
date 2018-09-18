const path = require('path');
const express = require('express');
const session = require('express-session');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
// const csrf = require('csurf');
const flash = require('connect-flash');
const winston = require('winston');
const mongoStore = require('connect-mongo')(session);

const config = require('./');

const env = process.env.NODE_ENV || 'development';

module.exports = (app, passport) => {
    // favicon 설정
    // app.use(favicon(__dirname + '/public/favicon.ico'));

    app.use(compression());

    // 로그 설정
    let log = 'dev';
    if (env !== 'development') {
        log = {
            stream: {
                write: message => winston.info(message)
            }
        };
    }
    app.use(logger(log));

    // view engine 설정
    app.set('views', `${config.root}/app/views`);
    app.set('view engine', 'pug');

    // bodyParser 설정
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));


    let sessionOptions = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    };
    if (app.get('env') === 'production') {
        app.set('trust proxy', 1) // trust first proxy
        sessionOptions.cookie.secure = true // serve secure cookies
    }

    // session 설정
    app.use(session(sessionOptions));

    // passport 초기화
    app.use(passport.initialize());
    app.use(passport.session());

    // flash 설정
    app.use(flash());

    // csrf
    // app.use(csrf());
    // app.use((req, res, next) => {
    //     res.locals.csrfToken = req.csrfToken();
    //     next();
    // });

    app.use(express.static(path.join(config.root, 'public')));

    app.use((req, res, next) => {
        if(req.isAuthenticated()) {
            res.locals.user = req.user || null;
        }
        return next();
    });

    if (env === 'development') {
        app.locals.pretty = true;
    }
};