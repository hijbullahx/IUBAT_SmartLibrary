#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r backend/requirements.txt

# Navigate to backend directory
cd backend

# Run Django commands
python manage.py migrate

# Setup initial data (students, PCs, etc.)
python setup_data.py

# Copy React build files to Django static directory
mkdir -p static/css static/js static/media
cp ../frontend/build/static/css/* static/css/ 2>/dev/null || true
cp ../frontend/build/static/js/* static/js/ 2>/dev/null || true  
cp ../frontend/build/static/media/* static/media/ 2>/dev/null || true

# Collect static files  
python manage.py collectstatic --noinput
