#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r backend/requirements.txt

# Navigate to backend directory
cd backend

# Run Django commands
python manage.py migrate
python manage.py collectstatic --noinput
