const router = require("express").Router();
const authController = require("../controllers/authController");

module.exports = () => {
  router
    .get("/authorise", authController.authorise)
    .get("/callback", authController.callback)
    .get("/authenticate", authController.authenticate)
    .get("/signout", authController.signout);

  return router;
};
