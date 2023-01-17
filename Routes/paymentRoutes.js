const express = require("express");
const paymentController = require("../Controller/paymentController");
const authController = require("../Controller/authController");
const { createPaymentSchema } = require("../Validation/paymentValidation");
const router = express.Router();

router.post(
  "/create",
  authController.protect,
  createPaymentSchema,
  paymentController.createPayment
);
router.post("/success", paymentController.paymentSuccess);
router.get("/failed", paymentController.paymentFailed);

module.exports = router;
