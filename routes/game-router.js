 const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game-controller");

router.get("/", gameController.gamePage);

module.exports = router;