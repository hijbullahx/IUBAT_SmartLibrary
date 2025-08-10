#!/usr/bin/env bash
# exit on error
set -o errexit

# Build React frontend first
echo "Building React frontend..."
cd frontend
npm install
npm run build

# Copy React build to Django static files - flatten the structure
cd ..
mkdir -p backend/static
# Copy top-level files (index.html, manifest.json, etc.)
cp frontend/build/*.* backend/static/ 2>/dev/null || true
# Copy the static subdirectory contents directly to static/
cp -r frontend/build/static/* backend/static/ 2>/dev/null || true

# Navigate to backend directory for Django operations
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run Django commands
python manage.py migrate

# Setup initial data (students, PCs, etc.)
python add_real_students.py

# Collect static files (including React build)
python manage.py collectstatic --noinput
