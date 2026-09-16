const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');
const AttendanceSession = require('../models/AttendanceSession');
const { authMiddleware } = require('../config/auth');
const { isWithinRadius, calculateDistance } = require('../utils/locationValidator');
const { generateFingerprint, validateUniqueDevice } = require('../utils/deviceFingerprint');

// Mark Attendance
router.post('/mark', authMiddleware, async (req, res) => {
  try {
    const { classId, sessionId, latitude, longitude, deviceId, userAgent } = req.body;

    if (!classId || !sessionId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get class details
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Validate location
    const isLocationValid = isWithinRadius(
      latitude,
      longitude,
      classData.location.latitude,
      classData.location.longitude,
      classData.location.radius || 10
    );

    if (!isLocationValid) {
      const distance = calculateDistance(
        latitude,
        longitude,
        classData.location.latitude,
        classData.location.longitude
      );
      return res.status(403).json({
        error: 'You are outside the allowed location',
        distance: distance,
        allowedRadius: classData.location.radius
      });
    }

    // Generate device fingerprint
    const deviceFingerprint = generateFingerprint(deviceId, userAgent, req.ip);

    // Validate unique device
    const isUniqueDevice = await validateUniqueDevice(Attendance, deviceFingerprint, sessionId);
    if (!isUniqueDevice) {
      return res.status(409).json({
        error: 'This device has already marked attendance for this session'
      });
    }

    // Create attendance record
    const attendance = new Attendance({
      studentId: req.user.id,
      classId,
      sessionId,
      latitude,
      longitude,
      deviceFingerprint,
      locationValid: isLocationValid
    });

    await attendance.save();

    // Update session stats
    const session = await AttendanceSession.findOne({ sessionId });
    if (session) {
      session.presentCount += 1;
      await session.save();
      req.io.emit('attendance-updated', { sessionId, session });
    }

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance: {
        _id: attendance._id,
        timestamp: attendance.timestamp,
        status: attendance.status,
        locationValid: attendance.locationValid
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Get attendance records for a session
router.get('/session/:sessionId', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const attendance = await Attendance.find({ sessionId })
      .populate('studentId', 'name studentId email')
      .sort({ timestamp: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get student attendance history
router.get('/history/:studentId', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ studentId })
      .populate('classId', 'name code')
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
});

module.exports = router;
