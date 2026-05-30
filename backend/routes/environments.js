const express = require('express');
const router = express.Router();
const Environment = require('../models/Environment');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Create Environment
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, baseUrl, apiEndpoint } = req.body;
    
    const environment = new Environment({
      name,
      description,
      baseUrl,
      apiEndpoint
    });
    
    await environment.save();
    res.status(201).json(environment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Environments
router.get('/', verifyToken, async (req, res) => {
  try {
    const environments = await Environment.find();
    res.json(environments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Environment
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const environment = await Environment.findById(req.params.id);
    if (!environment) return res.status(404).json({ error: 'Environment not found' });
    res.json(environment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Environment
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const environment = await Environment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(environment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Environment Status
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const environment = await Environment.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    res.json(environment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Environment
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Environment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Environment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;