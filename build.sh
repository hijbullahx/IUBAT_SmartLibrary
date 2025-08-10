#!/usr/bin/env bash
# exit on error
set -o errexit

# Build React frontend first
echo "Building React frontend..."
cd frontend
npm install
npm run build

# Copy React build to Django static files
cd ..
mkdir -p backend/static
cp -r frontend/build/* backend/static/

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
