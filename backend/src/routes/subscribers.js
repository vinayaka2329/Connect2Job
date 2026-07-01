// backend/src/routes/subscribers.js

const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// @route   POST /api/subscribers
// @desc    Subscribe to newsletter
// @access  Public
// @route   GET /api/subscribers
// @desc    Get all subscribers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Already subscribed' });
    }
    const subscriber = await Subscriber.create({ email });
    res.status(201).json({ success: true, data: subscriber });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;