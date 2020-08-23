const router = require("express").Router();

const errorController = require("../controllers/error");

router
  .use(errorController.logErrors)
  .use(errorController.respondNotFound)
  .use(errorController.respondInternalServerError);

module.exports = router;
