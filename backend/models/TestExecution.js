const mongoose = require('mongoose');

// Test Execution Schema for Real-time Dashboard & Analytics
const testExecutionSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  description: String,
  environment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Environment',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'passed', 'failed', 'skipped', 'blocked'],
    default: 'pending'
  },
  result: {
    passed: Boolean,
    failureReason: String,
    screenshots: [String],
    logs: String,
    duration: Number // in milliseconds
  },
  executionCount: {
    type: Number,
    default: 0
  },
  passCount: {
    type: Number,
    default: 0
  },
  failCount: {
    type: Number,
    default: 0
  },
  flakiness: {
    type: Number,
    default: 0 // percentage
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  tags: [String],
  gitCommitHash: String,
  startTime: Date,
  endTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TestExecution', testExecutionSchema);