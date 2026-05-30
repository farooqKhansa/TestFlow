const express = require('express');
const router = express.Router();
const TestExecution = require('../models/TestExecution');
const { verifyToken } = require('../middleware/auth');

// Get Analytics Dashboard Data
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const { environmentId, startDate, endDate } = req.query;
    const query = {};
    
    if (environmentId) query.environment = environmentId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const tests = await TestExecution.find(query);
    
    const totalTests = tests.length;
    const passedTests = tests.filter(t => t.status === 'passed').length;
    const failedTests = tests.filter(t => t.status === 'failed').length;
    const skippedTests = tests.filter(t => t.status === 'skipped').length;
    const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0;
    const avgDuration = tests.reduce((sum, t) => sum + (t.result?.duration || 0), 0) / totalTests;

    // Flaky tests (tests that fail sometimes)
    const flakyTests = tests
      .filter(t => t.executionCount > 2 && t.failCount > 0)
      .map(t => ({
        testId: t.testId,
        testName: t.testName,
        flakinessPercentage: ((t.failCount / t.executionCount) * 100).toFixed(2)
      }))
      .sort((a, b) => b.flakinessPercentage - a.flakinessPercentage)
      .slice(0, 5);

    // Top failing tests
    const topFailingTests = tests
      .filter(t => t.failCount > 0)
      .sort((a, b) => b.failCount - a.failCount)
      .slice(0, 5)
      .map(t => ({
        testId: t.testId,
        testName: t.testName,
        failureCount: t.failCount,
        reason: t.result?.failureReason || 'Unknown'
      }));

    res.json({
      summary: {
        totalTests,
        passedTests,
        failedTests,
        skippedTests,
        passRate,
        avgDuration: avgDuration.toFixed(2)
      },
      flakyTests,
      topFailingTests
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Pass Rate Trend (for charts)
router.get('/trend/pass-rate', verifyToken, async (req, res) => {
  try {
    const { environmentId, days = 7 } = req.query;
    const query = {};
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    query.createdAt = { $gte: startDate };

    if (environmentId) query.environment = environmentId;

    const tests = await TestExecution.find(query);
    const groupedByDate = {};

    tests.forEach(test => {
      const date = test.createdAt.toISOString().split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = { total: 0, passed: 0 };
      }
      groupedByDate[date].total += 1;
      if (test.status === 'passed') groupedByDate[date].passed += 1;
    });

    const trend = Object.entries(groupedByDate).map(([date, data]) => ({
      date,
      passRate: ((data.passed / data.total) * 100).toFixed(2),
      totalTests: data.total
    }));

    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Test Duration Trend
router.get('/trend/duration', verifyToken, async (req, res) => {
  try {
    const { environmentId, days = 7 } = req.query;
    const query = {};
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    query.createdAt = { $gte: startDate };

    if (environmentId) query.environment = environmentId;

    const tests = await TestExecution.find(query);
    const groupedByDate = {};

    tests.forEach(test => {
      const date = test.createdAt.toISOString().split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = { durations: [] };
      }
      if (test.result?.duration) {
        groupedByDate[date].durations.push(test.result.duration);
      }
    });

    const trend = Object.entries(groupedByDate).map(([date, data]) => {
      const avgDuration = data.durations.length > 0
        ? (data.durations.reduce((a, b) => a + b, 0) / data.durations.length).toFixed(2)
        : 0;
      return { date, avgDuration };
    });

    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Distribution by Status
router.get('/distribution/status', verifyToken, async (req, res) => {
  try {
    const { environmentId } = req.query;
    const query = {};
    if (environmentId) query.environment = environmentId;

    const distribution = await TestExecution.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;