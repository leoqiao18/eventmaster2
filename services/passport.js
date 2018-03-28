const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          // already have a record of this user
          done(null, existingUser);
        } else {
          new User({
            googleId: profile.id,
            displayName: profile.displayName,
            name: {
              familyName: profile.name.familyName,
              givenName: profile.name.givenName
            },
            email: profile.emails[0].value,
            image: profile.photos[0].value
          })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
