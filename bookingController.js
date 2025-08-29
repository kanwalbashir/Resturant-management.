const Booking = require("../model/bookingModel");
const User = require("../model/authModel");
const sendEmail = require("../utils/email");

const createBooking = async (req, res) => {
  try {
    const { name, email, phone, people, time, date, tableNumber } = req.body;

    // Check if table already booked for given date & time
    const existingBooking = await Booking.findOne({ tableNumber, date, time, status: "Confirmed" });
    if (existingBooking) {
      return res.status(400).json({ message: " Table already booked for this time!" });
    }

    const booking = new Booking({ name, email, phone, people, time, date, tableNumber });
    await booking.save();

    res.status(201).json({ message: " Booking request created!", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//  Get all bookings (Admin)
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Confirm booking (Admin)
const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      console.warn(`Booking not found: ${req.params.id}`);
      return res.status(404).json({ error: "Booking not found" });
    }
    // Update status
    booking.status = "Confirmed";
    await booking.save();
    // Send email only if email exists
    if (booking.email) {
      try {
        await sendEmail(
          booking.email,
          "Booking Confirmed - Taste Haven",
          `Dear ${booking.name || "Customer"},\n\nYour booking for ${booking.date.toDateString()} has been confirmed.\n\nThank you for choosing Taste Haven!`
        );
        console.log(`Confirmation email sent to ${booking.email}`);
      } catch (err) {
        console.error(`Failed to send email to ${booking.email}:`, err.message);
      }
    } else {
      console.warn(`No email found for booking ${booking._id}. Skipping email.`);
    }

    res.json({
      success: true,
      message: "Booking confirmed successfully!",
      booking
    });
  } catch (err) {
    console.error("Confirm booking error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Reject booking (Admin)
const reject = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.email) {
      try {
        await sendEmail(
          booking.email,
          "Booking Rejected ",
          `Hello ${booking.name || "Customer"},\nUnfortunately, your booking for ${booking.people} people on ${booking.date.toDateString()} was rejected.`
        );
        console.log(`Rejection email sent to ${booking.email}`);
      } catch (err) {
        console.error(`Failed to send email to ${booking.email}:`, err.message);
      }
    } else {
      console.warn(`No email found for booking ${booking._id}. Skipping email.`);
    }

    res.json({ success: true, message: "Booking rejected", booking });
  } catch (err) {
    console.error("Reject booking error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createBooking,
  getBookings,
  confirmBooking,
  reject
};