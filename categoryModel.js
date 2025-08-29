const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },         
  desc: { type: String, required: true },        
  img: { type: String, required: true },         
  price: { type: Number, required: true },       
  discount: { type: Number, default: 0 },         
  category: { type: String },                     
  available: { type: Boolean, default: true }, 
  imageUrl: { type: String, required: true },     
  categoryId: mongoose.Schema.Types.ObjectId,     

  // --- New Fields ---
  deliveryFee: { type: Number, default: 150 },    
  estimatedTime: { type: String, default: "30-40 minutes" }, // Estimated delivery time
  foodAvailableUntil: { type: String, default: "11:00 PM" } ,
   popular: { type: Boolean, default: false }
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;