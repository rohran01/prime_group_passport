var express = require('express');
var path = require('path');
var passport = require('passport');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/bank';

var router = express.Router();

router.get('/success', function(request, response) {
    if(request.isAuthenticated()) {
        response.sendFile(path.join(__dirname, '../public/views/success.html'));
    } else {
        response.redirect('/');
    }
});

router.get('/failure', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/views/failure.html'));
});

router.get('/getUser', function(request, response) {
    response.send(request.user);
});

router.get('/logOut', function(request, response) {
    console.log('logged out user', request.user);
    request.logout();
    response.redirect('/');
});

router.post('/makePayment', function(request, response) {
    console.log(request.body);
    console.log(request.user);

    var autoPayment = request.body.autoPayment;
    var homePayment = request.body.homePayment;
    var newBalance = request.user.account_balance - autoPayment - homePayment;
    var userId = request.user.id;
    var updatedUser = {};

    pg.connect(connectionString, function(err, client) {
        if (err) {
            console.log(err);
        }

        var query = client.query("UPDATE user_data SET account_balance=$1, car_loan=$2, home_loan=$3 WHERE id = $4", [newBalance, request.user.car_loan - autoPayment, request.user.home_loan - homePayment, userId]);

        query.on('row', function (row) {
            updatedUser = row;
        });

        query.on('end', function () {
            client.end();
        });
    });

    response.redirect('/success');
});

router.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/*', function(request, response){
    response.redirect('/');
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failure'
}));

module.exports = router;
