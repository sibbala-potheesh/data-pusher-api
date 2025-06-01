const express = require("express");
const router = express.Router();
const controller = require("../controllers/destination.controller");

router.post("/", controller.create);
router.get("/:accountId", controller.listByAccount);
router.put("/update/:id", controller.update);
router.delete("/delete/:id", controller.remove);

module.exports = router;
