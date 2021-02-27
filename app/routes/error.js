const router = require("express").Router();

const errorController = require("../controllers/error");

router
  .use(errorController.respondNotFound)
  .use(errorController.respondInternalServerError);

module.exports = router;
