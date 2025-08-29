const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController"); // adjust path

// Place a new order
router.post("/", orderController.placeOrder);

// Get all orders (admin)
router.get("/", orderController.getOrders);

// Get orders for a specific user
router.get("/user/:userId", orderController.OneuserOreder);

// Update order status (admin)
router.put("/:id", orderController.updateOrderStatus);

module.exports = router;
