const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: [{
    value: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  bodyMeasurements: [{
    chest: Number,
    waist: Number,
    hips: Number,
    thighs: Number,
    arms: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  workouts: [{
    type: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    calories: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  goals: {
    weightGoal: Number,
    workoutGoal: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Progress', ProgressSchema);
