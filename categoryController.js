const Category = require('../model/categoryModel');
const express=require('express');
const multer=require('multer');
const bcrypt=require('bcrypt');
const path = require("path");
const fs = require("fs");
// Get all categories
exports.getCategories = async (req, res) => {
  try {
    let query = {};
    if (req.query.popular === "true") {
      query.popular = true;
    }

    const categories = await Category.find(query);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// Add new category
exports.addCategory = async (req, res) => {
  try {
    const { name, desc, price, discount, category, available, deliveryFee, deliveryTime } = req.body;
    const img = req.file ? "/uploads/" + req.file.filename : undefined;

    const newDish = new Category({
      name, desc, price, discount, category, available, deliveryFee, deliveryTime, img
    });

    await newDish.save();
    res.json(newDish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update category/dish
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (req.file) updates.img = "/uploads/" + req.file.filename;

    const updatedDish = await Category.findByIdAndUpdate(id, updates, { new: true });
    res.json(updatedDish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete category/dish
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single dish by ID
exports.getDishById = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Category.findById(id);
    res.json(dish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
