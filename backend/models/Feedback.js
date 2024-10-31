const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  suggestionId: { type: String, required: true },
  rating: { type: Number, enum: [-1, 0, 1], required: true }, // -1: not helpful, 0: neutral, 1: helpful
  timestamp: { type: Date, default: Date.now },
  context: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  additionalComments: { type: String }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
