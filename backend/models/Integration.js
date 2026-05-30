const mongoose = require('mongoose');

// Integration Schema for CI/CD, Jira, GitHub
const integrationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['github', 'jira', 'jenkins', 'github_actions', 'slack'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  apiKey: {
    type: String,
    required: true
  },
  webhookUrl: String,
  configuration: {
    owner: String,
    repo: String,
    projectKey: String,
    jenkinsUrl: String,
    jobName: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSync: Date,
  syncStatus: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
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

module.exports = mongoose.model('Integration', integrationSchema);