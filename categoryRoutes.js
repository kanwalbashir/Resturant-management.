const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const multer = require("multer");
const path = require("path");
const upload = require('../middleware/uploadMiddleware');
// Routes
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getDishById);
router.post("/", upload.single("img"), categoryController.addCategory);
router.put("/:id", upload.single("img"), categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
module.exports = router;