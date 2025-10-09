# IUBAT Library Digital Entry-Exit System

A modern, full-stack solution for managing physical library entry/exit and e-library PC usage at IUBAT University. This system provides real-time tracking, robust administrative tools, and a seamless experience for both students and staff.

---

## Features

### Library Entry Management
- Student identification through ID verification
- Real-time entry and exit tracking
- Live occupancy monitoring
- Student database with 43 IUBAT university students

### E-Library PC Management
- PC availability status monitoring
- Student-PC assignment system
- Check-in and check-out functionality
- PC usage time tracking
- Hardware status management (operational/out-of-order)

### Administrative Interface
- Secure admin authentication
- Comprehensive reporting system
- Time-based activity analysis
- Student-specific usage reports
- System statistics dashboard
- Database management utilities

---

## Technology Stack

### Backend
- **Framework:** Django 4.2.23 with Django REST Framework
- **Database:** SQLite (development) / PostgreSQL (production)
- **Authentication:** Session-based admin authentication
- **CORS:** Cross-origin resource sharing for frontend integration
- **Middleware:** WhiteNoise for static file serving

### Frontend
- **Framework:** React.js with modern CSS styling
- **HTTP Client:** Fetch API for backend communication
- **UI Design:** Responsive design with gradient styling
- **Integration:** Inline CSS for production deployment

---

## Database Schema

### Student Model
- `student_id` - Primary identifier (8-digit format)
- `name` - Full student name
- `department` - Academic department affiliation

### LibraryEntry Model
- `student` - Foreign key reference to Student
- `entry_time` - Timestamp of library entry
- `exit_time` - Timestamp of library exit (nullable for current occupants)

### ELibraryEntry Model
- `student` - Foreign key reference to Student
- `pc` - Foreign key reference to PC
- `entry_time` - PC session start timestamp
- `exit_time` - PC session end timestamp (nullable for active sessions)

### PC Model
- `pc_number` - PC identifier 
- `is_dumb` - Hardware status indicator (True if out-of-order)

---

## Getting Started

1. **Clone the repository**
2. **Backend:**
   - Install Python dependencies: `pip install -r requirements.txt`
   - Run migrations: `python manage.py migrate`
   - Start server: `python manage.py runserver`
3. **Frontend:**
   - Install dependencies: `npm install`
   - Start development server: `npm start`

---

## License
MIT License
