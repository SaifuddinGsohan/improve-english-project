const express = require("express");
const authController = require("../Controller/authController");
const feedbackController = require("../Controller/feedbackController");
const { multer } = require("../Middleware/multer");
const router = express.Router();

router.use(authController.protect);

router.get("/text", feedbackController.getFeedbackText);

router.post("", multer.single("img_url"), feedbackController.createFeedback);
router.get("", feedbackController.getsFeedback);

router
  .route("/:id")
  .get(feedbackController.getAFeedback)
  .put(feedbackController.updateFeedback)
  .delete(feedbackController.deleteFeedback);

module.exports = router;
