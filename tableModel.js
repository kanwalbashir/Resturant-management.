const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  seats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["Available", "Full"], 
    default: "Available" 
  }
});
module.exports = mongoose.model("Table", tableSchema);