require("dotenv").config();

const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

const mariaAuth = require('../models/auth');

module.exports = () => {
  passport.use(
    "twitter",
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "/auth/twitter/callback",
        includeEmail: true,
      },
      (token, tokenSecret, profile, done) => {
        const user = {
          name: profile._json.name,
          userId: profile._json.id_str,
          userName: profile._json.screen_name,
          profileImageUrl: profile._json.profile_image_url,
        };
        mariaAuth.postTwitterUser(user);
        done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser(async (userId, done) => {
    const user = {
      userId: userId,
    };
    done(null, user);
  });

  return passport;
};
