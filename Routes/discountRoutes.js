const express = require("express");
const promoController = require("../Controller/promoController");
const couponController = require("../Controller/couponController");
const discountValidation = require("../Validation/discountValidation");
const router = express.Router();

router
  .route("/promo")
  .get(promoController.getAllPromoCode)
  .post(discountValidation.promoSchema, promoController.createPromoCode);

router.get("/promo/price", promoController.promoPrice);

router
  .route("/promo/:id")
  .get(promoController.getAPromoCode)
  .put(promoController.updatePromoCode)
  .delete(promoController.deletePromoCode);

router
  .route("/coupon")
  .post(discountValidation.couponSchema, couponController.createCoupon)
  .get(couponController.allCoupons);

router
  .route("/coupon/:id")
  .get(couponController.aCoupon)
  .put(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

module.exports = router;
