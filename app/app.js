const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const router = require('./routes/index');

// configs
const passport = require('./auth/passport')();
const app = express();

// middlewares
app
  .use(methodOverride("_method", { methods: ["POST", "GET"] })) // option methods must be an array of upper-case strings
  .use(cookieParser()) // enables to fetch cookie in request headers by req.cookies
  .use(express.urlencoded({ extended: true })) // enables to fetch incoming data by req.body.hoge for POST & PUT methods
  .use(express.json())
  .use(
    session({
      // cf. https://qiita.com/hika7719/items/3282ab2ebcdaf080912e
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        // domain: "http://127.0.0.1:3000",
        httpOnly: false,
        secure: false,
        // httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 15, // 15 min
      },
    })
  )
  .use(passport.initialize()) // use session() before passport.session() to ensure that the login session is restored in the correct order
  .use(passport.session()) // executes .use(passport.authenticate('hoge')) to enable persistent auth sessions, cf. https://applingo.tokyo/article/1700
  .use(
    cors({
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    })
  )
  .use("/", router(passport)); // routings

module.exports = app;
