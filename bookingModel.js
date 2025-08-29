const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  people: { type: Number, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  tableNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Rejected"],
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
