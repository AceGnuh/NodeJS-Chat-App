const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

class AccountController {
    showLogin(req, res) {
        res.render('login')
    }

    loginGoogle(req, res) {

    }
}

module.exports = new AccountController