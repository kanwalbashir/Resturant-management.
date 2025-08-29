const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, 
    imageUrl: { type: String, required: true },  
    description: { type: String, required: true }
});

module.exports = mongoose.model('Chef', chefSchema);