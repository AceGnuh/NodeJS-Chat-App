var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// the callback after google has authenticated the user
router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/account/login',
    }));


module.exports = router;