const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  items: [
    {
      name: String,
      img: String,
      qty: Number,
      price: Number,
      discountedPrice: Number,
      total: Number,
      email:  String,
    }
  ],
  total: { type: Number },
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed","On the Way", "Delivered", "Cancelled"], 
    default: "Pending" 
  },
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
