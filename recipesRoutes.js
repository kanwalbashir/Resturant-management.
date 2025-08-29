const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { getRecipes,getRecipeById, addRecipe, updateRecipe, deleteRecipe } = require("../controller/recipesController");
const upload = require('../middleware/uploadMiddleware');

// Routes
router.get("/", getRecipes);
router.post("/", upload.single("image"), addRecipe);
router.put("/:id", upload.single("image"), updateRecipe);
router.delete("/:id", deleteRecipe);
router.get("/:id", getRecipeById);

module.exports = router;
