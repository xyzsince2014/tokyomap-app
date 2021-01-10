const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LineStrategy = require("passport-line-auth").Strategy;

const mariaAuth = require("../models/auth");

const postProcessing = async (done, user) => {
  try {
    await mariaAuth.postUser(user);
    done(null, user);
  } catch (err) {
    console.log(err); // todo: use CloudWatchLogs
    done(null, false, null);
  }
};

module.exports = () => {
  passport.use(
    "twitter",
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `${process.env.DOMAIN_API}/auth/twitter/callback`,
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        postProcessing(done, {
          userId: profile._json.id_str,
          userName: profile._json.screen_name,
          profileImageUrl: profile._json.profile_image_url,
        });
      }
    )
  );

  passport.use(
    "facebook",
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.DOMAIN_API}/auth/facebook/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        postProcessing(done, {
          userId: profile.id,
          userName: profile.displayName,
          profileImageUrl: "",
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
        callbackURL: `${process.env.DOMAIN_API}/auth/line/callback`,
        scope: ["profile", "openid"],
        botPrompt: "normal", // what?
        uiLocales: "en-US", // todo: use en-GB
      },
      async (accessToken, refreshToken, profile, done) => {
        postProcessing(done, {
          userId: profile.id,
          userName: profile.displayName,
          profileImageUrl: profile.pictureUrl,
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser((userId, done) => {
    done(null, { userId });
  });

  return passport;
};
