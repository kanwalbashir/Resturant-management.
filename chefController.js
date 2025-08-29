const Chef = require('../model/chefModel');
// Get all chefs
exports.getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Create new 4 chef 
exports.createChef = async (req, res) => {
  try {
    const count = await Chef.countDocuments();
    if (count >= 4) return res.status(400).json({ message: "Cannot add more than 4 chefs" });

    const { name, description } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image file is required" });

    const chef = new Chef({
      name,
      description,
      image: `/uploads/${req.file.filename}`
    });

    const newChef = await chef.save();
    res.status(201).json(newChef);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update chef
exports.updateChef = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateData = { name, description };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const chef = await Chef.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!chef) return res.status(404).json({ message: "Chef not found" });

    res.json(chef);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete chef
exports.deleteChef = async (req, res) => {
  try {
    const chef = await Chef.findByIdAndDelete(req.params.id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });
    res.json({ message: "Chef deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};