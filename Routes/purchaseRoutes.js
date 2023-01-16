const express = require("express");
const router = express.Router();
const purchaseController = require("../Controller/purchaseController");
const authController = require("../Controller/authController");

router.use(authController.protect);

router.post("/create", purchaseController.createPurchase);
router.get("/get-info/:id", purchaseController.getPurchaseInfo);

module.exports = router;
