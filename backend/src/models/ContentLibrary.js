const mongoose = require('mongoose');

const contentLibrarySchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContentLibrary', contentLibrarySchema);
