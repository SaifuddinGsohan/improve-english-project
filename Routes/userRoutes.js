const express = require("express");
const authController = require("../Controller/authController");
const userController = require("../Controller/userController");
const router = express.Router();

router.use(authController.protect);

router.put("/update-level", userController.updateUserLevel);

router.use(authController.restrictTo("admin", " moderator"));
router.get("", userController.getUsers);
router.get("/subscriber", userController.getSubscriber);

module.exports = router;
