const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:8080/admin/auth/google/callback",
        passReqToCallback: true
    },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                if(profile.emails[0].value === process.env.EMAIL_ADMIN_DEV) {
                    return done(null, profile);
                }else{
                    return done(null, process.env.FALSE);
                }
            } catch (error) {
                return done(error, process.env.FALSE);
            }
        }
    ));
}