const crypto = require('crypto');

const generateFingerprint = (deviceId, userAgent, ipAddress) => {
  const data = `${deviceId}-${userAgent}-${ipAddress}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

const validateUniqueDevice = async (Attendance, deviceFingerprint, sessionId) => {
  const existingAttendance = await Attendance.findOne({
    deviceFingerprint,
    sessionId
  });
  
  return !existingAttendance;
};

module.exports = {
  generateFingerprint,
  validateUniqueDevice
};
