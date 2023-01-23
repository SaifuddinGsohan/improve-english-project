const express = require("express");
const quizController = require("../Controller/quizController");
const authController = require("../Controller/authController");
const router = express.Router();

router.get(quizController.getQuizes);

router.use(
  authController.protect,
  authController.restrictTo("admin", "moderator")
);

router.route("/quiz").post(quizController.createQuiz);

router
  .route("/:id")
  .get(quizController.getQuiz)
  .put(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

module.exports = router;
