const Announcement = require('../model/announcementModel');
const Category = require("../model/categoryModel");
const Booking = require("../model/bookingModel");
const User = require("../model/authModel");
const Recipe = require("../model/recipesModel");
const Contact = require("../model/msgModel");
// POST - Create or update latest announcement
const createAnnouncement=async (req, res) => {
    try {
        const { message } = req.body;
        await Announcement.deleteMany({}); // Keep  one 
        const newAnnouncement = new Announcement({ message });
        await newAnnouncement.save();
        res.json(newAnnouncement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// GET - Latest announcement
const getLatestAnnouncement=async (req, res) => {
    try {
        const latest = await Announcement.findOne().sort({ createdAt: -1 });
        res.json(latest || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
const getStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalContacts = await Contact.countDocuments();

    res.json({
      totalCategories,
      totalBookings,
      totalUsers,
      totalRecipes,
      totalContacts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
module.exports = { createAnnouncement, getLatestAnnouncement ,getStats};