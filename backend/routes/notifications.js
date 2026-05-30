const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Initialize email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Create Notification
router.post('/', verifyToken, async (req, res) => {
  try {
    const { userId, type, title, message, severity, relatedTest, channels } = req.body;
    
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      severity,
      relatedTest,
      channels
    });

    await notification.save();

    // Send notifications to channels
    const user = await User.findById(userId);
    
    if (channels.email && user.notificationPreferences.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: title,
        html: `<p>${message}</p>`
      });
    }

    if (channels.slack && user.slackWebhook) {
      // Send to Slack (implementation in next step)
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as Read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark All as Read
router.patch('/read/all', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id },
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Notification
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;