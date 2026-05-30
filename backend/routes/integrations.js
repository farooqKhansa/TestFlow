const express = require('express');
const router = express.Router();
const Integration = require('../models/Integration');
const axios = require('axios');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Create Integration
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { type, name, description, apiKey, configuration } = req.body;
    
    const integration = new Integration({
      type,
      name,
      description,
      apiKey,
      configuration
    });

    await integration.save();
    res.status(201).json(integration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Integrations
router.get('/', verifyToken, async (req, res) => {
  try {
    const integrations = await Integration.find().select('-apiKey');
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test Integration Connection
router.post('/:id/test', verifyToken, isAdmin, async (req, res) => {
  try {
    const integration = await Integration.findById(req.params.id);
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    let isConnected = false;
    let message = '';

    switch (integration.type) {
      case 'github':
        try {
          const response = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${integration.apiKey}` }
          });
          isConnected = response.status === 200;
          message = 'GitHub connection successful';
        } catch (err) {
          message = 'GitHub connection failed: ' + err.message;
        }
        break;

      case 'jira':
        try {
          const response = await axios.get(
            `${integration.configuration.jiraUrl}/rest/api/3/myself`,
            { auth: { username: integration.configuration.email, password: integration.apiKey } }
          );
          isConnected = response.status === 200;
          message = 'Jira connection successful';
        } catch (err) {
          message = 'Jira connection failed: ' + err.message;
        }
        break;

      case 'slack':
        try {
          const response = await axios.post(integration.apiKey, {
            text: 'TestFlow Integration Test'
          });
          isConnected = response.status === 200;
          message = 'Slack connection successful';
        } catch (err) {
          message = 'Slack connection failed: ' + err.message;
        }
        break;

      default:
        message = 'Integration type not supported for testing';
    }

    integration.syncStatus = isConnected ? 'success' : 'failed';
    integration.lastSync = new Date();
    await integration.save();

    res.json({ isConnected, message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync Integration Data
router.post('/:id/sync', verifyToken, isAdmin, async (req, res) => {
  try {
    const integration = await Integration.findById(req.params.id);
    if (!integration) return res.status(404).json({ error: 'Integration not found' });

    // Placeholder for sync logic
    integration.syncStatus = 'success';
    integration.lastSync = new Date();
    await integration.save();

    res.json({ message: 'Sync completed successfully', integration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Integration
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const integration = await Integration.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).select('-apiKey');
    res.json(integration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Integration
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Integration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Integration deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;