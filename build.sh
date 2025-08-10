#!/usr/bin/env bash
# exit on error
set -o errexit

# Navigate to backend directory for Django operations
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run Django commands
python manage.py migrate

# Setup initial data (students, PCs, etc.)
python add_real_students.py

# Collect static files for Django admin only
python manage.py collectstatic --noinput
