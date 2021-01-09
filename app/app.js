const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const router = require('./routes/index');
const passport = require('./middlewares/passport')();

const redisClient = redis.createClient(6379, process.env.REDIS_ENDPOINT);
const app = express();

app
  .use(methodOverride("_method", { methods: ["POST", "GET"] }))
  .use(cookieParser())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(
    session({
      secret: process.env.COOKIE_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({ client: redisClient }),
      cookie: { httpOnly: true, secure: false, maxage: 1000 * 60 * 30 }
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
  .use("/", router(passport));

module.exports = app;
