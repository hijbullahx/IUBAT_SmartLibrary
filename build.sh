#!/usr/bin/env bash
# exit on error
set -o errexit

# Build React frontend first
echo "Building React frontend..."
cd ../frontend
npm ci
npm run build
cd ../backend

# Install Python dependencies
pip install -r requirements.txt

# Run Django commands
python manage.py migrate

# Setup initial data (students, PCs, etc.)
python add_real_students.py

# Create static directories and copy React build files
mkdir -p staticfiles/css staticfiles/js staticfiles/media

# Copy React build files to Django static directories
cp ../frontend/build/static/css/* staticfiles/css/ 2>/dev/null || true
cp ../frontend/build/static/js/* staticfiles/js/ 2>/dev/null || true  
cp ../frontend/build/static/media/* staticfiles/media/ 2>/dev/null || true
cp ../frontend/src/assets/IUBAT2.png staticfiles/media/IUBAT2.png 2>/dev/null || true

# Copy root level React files to static root
cp ../frontend/build/favicon.ico staticfiles/ 2>/dev/null || true
cp ../frontend/build/logo192.png staticfiles/ 2>/dev/null || true
cp ../frontend/build/logo512.png staticfiles/ 2>/dev/null || true
cp ../frontend/build/manifest.json staticfiles/ 2>/dev/null || true
cp ../frontend/build/robots.txt staticfiles/ 2>/dev/null || true

# Collect static files (this should now find our manually copied files)
python manage.py collectstatic --noinput
