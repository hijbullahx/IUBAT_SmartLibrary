#!/bin/bash

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

# Manually move the index.html file to a templates directory for Django to find
mkdir -p templates
mv frontend/build/index.html templates/index.html
