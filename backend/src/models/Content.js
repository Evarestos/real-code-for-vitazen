const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['psychotherapy', 'fitness', 'nutrition', 'general']
  },
  videoUrl: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

contentSchema.index({ title: 'text', description: 'text', tags: 'text' });
contentSchema.index({ category: 1, createdAt: -1 });
contentSchema.index({ creator: 1, createdAt: -1 });
contentSchema.index({ tags: 1, createdAt: -1 });

module.exports = mongoose.model('Content', contentSchema);
