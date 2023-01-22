const express = require("express");

const packagesController = require("../Controller/packagesController");

const router = express.Router();

router
  .route("")
  .post(packagesController.createPackage)
  .get(packagesController.getPackages);

router
  .route("/:id")
  .get(packagesController.getPackage)
  .put(packagesController.updatePackage)
  .delete(packagesController.deletePackage);
module.exports = router;
