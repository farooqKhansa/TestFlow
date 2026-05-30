const mongoose = require('mongoose');

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['test_failed', 'test_passed', 'critical_alert', 'summary', 'integration_status'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info'
  },
  relatedTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestExecution'
  },
  channels: {
    email: { type: Boolean, default: false },
    slack: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);