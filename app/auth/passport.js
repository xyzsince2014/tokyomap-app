require('dotenv').config();

const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const mysql = require("mysql");

const mysqlPromise = require("../services/maria");

module.exports = () => {
  passport.use(
    "twitter",
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: '/auth/twitter/callback',
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        let user = null;
        // let user = {
        //   name: "xyzsince2014",
        //   screenName: "xyzsince2014_1",
        //   twitterId: "870853753166942208",
        // };

        // const con = mysql.createConnection(mysqlPromise.dbConfig);
        // const twitterId = profile._json.id_str ? profile._json.id_str : '';
        // const twitterId = "870853753166942208";
        // try {
        //   user = (await mysqlPromise.query(con, "SELECT * FROM users WHERE twitterId = ?", [twitterId]))[0];
        //   con.end();
        // } catch(err) {
        //   done(new Error("Failed to fetch the user"));
        // }

        // create new user if the DB doesn't have this user
        // if (!user) {
          user = {
            name: profile._json.name,
            screenName: profile._json.screen_name,
            twitterId: profile._json.id_str,
            profileImageUrl: profile._json.profile_image_url
          };

          console.log(user);
          // try {
          //   await mysqlPromise.query(con, "INSERT INTO subscribers SET ?", user);
          //   mysqlPromise.commit(con);
          //   con.end();
          // } catch(err) {
          //   mysqlPromise.rollback(con, err);
          //   con.end();
          //   done(new Error("Failed to save a new user"));
          // }
        // }

        done(null, user);
      }
    )
  );

  /**
   * serialize the user.id to save in the cookie session
   * so the browser will remember the user when login
   */
  passport.serializeUser((user, done) => {
    done(null, user.twitterId);
  });

  /**
   * deserialise the user, which is attached to the request obj as req.user
   */
  passport.deserializeUser(async (twitterId, done) => {
    // const con = mysql.createConnection(mysqlPromise.dbConfig);
    // try {
      // const user = (await mysqlPromise.query(con, "SELECT * FROM users WHERE twitterId = ?", [id]))[0];
      // con.end();
      const user = {
        twitterId: twitterId
      }
      done(null, user);
    // } catch(err) {
    //   done(new Error("Failed to deserialize an user"));
    // }
  });

  return passport;
};
