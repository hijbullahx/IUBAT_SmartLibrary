# Quick Start Guide - IUBAT Smart Library

## Project Structure Overview

```
IUBAT_SmartLibrary/
├── backend/              # Django REST API Server
│   ├── library/             # Core Django application
│   ├── library_automation/  # Django project configuration
│   ├── templates/           # Frontend integration templates
│   ├── requirements.txt     # Python package dependencies
│   ├── manage.py            # Django management utilities
│   ├── db.sqlite3           # SQLite database
│   ├── add_real_students.py # Student data initialization script
│   └── setup_data.py        # Database setup utilities
├── frontend/             # React.js Frontend (Source)
│   ├── src/                 # React components and assets
│   ├── public/              # Static frontend resources
│   ├── node_modules/        # Node.js dependencies
│   ├── package.json         # Node.js configuration
│   └── build/               # Production build output
├── build.sh              # Deployment configuration script
└── README.md             # Complete project documentation
```

## Installation Instructions

### Step 1: Backend Server Setup (Django API)
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows Command Prompt
source venv/bin/activate       # macOS/Linux Terminal
pip install -r requirements.txt
python manage.py migrate
python add_real_students.py
python manage.py runserver
```
**Backend API Server**: `http://127.0.0.1:8000/`

### Step 2: Frontend Development Setup (React UI)
```bash
cd frontend
npm install
npm start
```
**Frontend Development Server**: `http://localhost:3000/`

## System Status Verification

### Backend Functionality
- **Django REST API** operational on port 8000
- **Student Database** populated with 43 IUBAT university students
- **SQLite Database** configured with complete data models
- **PC Management System** initialized (8 operational, 2 out-of-order PCs)
- **Admin Dashboard APIs** with authentication system
- **Library Entry/Exit Tracking** endpoints operational
- **E-Library PC Management** API endpoints active

### Frontend Functionality
- **React.js Interface** running on port 3000
- **Professional Gradient Design** with responsive layout
- **Library Entry Interface** for student identification and tracking
- **E-Library PC Management** with visual status grid
- **Admin Dashboard** with authentication and reporting
- **API Integration** via proxy configuration

### System Integration Status
- **API Proxy Configuration**: Frontend requests automatically routed to backend
- **Student Data Integration**: 43 real IUBAT students from institutional records
- **CORS Configuration**: Proper cross-origin request handling
- **Database Models**: Student, LibraryEntry, ELibraryEntry, PC models operational

## Development Environment

### Backend Development Commands
```bash
cd backend
venv\Scripts\activate
python manage.py shell          # Access Django interactive shell
python manage.py migrate        # Execute database migrations
python add_real_students.py     # Populate student database
python manage.py createsuperuser # Create admin user account
```

### Frontend Development Commands
```bash
cd frontend
npm start                       # Start development server
npm run build                   # Generate production build
npm test                        # Execute test suite
```

## API Endpoint Documentation

### Operational Endpoints
- `GET /api/elibrary/pc_status/` - Retrieve PC availability status
- `POST /api/entry/library/` - Process student library entry/exit
- `POST /api/entry/elibrary/checkin/` - Assign student to PC
- `POST /api/entry/elibrary/checkout/` - Release student from PC
- `POST /api/admin/login/` - Admin authentication
- `GET /api/admin/reports/time-based/` - Generate time-based reports
- `GET /api/admin/reports/student-based/` - Generate student-specific reports

## Database Configuration

### Student Data Management
- **43 Real IUBAT Students** pre-loaded in database
- **Student ID Format**: 8-digit university identification numbers
- **Department Information**: Academic department assignments
- **Entry/Exit Tracking**: Timestamp-based activity logging

### PC Management System
- **10 Total PCs**: Numbered 1 through 10
- **8 Operational PCs**: Available for student assignment
- **2 Out-of-Order PCs**: Marked as non-functional
- **Real-time Status**: Available, In-use, Out-of-order states

## Production Deployment

### Deployment Configuration
The system includes automated deployment scripts configured for cloud platforms with:
- Static file serving optimization
- Database initialization procedures
- Environment-specific configuration management
- Build process automation

### Access URLs
- **Production Application**: Deployed URL from hosting platform
- **Admin Interface**: `/admin` endpoint for administrative access
- **API Documentation**: Available through Django REST framework

## System Requirements

### Development Environment
- Python 3.9 or higher
- Node.js 16 or higher
- SQLite database (included with Python)
- Git version control system

### Production Environment
- Python runtime environment
- PostgreSQL database server
- Static file serving capability
- HTTPS encryption support

## Project Status Summary

**Backend-Frontend Integration**: Complete and operational
**Database Infrastructure**: Fully configured with real data
**API Functionality**: All endpoints tested and operational
**User Interface**: Modern React implementation with professional styling
**Documentation**: Comprehensive technical documentation
**Deployment Configuration**: Ready for production deployment

**Development Status**: Complete and ready for institutional deployment and further development.
