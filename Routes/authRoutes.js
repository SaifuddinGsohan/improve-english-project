const express = require("express");
const authValidation = require("../Validation/authValidation");
const router = express.Router();

const authController = require("../Controller/authController");

router.post(
  "/signup",
  authValidation.createUserValidation,
  authController.signup
);
router.post(
  "/signin",
  authValidation.signInUserValidation,
  authController.signIn
);

router.get("/logout", authController.logout);

module.exports = router;
