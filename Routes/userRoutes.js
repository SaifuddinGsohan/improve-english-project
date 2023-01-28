const express = require("express");
const authController = require("../Controller/authController");
const userController = require("../Controller/userController");
const router = express.Router();

router.use(authController.protect);

router.get(
  "",
  authController.restrictTo("admin", " moderator"),
  userController.getUsers
);

router.put("/update-level", userController.updateUserLevel);

module.exports = router;
