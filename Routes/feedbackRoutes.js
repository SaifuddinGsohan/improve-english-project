const express = require("express");
const authController = require("../Controller/authController");
const feedbackController = require("../Controller/feedbackController");
const router = express.Router();

router.use(authController.protect);

router.post("", feedbackController.createFeedback);

module.exports = router;
