const Booking = require("../model/bookingModel");
const Category = require("../model/categoryModel");
const Recipe = require("../model/recipesModel");
const User = require("../model/authModel");
const Contact = require("../model/msgModel"); 
exports.sendMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMsg = new Contact({ name, email, phone, message });
        await newMsg.save();

        res.status(200).json({ message: "Message saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving message", error });
    }
};
// get msg
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }); 
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reply to a message
exports.sendReply = async (req, res) => {
   try {
    const { id } = req.params;
    const { reply } = req.body;

    const message = await Contact.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    if (message.reply) {
      return res.status(400).json({ error: "Message already replied" });
    }

    message.reply = reply;
    await message.save();
    res.json({ message: "Reply sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};