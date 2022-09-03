const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const router = require('./routes/index');
const passport = require('./passport')();

// todo: port should be a const
const redisClient = redis.createClient(process.env.REDID_PORT, process.env.REDIS_HOST);
const app = express();

app
  .use(methodOverride("_method", { methods: ["POST", "GET"] }))
  .use(cookieParser())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(
    session({
      key: process.env.SESSION_KEY,
      secret: process.env.SESSION_SECRETE,
      proxy: true,
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({ client: redisClient }),
      cookie: {
        httpOnly: true,
        // todo: secure: process.env.NODE_ENV == 'production',
        secure: false,
        sameSite: "lax",
        // todo: sameSite: "strict",
        maxAge: 1000 * 60 * 30,
      }
    })
  )
  .use(passport.initialize())
  .use(passport.session()) // enables passport.js to store auth info in the session
  .use(
    cors({
      origin: process.env.DOMAIN,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true
    })
  )
  .use("/", router(passport));

// manage http headers
app
  .disable('x-powered-by')
  .set('etag', false);

module.exports = app;
