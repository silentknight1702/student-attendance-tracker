const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { generateToken, authMiddleware } = require('../config/auth');

// Student Login
router.post('/login', async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({ error: 'Student ID and password required' });
    }

    const student = await Student.findOne({ studentId, isActive: true });
    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(student._id, 'student');
    res.json({
      token,
      student: {
        _id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current student
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});

module.exports = router;
