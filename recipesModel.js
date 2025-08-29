
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // image URL/path
  remedy: { type: String, required: true } // instructions
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);
