const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  completed: {
    type: Boolean,
    default: false
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

// Prevent duplicate entries for same habit on same day
completionSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Completion', completionSchema);
