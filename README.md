# Student Attendance Tracker

A comprehensive mobile and web application for student self-service attendance tracking with GPS-based location validation, device fingerprinting, real-time updates, and admin dashboard.

## Features

### Mobile App
- **Student Self-Service Attendance**: Students mark attendance via mobile app
- **GPS Location Validation**: Ensures attendance is marked within 10m of classroom
- **Device Fingerprinting**: One device = one attendance per session
- **Student ID Authentication**: Secure login with student credentials
- **Real-time Feedback**: Instant confirmation of attendance submission
- **Offline Support**: Works even with intermittent connectivity

### Admin Dashboard
- **Real-time Attendance Updates**: Live view of attendance submissions
- **Attendance Records**: Complete history of all student attendance
- **Excel Export**: Download attendance data in Excel format
- **Analytics & Reports**: Attendance trends and statistics
- **Class Management**: Create and manage classes and sessions
- **Location Management**: Set up classroom locations with GPS coordinates

## Tech Stack

### Frontend - Mobile App
- **React Native / Expo**: Cross-platform mobile development
- **Geolocation API**: GPS-based location tracking
- **Device ID Libraries**: Device fingerprinting
- **Redux**: State management
- **Axios**: API calls

### Frontend - Admin Dashboard
- **React**: UI framework
- **TypeScript**: Type safety
- **Material-UI**: UI components
- **Redux**: State management
- **Chart.js**: Analytics visualization
- **ExcelJS**: Excel export functionality

### Backend
- **Node.js / Express**: REST API server
- **MongoDB**: Database for storing attendance records
- **JWT**: Authentication and authorization
- **Geolocation Libraries**: Validate GPS coordinates
- **Socket.io**: Real-time updates
- **CORS**: Cross-origin requests

### DevOps & Deployment
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipeline
- **Heroku/AWS**: Cloud deployment

## Project Structure

```
student-attendance-tracker/
├── mobile-app/              # React Native/Expo mobile application
├── admin-dashboard/         # React admin dashboard
├── backend/                 # Node.js/Express API server
├── docker-compose.yml       # Docker configuration
├── .github/                 # GitHub Actions workflows
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB
- Expo CLI (for mobile development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/silentknight1702/student-attendance-tracker.git
cd student-attendance-tracker
```

2. Install dependencies
```bash
# Backend
cd backend && npm install

# Mobile app
cd ../mobile-app && npm install

# Admin dashboard
cd ../admin-dashboard && npm install
```

3. Configure environment variables
```bash
cp backend/.env.example backend/.env
```

4. Start MongoDB
```bash
mongod
```

5. Run the backend
```bash
cd backend && npm start
```

6. Run the mobile app (in another terminal)
```bash
cd mobile-app && expo start
```

7. Run the admin dashboard (in another terminal)
```bash
cd admin-dashboard && npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Student login
- `POST /api/auth/logout` - Student logout
- `POST /api/admin/login` - Admin login

### Attendance
- `POST /api/attendance/mark` - Mark attendance (mobile app)
- `GET /api/attendance/records` - Get attendance records (admin dashboard)
- `GET /api/attendance/stats` - Get attendance statistics

### Classes
- `POST /api/classes` - Create class (admin only)
- `GET /api/classes` - Get all classes
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Real-time Updates
- WebSocket connection for live attendance updates

## Database Schema

### Students
```json
{
  "_id": "ObjectId",
  "studentId": "STU001",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "deviceFingerprint": "device_id_hash",
  "createdAt": "timestamp"
}
```

### Attendance
```json
{
  "_id": "ObjectId",
  "studentId": "STU001",
  "classId": "CLASS001",
  "sessionId": "SESSION001",
  "timestamp": "2026-09-16T10:30:00Z",
  "latitude": "40.7128",
  "longitude": "-74.0060",
  "deviceFingerprint": "device_id_hash",
  "status": "present"
}
```

### Classes
```json
{
  "_id": "ObjectId",
  "name": "Mathematics 101",
  "location": {
    "latitude": "40.7128",
    "longitude": "-74.0060",
    "radius": 10
  },
  "createdAt": "timestamp"
}
```

## Security Considerations

- JWT token-based authentication
- Password hashing with bcrypt
- Device fingerprinting to prevent multiple submissions
- GPS validation to ensure location authenticity
- HTTPS only communication
- Rate limiting on API endpoints
- Input validation and sanitization

## Contributing

Contributions are welcome! Please follow the contribution guidelines.

## License

MIT License - feel free to use this project for your needs.

## Support

For issues, feature requests, or questions, please open an issue on GitHub.
