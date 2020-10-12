require("dotenv").config();

const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LineStrategy = require('passport-line-auth').Strategy;

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
          userId: profile._json.id_str,
          userName: profile._json.screen_name,
          profileImageUrl: profile._json.profile_image_url,
        };
        mariaAuth.postUser(user);
        done(null, user);
      }
    )
  );

  passport.use(
    "facebook",
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          userId: profile.id,
          userName: profile.displayName,
          profileImageUrl: '',
        };
        mariaAuth.postUser(user);
        process.nextTick(() => {
          return done(null, user);
        });
      }
    )
  );

  passport.use(
    "line",
    new LineStrategy(
      {
        channelID: process.env.LINE_CHANNEL_ID,
        channelSecret: process.env.LINE_CHANNEL_SECRET,
        callbackURL: "/auth/line/callback",
        scope: ['profile', 'openid'],
        botPrompt: 'normal',
        uiLocales: 'en-US',
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          userId: profile.id,
          userName: profile.displayName,
          profileImageUrl: profile.pictureUrl,
        };
        mariaAuth.postUser(user);
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
