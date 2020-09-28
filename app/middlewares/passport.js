require("dotenv").config();

const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

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
          screenName: profile._json.screen_name,
          twitterId: profile._json.id_str,
          profileImageUrl: profile._json.profile_image_url,
        };

        done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.twitterId);
  });

  passport.deserializeUser(async (twitterId, done) => {
    const user = {
      userId: twitterId,
    };
    done(null, user);
  });

  return passport;
};
