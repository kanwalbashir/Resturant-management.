const express = require("express");
const multer = require("multer");
const path = require("path");
const { getReviews, createReview, deleteReview } = require("../controller/reviewController");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
router.get("/", getReviews);
router.post("/", upload.single("image"), createReview);
router.delete("/:id", deleteReview);

module.exports = router;