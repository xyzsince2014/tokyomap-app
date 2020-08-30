const dotenv = require('dotenv');
const router = require("express").Router();
const authController = require("../controllers/auth");

const CLIENT = "http://localhost:3000";

dotenv.config();
const sessionConfig = {
  successRedirect: CLIENT,
  failureRedirect: process.env.DOMAIN_CLIENT,
  session: true,
};

module.exports = passport => {
  router
    .get("/verify", authController.verify)
    // .get("/login/failed", authController.notifyLoginFailure)
    .get("/signout", authController.signout)
    .get("/twitter", passport.authenticate("twitter"))
    .get("/twitter/callback", passport.authenticate("twitter", sessionConfig));

    return router;
};
