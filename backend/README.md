# IUBAT Smart Library - Backend

Django REST API backend for the IUBAT Smart Library management system.

## Features

- **Main Library Management**: Entry/exit tracking for students
- **E-Library Management**: PC allocation and usage tracking
- **Admin Dashboard**: Reports and system management
- **Real Student Data**: 41 IUBAT students pre-loaded

## Setup

1. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   ```

2. **Activate Virtual Environment**:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Add Real Student Data** (if needed):
   ```bash
   python add_real_students.py
   ```

6. **Create Superuser** (for admin access):
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Development Server**:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://127.0.0.1:8000/`

## API Endpoints

### Main Library
- `POST /api/entry/library/` - Student entry/exit

### E-Library
- `GET /api/elibrary/pc_status/` - Get PC status
- `POST /api/entry/elibrary/checkin/` - Check in to PC
- `POST /api/entry/elibrary/checkout/` - Check out from PC

### Admin
- `POST /api/admin/login/` - Admin login
- `POST /api/admin/logout/` - Admin logout
- `GET /api/admin/reports/time-based/` - Time-based reports
- `GET /api/admin/reports/student-based/` - Student-based reports

## Database

- **Development**: SQLite (`db.sqlite3`)
- **Models**: Student, LibraryEntry, ELibraryEntry, PC

## Project Structure

```
backend/
├── library/               # Main Django app
│   ├── models.py         # Database models
│   ├── views.py          # API views
│   ├── urls.py           # URL routing
│   └── admin.py          # Django admin
├── library_automation/   # Django project settings
│   ├── settings.py       # Main settings
│   ├── urls.py           # Main URL config
│   └── wsgi.py           # WSGI config
├── venv/                 # Virtual environment
├── requirements.txt      # Python dependencies
├── manage.py             # Django management script
└── db.sqlite3            # SQLite database
```
