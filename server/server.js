var express = require('express');
var index = require('./routes/index');
var pg = require('pg');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var connectionString = 'postgres://localhost:5432/bank';
var app = express();
var localStrategy = require('passport-local').Strategy;

app.use(express.static('server/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'openSesame',
    resave: true,
    key: 'user',
    saveUninitialized: false,
    cookie: {maxAge: 60000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    pg.connect(connectionString, function(error, client) {
        if(error) {
            console.log(error);
        }

        var user = {};
        var query = client.query('SELECT * FROM user_data WHERE id = $1', [id]);

        query.on('row', function(row) {
            user = row;
            done(null, user);
        })

    })
});

passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'username'
}, function(req, username, password, done) {

    pg.connect(connectionString, function(error, client) {
        if(error) {
            console.log(error);
        }

        var user = {};
        var query = client.query('SELECT * FROM user_data WHERE username = $1', [username]);

        query.on('row', function(row) {
            user = row;
        });

        query.on('end', function() {
            if(user && user.password === password) {
                console.log('Logged in user', user.username);
                done(null, user);
            } else {
                done(null, false, {message: 'WRONG!'});
            }
        });
    });
}));

app.use('/', index);

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Listening on port', 3000);
});
