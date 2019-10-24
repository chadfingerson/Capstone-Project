const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const auth0 = require('./lib/auth0');
const app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var secured = require('./lib/secured');

// Load environment variables from .env
var dotenv = require('dotenv');
dotenv.config();

// Load Passport
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: 'http://localhost:8800/callback'
},
function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
});

passport.use(strategy);

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('PORT', 8800);

app.use(express.static('public'));

var session = require('express-session');
var sess = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true
};

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Point to user location
app.use('/users', secured.User(), require('./users/main.js'));

// Point to admin location
app.use('/admin', secured.Admin(), require('./admin/main.js'));

// Load login page
app.get('/', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), function (req, res) {
    res.redirect('/');
});

app.get('/callback', function (req, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/'); }
        req.logIn(user, function (err) {
        if (err) { return next(err); }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            auth0.getRole(user.id).then( (userRole) => {
                if (userRole == 'Users') {
                    req.session.role = 'Users';
                    res.redirect(returnTo || '/users');
                } else if (userRole == 'Admin') {
                    req.session.role = 'Admin';
                    res.redirect(returnTo || '/admin');
                } else {
                    res.status(403).send('Access is not authorized');
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        });
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout();
    var returnTo = req.protocol + '://' + req.hostname;
    var port = req.connection.localPort;
    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo += ':' + port;
    }
    var logoutUrl = 'https://' + process.env.AUTH0_DOMAIN + '/v2/logout';
    logoutUrl += '?returnTo=' + returnTo + '&client_id=' + process.env.AUTH0_CLIENT_ID
    res.redirect(logoutUrl);
});

app.use((req, res) => {
    res.status(400).send('Not Found');
});

app.use((err, req, res) => {
    console.log(err);
    res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
    const server = app.listen(app.get('PORT'), () => {
        const port = server.address().port;
        console.log(`App listening on port ${port}`);
    });
}

module.exports = app;