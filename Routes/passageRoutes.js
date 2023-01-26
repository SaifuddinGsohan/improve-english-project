const express = require("express");
const authController = require("../Controller/authController");
const passageController = require("../Controller/passageController");
const router = express.Router();

router.use(authController.protect, authController.accessCheck);
router.get("", passageController.getPassages);
router.get(
  "/passage",
  authController.nextPassage,
  passageController.getPassage
);

router.use(authController.restrictTo("admin", "moderator"));
router.post("", passageController.createPassage);

router
  .route("/passage")
  .put(passageController.updatePassage)
  .delete(passageController.deletePassage);

module.exports = router;
