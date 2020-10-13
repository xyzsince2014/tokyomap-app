const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const router = require('./routes/index');

// configs
const passport = require('./middlewares/passport')();
const app = express();

// middlewares
app
  .use(methodOverride("_method", { methods: ["POST", "GET"] }))
  .use(cookieParser())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(
    session({ // cf. https://www.npmjs.com/package/express-session
      secret: process.env.COOKIE_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        secure: false,
        // httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 15,
      },
    })
  )
  .use(passport.initialize())
  .use(passport.session()) // enables passport.js to store auth info in the session
  .use(
    cors({
      origin: process.env.DOMAIN_CLIENT,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true
    })
  )
  .use("/", router(passport)); // routings

module.exports = app;
