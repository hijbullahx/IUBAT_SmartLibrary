#!/bin/bash

# IUBAT Smart Library Deployment Build Script for Render

echo "🚀 Starting IUBAT Smart Library build process..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Run database migrations
echo "🗃️ Running database migrations..."
python manage.py migrate --noinput

# Create superuser (only if doesn't exist)
echo "👤 Creating superuser..."
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_automation.settings')
import django
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@iubat.edu', 'admin123')
    print('Admin user created successfully')
else:
    print('Admin user already exists')
"

# Setup initial data
echo "📊 Setting up initial data..."
if [ -f "setup_data.py" ]; then
    python setup_data.py
else
    echo "setup_data.py not found, skipping initial data setup"
fi

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Go back to root
cd ..

# Install frontend dependencies and build
echo "⚛️ Installing frontend dependencies..."
cd frontend
npm install --production=false

# Build frontend
echo "🏗️ Building frontend for production..."
npm run build

# Move built files to backend static directory
echo "📦 Moving frontend build to backend..."
mkdir -p ../backend/staticfiles/frontend
cp -r build/* ../backend/staticfiles/frontend/

echo "✅ Build process completed successfully!"
echo "🌐 Your application is ready for deployment on Render!"

cd ..
