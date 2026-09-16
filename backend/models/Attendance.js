const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  deviceFingerprint: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'late', 'absent'],
    default: 'present'
  },
  locationValid: {
    type: Boolean,
    default: true
  },
  deviceValid: {
    type: Boolean,
    default: true
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for unique attendance per device per session
attendanceSchema.index({ deviceFingerprint: 1, sessionId: 1 }, { unique: true });
attendanceSchema.index({ studentId: 1, timestamp: 1 });
attendanceSchema.index({ classId: 1, timestamp: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
