const express = require("express");
const authController = require("../Controller/authController");
const progressController = require("../Controller/progressController");
const router = express.Router();

router.use(authController.protect);

router.post("", progressController.createProgress);
router.get("", progressController.getAllProgress);

module.exports = router;
