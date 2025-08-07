# 🏛️ IUBAT Smart Library Management System

A comprehensive full-stack library management system built with Django REST API backend and React.js frontend for IUBAT University. **Deploy with one URL for both frontend and backend!**

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/hijbullahx/IUBAT_SmartLibrary)

## 🏗️ Project Structure

```
IUBAT_SmartLibrary/
├── backend/                 # Django REST API
│   ├── library/            # Main Django app
│   ├── library_automation/ # Django project settings
│   ├── venv/               # Python virtual environment
│   ├── requirements.txt    # Python dependencies
│   ├── manage.py           # Django management
│   ├── db.sqlite3          # SQLite database
│   └── README.md           # Backend documentation
├── frontend/               # React.js UI
│   ├── src/                # React components
│   ├── public/             # Static files
│   ├── package.json        # Node.js dependencies
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🚀 Features

### Main Library Management
- **Student Entry/Exit**: Barcode scanning and manual ID entry
- **Real-time Tracking**: Live status updates for who's inside
- **Student Database**: 41 real IUBAT students pre-loaded

### E-Library PC Management
- **PC Status Monitoring**: Visual grid showing available/in-use/out-of-order PCs
- **Check-in/Check-out**: Student assignment to specific PCs
- **Usage Tracking**: Time-based PC usage logs

### Admin Dashboard
- **Secure Login**: Admin authentication system
- **Reports**: Time-based and student-based activity reports
- **Data Management**: System statistics and log management

## 🛠️ Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000
- **Admin Panel**: http://127.0.0.1:8000/admin

## 📊 System Components

### Backend (Django REST API)
- **Framework**: Django 4.2.23 with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: Session-based admin authentication
- **CORS**: Configured for React frontend integration

### Frontend (React.js)
- **Framework**: React 19.1.1
- **HTTP Client**: Axios for API communication
- **Styling**: Modern CSS with gradients and animations
- **Proxy**: Configured to forward API calls to Django backend

## 🎯 API Endpoints

### Main Library
- `POST /api/entry/library/` - Student entry/exit toggle

### E-Library
- `GET /api/elibrary/pc_status/` - Get all PC statuses
- `POST /api/entry/elibrary/checkin/` - Check student into PC
- `POST /api/entry/elibrary/checkout/` - Check student out of PC

### Admin
- `POST /api/admin/login/` - Admin authentication
- `GET /api/admin/reports/time-based/` - Time-based activity reports
- `GET /api/admin/reports/student-based/` - Student-specific reports

## 💾 Database Models

### Student
- `student_id` - Unique identifier
- `name` - Full name
- `department` - Academic department

### LibraryEntry
- `student` - Foreign key to Student
- `entry_time` - When student entered
- `exit_time` - When student left (null if still inside)

### ELibraryEntry
- `student` - Foreign key to Student
- `pc` - Foreign key to PC
- `entry_time` - PC check-in time
- `exit_time` - PC check-out time (null if still using)

### PC
- `pc_number` - PC identifier (1-10)
- `is_dumb` - Whether PC is out of order

## 🔧 Development

### Adding New Students
```bash
cd backend
python add_real_students.py
```

### Creating Admin User
```bash
cd backend
python manage.py createsuperuser
```

### Database Reset
```bash
cd backend
python manage.py flush
python add_real_students.py
```

## 🌐 Deployment

The system is configured for deployment on Vercel with proper Django settings for production.

## 📝 License

This project is developed for IUBAT University's library management needs.

## 👥 Contributors

- Library management system with real IUBAT student data
- Modern React interface with professional styling
- Comprehensive Django REST API backend
