const geolib = require('geolib');

const isWithinRadius = (studentLat, studentLng, classLat, classLng, radiusInMeters) => {
  const distance = geolib.getDistance(
    { latitude: studentLat, longitude: studentLng },
    { latitude: classLat, longitude: classLng }
  );
  
  return distance <= radiusInMeters;
};

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  return geolib.getDistance(
    { latitude: lat1, longitude: lng1 },
    { latitude: lat2, longitude: lng2 }
  );
};

module.exports = {
  isWithinRadius,
  calculateDistance
};
