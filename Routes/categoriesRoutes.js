const express = require("express");
const authController = require("../Controller/authController");
const categoriesController = require("../Controller/categoriesController");
const router = express.Router();

router.get("", categoriesController.getCategories);

router.use(
  authController.protect,
  authController.restrictTo("admin", "moderator")
);
router.post("", categoriesController.createCategories);

router
  .route("/:id")
  .get(categoriesController.getCategory)
  .put(categoriesController.updateCategory)
  .delete(categoriesController.deleteCategory);

module.exports = router;
