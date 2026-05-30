const mongoose = require('mongoose');

// Environment Schema
const environmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Development', 'Staging', 'Production', 'QA']
  },
  description: String,
  baseUrl: {
    type: String,
    required: true
  },
  apiEndpoint: String,
  credentials: {
    username: String,
    password: String,
    token: String
  },
  status: {
    type: String,
    enum: ['healthy', 'degraded', 'offline'],
    default: 'healthy'
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Environment', environmentSchema);