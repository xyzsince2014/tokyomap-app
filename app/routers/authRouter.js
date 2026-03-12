const router = require("express").Router();
const authController = require("../controllers/authController");

// todo: write to config.js
const sessionConfig = {
  successRedirect: process.env.DOMAIN,
  failureRedirect: process.env.ERROR_URI,
  session: true,
};

module.exports = () => {
  router
    .get("/authorise", authController.authorise)
    .get("/callback", authController.callback)
    .get("/authenticate", authController.authenticate)
    .get("/signout", authController.signout);

  return router;
};
