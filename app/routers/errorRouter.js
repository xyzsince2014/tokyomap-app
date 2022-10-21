const router = require("express").Router();

const errorController = require("../controllers/errorController");

router
  .use(errorController.respondNotFound)
  .use(errorController.respondInternalServerError);

module.exports = router;
