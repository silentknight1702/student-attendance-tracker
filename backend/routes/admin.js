const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const Class = require('../models/Class');
const Student = require('../models/Student');
const { authMiddleware, adminMiddleware } = require('../config/auth');
const ExcelJS = require('exceljs');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // This is a simplified example - implement proper admin authentication
    if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
      const token = require('../config/auth').generateToken('admin', 'admin');
      res.json({ token, role: 'admin' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get attendance statistics
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;
    const query = {};

    if (classId) query.classId = classId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const totalAttendance = await Attendance.countDocuments(query);
    const presentCount = await Attendance.countDocuments({ ...query, status: 'present' });
    const lateCount = await Attendance.countDocuments({ ...query, status: 'late' });
    const absentCount = await Attendance.countDocuments({ ...query, status: 'absent' });

    res.json({
      totalAttendance,
      presentCount,
      lateCount,
      absentCount,
      presentPercentage: totalAttendance > 0 ? (presentCount / totalAttendance * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get attendance records with filters
router.get('/attendance', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { classId, studentId, startDate, endDate, page = 1, limit = 50 } = req.query;
    const query = {};

    if (classId) query.classId = classId;
    if (studentId) query.studentId = studentId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const attendance = await Attendance.find(query)
      .populate('studentId', 'name studentId email')
      .populate('classId', 'name code')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    res.json({
      data: attendance,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Export attendance to Excel
router.get('/export/excel', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;
    const query = {};

    if (classId) query.classId = classId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name studentId email')
      .populate('classId', 'name code')
      .sort({ timestamp: 1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    worksheet.columns = [
      { header: 'Student ID', key: 'studentId', width: 15 },
      { header: 'Student Name', key: 'name', width: 20 },
      { header: 'Class', key: 'className', width: 20 },
      { header: 'Timestamp', key: 'timestamp', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Latitude', key: 'latitude', width: 15 },
      { header: 'Longitude', key: 'longitude', width: 15 }
    ];

    attendance.forEach(record => {
      worksheet.addRow({
        studentId: record.studentId.studentId,
        name: record.studentId.name,
        className: record.classId.name,
        timestamp: record.timestamp,
        status: record.status,
        latitude: record.latitude,
        longitude: record.longitude
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.xlsx');
    await workbook.xlsx.write(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export attendance' });
  }
});

module.exports = router;
