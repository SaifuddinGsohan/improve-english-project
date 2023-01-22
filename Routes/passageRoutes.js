const express = require("express");
const passageController = require("../Controller/passageController");
const router = express.Router();

router
  .route("")
  .post(passageController.createPassage)
  .get(passageController.getPassages);

router
  .route("/:id")
  .get(passageController.getPassage)
  .put(passageController.updatePassage)
  .delete(passageController.deletePassage);

router
  .route("/quiz")
  .post(passageController.createQuiz)
  .get(passageController.getQuizes);

  

module.exports = router;
