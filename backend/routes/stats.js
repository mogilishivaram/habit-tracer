const express = require('express');
const Completion = require('../models/Completion');
const Habit = require('../models/Habit');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET MONTHLY STATS
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start and end dates required' });
    }

    const habits = await Habit.find({ userId: req.userId });

    const completions = await Completion.find({
      userId: req.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    const totalCompleted = completions.filter(c => c.completed).length;
    const totalPossible = habits.length * 31;
    const completionRate = totalPossible > 0
      ? (totalCompleted / totalPossible * 100).toFixed(2)
      : 0;

    res.json({
      totalCompleted,
      totalPossible,
      completionRate: parseFloat(completionRate),
      habits: habits.length,
      completions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
