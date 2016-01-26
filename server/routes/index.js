var express = require('express');
var path = require('path');
var passport = require('passport');

var router = express.Router();

router.get('/success', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/views/success.html'));
});

router.get('/failure', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/views/failure.html'));
});

router.get('/getUser', function(request, response) {
    response.send(request.user);
});

router.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../public/views/index.html'));
});


router.post('/', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failure'
}));

module.exports = router;