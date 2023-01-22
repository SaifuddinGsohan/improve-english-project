const express = require("express");
const quizController = require("../Controller/quizController");
const router = express.Router();

router
  .route("/quiz")
  .post(quizController.createQuiz)
  .get(quizController.getQuizes);

router
  .route("/:id")
  .get(quizController.getQuiz)
  .put(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

module.exports = router;
