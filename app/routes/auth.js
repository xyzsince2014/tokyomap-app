const dotenv = require('dotenv');
const router = require("express").Router();
const authController = require("../controllers/auth");

dotenv.config();
const sessionConfig = {
  successRedirect: process.env.DOMAIN_CLIENT,
  failureRedirect: "/auth/login/failed",
  session: true,
};

module.exports = passport => {
  router
    .get("/login/success", authController.index)
    .get("/login/failed", authController.notifyLoginFailure)
    .get("/logout", authController.logout)
    .get("/twitter", passport.authenticate("twitter"))
    .get("/twitter/callback", passport.authenticate("twitter", sessionConfig));

    return router;
};
