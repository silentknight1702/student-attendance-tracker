const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  status: {
    type: String,
    enum: ['active', 'closed', 'cancelled'],
    default: 'active'
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  presentCount: {
    type: Number,
    default: 0
  },
  lateCount: {
    type: Number,
    default: 0
  },
  absentCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
