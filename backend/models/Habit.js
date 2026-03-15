const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  color: {
    type: String,
    default: '#60a5fa'
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

// Index for finding user's habits
habitSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Habit', habitSchema);
