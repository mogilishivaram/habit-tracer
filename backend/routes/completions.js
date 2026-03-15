const express = require('express');
const Completion = require('../models/Completion');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// TOGGLE COMPLETION
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { habitId, date, completed } = req.body;

    if (!habitId || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const incomingDate = new Date(date);
    const today = new Date();

    const incomingStr = incomingDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    if (incomingStr !== todayStr) {
      return res.status(403).json({
        error: 'Can only edit completions for today',
        attemptedDate: date,
        today: todayStr,
      });
    }

    const completion = await Completion.findOneAndUpdate(
      { userId: req.userId, habitId, date: incomingDate },
      { completed, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    res.status(201).json(completion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET COMPLETION HISTORY
router.get('/:habitId', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { userId: req.userId, habitId: req.params.habitId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const completions = await Completion.find(query).sort({ date: 1 });
    res.json(completions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
