const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  keywords: [{ type: String }],
  priority: { type: Number, default: 0 },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  childCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
});

module.exports = mongoose.model('Category', categorySchema);
