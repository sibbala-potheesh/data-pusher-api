const express = require("express");
const router = express.Router();
const controller = require("../controllers/dataHandler.controller");

router.post("/incoming_data", controller.receive);

module.exports = router;
