const express = require("express");
const authController = require("../Controller/authController");
const passageController = require("../Controller/passageController");
const router = express.Router();

router.get("", passageController.getPassages);

router.use(
  authController.protect,
  authController.restrictTo("admin", "moderator")
);
router.route("").post(passageController.createPassage);

router
  .route("/:id")
  .get(passageController.getPassage)
  .put(passageController.updatePassage)
  .delete(passageController.deletePassage);

module.exports = router;
