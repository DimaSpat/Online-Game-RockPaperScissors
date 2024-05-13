const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.get("/reg", userController.registerPage);
router.post("/reg", userController.addUser);

router.get("/login", userController.authorizationPage);
router.post("/login", userController.login);

router.get("/logout", userController.logout);

module.exports = router;
