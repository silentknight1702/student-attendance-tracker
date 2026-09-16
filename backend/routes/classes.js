const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const { authMiddleware, adminMiddleware } = require('../config/auth');

// Get all classes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true })
      .populate('students', 'name studentId email')
      .sort({ createdAt: -1 });

    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get class by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('students', 'name studentId email');

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(classData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

module.exports = router;
