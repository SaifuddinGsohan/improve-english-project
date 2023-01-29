const express = require("express");
const authController = require("../Controller/authController");
const bulkController = require("../Controller/bulkController");
const router = express.Router();

router.use(
  authController.protect,
  authController.restrictTo("admin", "moderator", "b2b")
);
router.post("/bulk-creation", bulkController.bulkCreation);
router.get("/bulk-users", bulkController.getB2bUsers);

router.get(
  "/bulk-all-users",
  authController.restrictTo("admin", "moderator"),
  bulkController.getAllB2bUsers
);

module.exports = router;
