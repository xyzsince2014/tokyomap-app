const router = require("express").Router();
const homeController = require("../controllers/home");

// do authCheck before navigating to home page
router.get("", homeController.checkAuth, homeController.index);

module.exports = router;
