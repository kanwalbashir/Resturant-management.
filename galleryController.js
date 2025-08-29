const Gallery = require("../model/galleryModel"); 
const fs = require("fs"); const path = require("path");

//  Upload Image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newImage = new Gallery({
      imageUrl:`/uploads/${req.file.filename}`  
    });

    const newimg=await  newImage.save();
    res.json(newimg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get All Images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
//  Delete Image
exports.deleteImage = async (req, res) => {
 try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Image not found" });

    const filePath = path.join(__dirname, "..", "uploads", deleted.imageUrl);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("File deletion error:", err);

      }
    });

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image" });
  }
};