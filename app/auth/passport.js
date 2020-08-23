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
        callbackURL: `/auth/twitter/callback`,
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        const con = mysql.createConnection(mysqlPromise.dbConfig);
        let user = null;
        try {
          user = (await mysqlPromise.query(con, "SELECT * FROM users WHERE twitterId = ?", [profile._json.id_str]))[0];
          con.end();
        } catch(err) {
          done(new Error("Failed to fetch the user"));
        }

        // create new user if the DB doesn't have this user
        if (!user) {
          user = {
            subr_name: req.body.subrName,
            subr_email: req.body.subrEmail,
            subr_postal_code: req.body.subrPostalCode,
          };

          try {
            await mysqlPromise.query(con, "INSERT INTO subscribers SET ?", user);
            mysqlPromise.commit(con);
            con.end();
          } catch(err) {
            mysqlPromise.rollback(con, err);
            con.end();
            done(new Error("Failed to save a new user"));
          }
        }

        done(null, user);
      }
    )
  );

  /**
   * serialize the user.id to save in the cookie session
   * so the browser will remember the user when login
   */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  /**
   * deserialise the user, which is attached to the request obj as req.user
   */
  passport.deserializeUser(async (id, done) => {
    const con = mysql.createConnection(mysqlPromise.dbConfig);
    try {
      const user = (await mysqlPromise.query(con, "SELECT * FROM users WHERE twitterId = ?", [profile._json.id_str]))[0];
      con.end();
      done(null, user);
    } catch(err) {
      done(new Error("Failed to deserialize an user"));
    }
  });

  return passport;
};
