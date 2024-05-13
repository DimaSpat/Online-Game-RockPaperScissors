var express = require("express");
var router = express.Router();
var homeController = require("../controllers/home-controller");
var userController = require("../controllers/user-controller");

router.get("/", homeController.index);

router.get("/profile", homeController.profile);
router.post("/profile", userController.resetPassword);

module.exports = router;
