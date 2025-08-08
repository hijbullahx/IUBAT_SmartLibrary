#!/usr/bin/env bash
# exit on error
set -o errexit

# Build React frontend first
echo "Building React frontend..."
cd frontend
npm ci
npm run build
cd ..

# Navigate to backend directory for Django operations
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run Django commands
python manage.py migrate

# Setup initial data (students, PCs, etc.)
python add_real_students.py

# Create static directories and copy essential files
mkdir -p staticfiles/media

# Copy essential assets (logo)
cp ../frontend/src/assets/IUBAT2.png staticfiles/media/IUBAT2.png 2>/dev/null || true

# Collect static files
python manage.py collectstatic --noinput
