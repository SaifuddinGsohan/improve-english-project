const express = require("express");

const packagesController = require("../Controller/packagesController");
const authController = require("../Controller/authController");

const router = express.Router();

router.get("", packagesController.getPackages);

// router.use(
//   authController.protect,
//   authController.restrictTo("admin", "moderator")
// );

router.post("", packagesController.createPackage);

router
  .route("/:id")
  .get(packagesController.getPackage)
  .put(packagesController.updatePackage)
  .delete(packagesController.deletePackage);
module.exports = router;
