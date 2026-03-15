const express = require('express');
const Habit = require('../models/Habit');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET ALL HABITS
router.get('/', authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE HABIT
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Habit name required' });
    }

    const habit = new Habit({
      userId: req.userId,
      name,
      color: color || '#60a5fa'
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE HABIT
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, color } = req.body;

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, color, updatedAt: Date.now() },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE HABIT
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
