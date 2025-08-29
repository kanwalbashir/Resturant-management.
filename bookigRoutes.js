const express = require("express");
const nodemailer = require("nodemailer");
const {  createBooking,getBookings,confirmBooking,reject
} = require("../controller/bookingController");

const router = express.Router();
router.post("/", createBooking);
router.get("/", getBookings);  
router.put("/:id/confirm", confirmBooking); 
router.put("/:id/reject", reject); 
module.exports = router;
