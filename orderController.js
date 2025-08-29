const Order = require("../model/orderModel");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/email");
const mongoose = require("mongoose");
// Place order
exports.placeOrder = async (req, res) => {
 try {
    const { name, phone,email, address, items, total } = req.body;
    const userId = req.user?.id;
    const newOrder = new Order({
      name,
      phone,
      address,email,
      items,
      total,
      status: "Pending",
      userId
    });

    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order creation error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed", 
        errors: err.errors 
      });
    }

    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
// Get all orders (Admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
   try {
    const { status } = req.body;

    // Validate status
    const allowed = ["Pending", "Confirmed", "On the Way", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;
    await order.save();
    if (order.email) {
      try {
        await sendEmail(
          order.email,
          `Order #${order._id} Status Updated`,
          `Hello ${order.name || "Customer"},\n\nYour order status has been updated to "${status}".\n\nThank you for ordering from Taste Haven!`
        );
        console.log(`Email sent to ${order.email}`);
      } catch (err) {
        console.error(`Failed to send email to ${order.email}:`, err);
      }
    }
    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: err.message });
  }
};
//order for one user
exports.OneuserOreder=async (req, res) => {
   try {
    const userIdParam = req.params.userId;
    let queryUserId;

    if (mongoose.Types.ObjectId.isValid(userIdParam)) {
      queryUserId = new mongoose.Types.ObjectId(userIdParam);
    } else {
      queryUserId = userIdParam;
    }

    const orders = await Order.find({ userId: queryUserId });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ error: err.message });
  }
};