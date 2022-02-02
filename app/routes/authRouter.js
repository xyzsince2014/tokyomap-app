const router = require("express").Router();
const authController = require("../controllers/authController");

// todo: write to config.js
const sessionConfig = {
  successRedirect: process.env.DOMAIN,
  failureRedirect: process.env.ERROR_URI,
  session: true,
};

module.exports = passport => {
  router
    .get("/authorise", authController.authorise)
    .get("/callback", authController.callback)
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
