const Recipe = require("../model/recipesModel");
const fs = require("fs");
const path = require("path");
// Get all recipes
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get single recipe
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Add Recipe
exports.addRecipe = async (req, res) => {
  try {
    const { title, remedy } = req.body;
    const image = req.file ? req.file.filename : ""; 
    const newRecipe = new Recipe({ title, image, remedy });
    await newRecipe.save();
    res.json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Recipe
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, remedy } = req.body;

    const updateData = { title, remedy };
    if (req.file) updateData.image = req.file.filename; // ✅ only filename

    const updated = await Recipe.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: "Recipe updated successfully", recipe: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    // 1. Find recipe first
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // 2. Build image path (assuming recipe.image stores filename like "abc.jpg")
    const imagePath = recipe.image
      ? path.join(__dirname, "../uploads", recipe.image)
      : null;

    // 3. Delete recipe from DB
    await Recipe.findByIdAndDelete(req.params.id);

    // 4. Delete the image file (if exists)
    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err.message);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    res.json({ message: "Recipe and image deleted successfully" });
  } catch (err) {
    console.error("DELETE RECIPE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};