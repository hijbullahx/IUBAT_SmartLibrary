# IUBAT Library Digital Entry-Exit System

A modern, full-stack solution for managing physical library entry/exit and e-library PC usage at IUBAT University. This system provides real-time tracking, robust administrative tools, and a seamless experience for both students and staff.

---

## Features

### Library Entry Management
- Student identification through ID verification
- Real-time entry and exit tracking
- Live occupancy monitoring
- Student database with 43 IUBAT university students

# IUBAT Smart Library System

A full-stack digital library management system for IUBAT University, supporting both physical library entry/exit and e-library PC usage. The project is designed for real-time tracking, robust administration, and a seamless experience for students and staff.

---

## Features

- **Library Entry Management:** Student ID verification, real-time entry/exit tracking, live occupancy, and a student database.
- **E-Library PC Management:** PC availability monitoring, student-PC assignment, check-in/out, usage time tracking, and hardware status.
- **Administrative Tools:** Secure admin authentication, reporting, activity analysis, student usage reports, statistics dashboard, and database utilities.
- **Issue Reporting:** Students can submit complaints/issues; admins can mark them as solved.

---

## Technology Stack

- **Backend:** Django 4.2.23, Django REST Framework, SQLite (dev) / PostgreSQL (prod), CORS, WhiteNoise for static files.
- **Frontend:** React.js (served as static files), responsive CSS, Fetch API for backend communication.
- **Authentication:** Session-based admin authentication.
- **Deployment:** Designed for Render.com, with CORS and CSRF settings for secure cross-origin requests.

---

## Project Structure

- **backend/**
  - `manage.py`: Django management script.
  - `library_automation/`: Django project settings, URLs, WSGI/ASGI.
  - `library/`: Main app with models, views, admin, migrations, management commands.
  - `static/` and `staticfiles/`: Static assets (CSS, JS, images) for both admin and frontend.
  - `templates/`: HTML templates for server-rendered pages.
  - `db.sqlite3`: Development database.

---

## Main Models

- **Student:** ID, name, department.
- **PC:** PC number, status (dumb/active).
- **LibraryEntry:** Tracks student entry/exit times.
- **ELibraryEntry:** Tracks student PC usage.
- **IssueReport:** Student complaints/issues, type, description, status.

---

## Getting Started

1. **Clone the repository**
2. **Backend:**
   - Install Python dependencies: `pip install -r requirements.txt`
   - Run migrations: `python manage.py migrate`
   - Start server: `python manage.py runserver`
3. **Frontend:**
   - (If React source is present) Install dependencies: `npm install`
   - Start dev server: `npm start`
   - (Or serve static build from Django)

---

## License

MIT License
   - Run migrations: `python manage.py migrate`
