const express = require("express");
const router = express.Router();
const Table = require("../models/Table");
const { updateTable } = require("../controller/tController");

// Get all tables
router.get("/", async (req, res) => {
  const tables = await Table.find();
  res.json(tables);
});

// Update table (admin)
router.put("/:id", updateTable);

module.exports = router;