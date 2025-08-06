#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Navigate into the frontend directory
cd frontend

# Install frontend dependencies and build the app
npm install
npm run build

# Navigate back to the root
cd ..

# Install Python dependencies from requirements.txt
pip3 install -r requirements.txt

# Run Django's collectstatic to gather all static files
python3 manage.py collectstatic --noinput

# Manually copy the index.html file to a templates directory for Django to find
mkdir -p library_automation/templates
cp frontend/build/index.html library_automation/templates/index.html
