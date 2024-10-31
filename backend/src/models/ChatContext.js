const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatContextSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema],
  metadata: {
    type: Map,
    of: String
  },
  active: {
    type: Boolean,
    default: true
  },
  contextSize: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

chatContextSchema.methods.trimContext = function (maxSize) {
  while (this.contextSize > maxSize && this.messages.length > 0) {
    const removedMessage = this.messages.shift();
    this.contextSize -= removedMessage.content.length;
  }
};

module.exports = mongoose.model('ChatContext', chatContextSchema);
