# IUBAT Smart Library Management System

A comprehensive full-stack library management system built with Django REST API backend and React.js frontend for IUBAT University. The system provides unified deployment with integrated frontend and backend components.

## Project Architecture

```
IUBAT_SmartLibrary/
├── backend/                 # Django REST API Server
│   ├── library/            # Core Django application
│   ├── library_automation/ # Django project configuration
│   ├── templates/          # Frontend integration templates
│   ├── requirements.txt    # Python dependencies
│   ├── manage.py           # Django management utilities
│   ├── db.sqlite3          # SQLite database
│   ├── add_real_students.py # Student data initialization
│   └── setup_data.py       # Database setup script
├── frontend/               # React.js source files
│   ├── src/                # React components and assets
│   ├── public/             # Static frontend assets
│   ├── package.json        # Node.js dependencies
│   └── build/              # Production build artifacts
├── build.sh               # Deployment configuration
└── README.md               # Project documentation
```

## System Features

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

## Technical Specifications

### Backend Technology Stack
- **Framework**: Django 4.2.23 with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: Session-based admin authentication
- **CORS**: Cross-origin resource sharing for frontend integration
- **Middleware**: WhiteNoise for static file serving

### Frontend Technology Stack
- **Framework**: React.js with modern CSS styling
- **HTTP Client**: Fetch API for backend communication
- **UI Design**: Responsive design with gradient styling
- **Integration**: Inline CSS for production deployment

## Installation and Setup

### Backend Configuration
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python add_real_students.py
python manage.py runserver
```

### Frontend Development Setup
```bash
cd frontend
npm install
npm start
```

### Production Deployment
The system includes automated deployment configuration for Render platform with integrated build processes.

## API Documentation

### Library Management Endpoints
- `POST /api/entry/library/` - Toggle student library entry/exit status

### E-Library Management Endpoints
- `GET /api/elibrary/pc_status/` - Retrieve current PC availability status
- `POST /api/entry/elibrary/checkin/` - Assign student to specific PC
- `POST /api/entry/elibrary/checkout/` - Release student from PC assignment

### Administrative Endpoints
- `POST /api/admin/login/` - Admin authentication
- `GET /api/admin/reports/time-based/` - Generate time-based activity reports
- `GET /api/admin/reports/student-based/` - Generate student-specific usage reports

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
- `pc_number` - PC identifier (range 1-10)
- `is_dumb` - Hardware status indicator

## Development Workflow

### Database Management
```bash
# Initialize student data
python add_real_students.py

# Create administrative user
python manage.py createsuperuser

# Reset database
python manage.py flush
python add_real_students.py
```

### Testing and Validation
- Unit tests for API endpoints
- Integration testing for frontend-backend communication
- Database integrity validation

## Deployment Configuration

The system includes comprehensive deployment configuration for cloud platforms with automated build processes, static file management, and database initialization.

## System Requirements

### Development Environment
- Python 3.9+
- Node.js 16+
- SQLite (included with Python)

### Production Environment
- Python 3.9+ runtime
- PostgreSQL database
- Static file serving capability
- HTTPS support

## Contributing Guidelines

This project follows standard software engineering practices for version control, code review, and deployment processes. All contributions should maintain the existing architectural patterns and coding standards.

## License and Usage

This system is developed specifically for IUBAT University's library management requirements and contains institution-specific data and configurations.
