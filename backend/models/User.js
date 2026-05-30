const mongoose = require('mongoose');

// User Schema for Role-Based Access Control
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'lead_tester', 'tester'],
    default: 'tester'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    slack: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true }
  },
  slackWebhook: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);