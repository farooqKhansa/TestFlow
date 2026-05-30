const express = require('express');
const router = express.Router();
const TestExecution = require('../models/TestExecution');
const { verifyToken } = require('../middleware/auth');

// Create/Update Test Execution (Real-time)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { testId, testName, environment, assignedTo, status, result } = req.body;
    
    let testExecution = await TestExecution.findOne({ testId, environment });
    
    if (testExecution) {
      testExecution.executionCount += 1;
      testExecution.status = status;
      testExecution.result = result;
      testExecution.updatedAt = Date.now();
      
      if (status === 'passed') testExecution.passCount += 1;
      if (status === 'failed') testExecution.failCount += 1;
      
      // Calculate flakiness
      testExecution.flakiness = (testExecution.failCount / testExecution.executionCount * 100).toFixed(2);
    } else {
      testExecution = new TestExecution({
        testId,
        testName,
        environment,
        assignedTo,
        status,
        result,
        executionCount: 1,
        passCount: status === 'passed' ? 1 : 0,
        failCount: status === 'failed' ? 1 : 0
      });
    }
    
    await testExecution.save();
    res.status(201).json(testExecution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Running Tests (for Real-time Dashboard)
router.get('/running', verifyToken, async (req, res) => {
  try {
    const runningTests = await TestExecution.find({ status: 'running' })
      .populate('assignedTo', 'name email')
      .populate('environment', 'name');
    res.json(runningTests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Test Details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const test = await TestExecution.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('environment', 'name baseUrl');
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;