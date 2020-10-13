const dotenv = require('dotenv');
const router = require("express").Router();
const authController = require("../controllers/auth");

dotenv.config();
const sessionConfig = {
  successRedirect: process.env.DOMAIN_CLIENT,
  failureRedirect: process.env.DOMAIN_CLIENT,
  session: true,
};

module.exports = passport => {
  router
    .get("/authenticate", authController.authenticate)
    .get("/signout", authController.signout)
    .get("/twitter", passport.authenticate("twitter"))
    .get("/twitter/callback", passport.authenticate("twitter", sessionConfig))
    .get("/facebook", passport.authenticate("facebook"))
    .get("/facebook/callback", passport.authenticate("facebook", sessionConfig))
    .get("/line", passport.authenticate("line"))
    .get("/line/callback", passport.authenticate("line", sessionConfig));

  return router;
};
