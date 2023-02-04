const express = require("express");
const authController = require("../Controller/authController");
const landingController = require("../Controller/landingController");
const { multer } = require("../Middleware/multer");
const router = express.Router();

router.get("", landingController.getLandingPage);

router.use(
  authController.protect,
  authController.restrictTo("admin", "moderator")
);

router.post("", multer.array("images", 3), landingController.createLanding);
router.put("", multer.array("images", 3), landingController.updateLandingPage);

module.exports = router;
