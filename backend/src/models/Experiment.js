const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: String,
  variables: [{
    name: String,
    value: mongoose.Schema.Types.Mixed
  }],
  trafficAllocation: Number,
  metrics: {
    impressions: Number,
    clicks: Number,
    conversions: Number
  }
});

const stageSchema = new mongoose.Schema({
  name: String,
  description: String,
  conditions: [{
    type: String,
    enum: ['time-based', 'metric-based', 'manual'],
    required: true
  }],
  conditionValues: mongoose.Schema.Types.Mixed,
  variants: [{
    name: String,
    variables: [{
      name: String,
      value: mongoose.Schema.Types.Mixed
    }],
    trafficAllocation: Number
  }]
});

const experimentSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: {
    type: String,
    enum: ['draft', 'running', 'paused', 'completed'],
    default: 'draft'
  },
  startDate: Date,
  endDate: Date,
  variables: [{
    name: String,
    type: String,
    possibleValues: [mongoose.Schema.Types.Mixed]
  }],
  variants: [variantSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['simple', 'multi-stage'],
    default: 'simple'
  },
  stages: [stageSchema],
  currentStage: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Experiment', experimentSchema);
