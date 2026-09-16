const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: String,
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    radius: {
      type: Number,
      default: 10,
      description: 'Radius in meters'
    },
    address: String
  },
  teacher: {
    type: String,
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Class', classSchema);
