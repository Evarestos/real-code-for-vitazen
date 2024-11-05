const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

favoriteSchema.index({ userId: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
