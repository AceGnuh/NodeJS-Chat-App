const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')

const Account = require('../models/account.js')
const credential = require('../credentials.js')

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    Account.findOne({ _id: id })
        .then((account) => {
            if (!account) {
                return done(null, null)
            }

            return done(null, account)
        })
        .catch((err) => done(err, null))
});

passport.use(
    new GoogleStrategy({
        clientID: credential.authProviders.google.clientId,
        clientSecret: credential.authProviders.google.clientSecret,
        callbackURL: '/auth/google/callback'
    }, (request, accessToken, refreshToken, profile, done) => {
        //console.log("Data from google: ", profile)

        // Check if google profile exist.
        if (profile) {
            Account.findOne({ email: profile.emails[0].value })
                .then((existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        new Account({
                                email: profile.emails[0].value,
                                name: profile.displayName
                            })
                            .save()
                            .then(account => done(null, account))


                    }
                })
        }
    })
);