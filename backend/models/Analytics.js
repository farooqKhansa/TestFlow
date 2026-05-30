const mongoose = require('mongoose');

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  environment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Environment'
  },
  totalTests: Number,
  passedTests: Number,
  failedTests: Number,
  skippedTests: Number,
  passRate: Number, // percentage
  averageDuration: Number, // milliseconds
  flakyTests: [
    {
      testId: String,
      testName: String,
      flakinessPercentage: Number
    }
  ],
  topFailingTests: [
    {
      testId: String,
      testName: String,
      failureCount: Number,
      reason: String
    }
  ],
  testsByTester: [
    {
      testerId: mongoose.Schema.Types.ObjectId,
      testerName: String,
      testsRun: Number,
      passRate: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);