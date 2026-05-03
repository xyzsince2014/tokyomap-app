const router = require("express").Router();
const cognitoController = require("../controllers/cognitoController");

module.exports = () => {
  router
    .get("/authorise", cognitoController.authorise)
    .get("/callback", cognitoController.callback)
    .get("/authenticate", cognitoController.authenticate)
    .get("/signout", cognitoController.signout);

  return router;
};
