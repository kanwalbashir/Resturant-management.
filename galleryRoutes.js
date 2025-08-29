const express = require("express");
const multer = require("multer");
const { uploadImage, getAllImages, deleteImage } = require("../controller/galleryController");
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// Routes
router.post("/", upload.single("image"), uploadImage);
router.get("/", getAllImages);
router.delete("/:id", deleteImage);

module.exports = router;
