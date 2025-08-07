#!/bin/bash
set -e  # Exit on any error

# IUBAT Smart Library Deployment Build Script for Render

echo "🚀 Starting IUBAT Smart Library build process..."
echo "🐍 Python version: $(python --version)"

# Upgrade pip first
echo "📦 Upgrading pip..."
python -m pip install --upgrade pip

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend

# Install requirements with specific flags for better compatibility
pip install -r requirements.txt --no-cache-dir --force-reinstall

# Verify psycopg2 installation
echo "🔍 Testing database module..."
python -c "import psycopg2; print('✅ psycopg2 imported successfully')" || echo "❌ psycopg2 import failed"

# Set Django settings explicitly
export DJANGO_SETTINGS_MODULE=library_automation.settings

# Run database migrations
echo "🗃️ Running database migrations..."
python manage.py migrate --noinput --verbosity=2

# Create superuser (only if doesn't exist)
echo "👤 Creating superuser..."
python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_automation.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@iubat.edu', 'admin123')
    print('✅ Admin user created successfully')
else:
    print('✅ Admin user already exists')
"

# Setup initial data
echo "📊 Setting up initial data..."
if [ -f "setup_data.py" ]; then
    python setup_data.py
    echo "✅ Initial data loaded"
else
    echo "⚠️ setup_data.py not found, skipping initial data setup"
fi

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput --clear

# Go back to root
cd ..

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "⚛️ Node.js found, building frontend..."
    
    # Install frontend dependencies and build
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install --production=false
    
    # Build frontend
    echo "🏗️ Building frontend for production..."
    npm run build
    
    # Move built files to backend static directory
    echo "📦 Moving frontend build to backend..."
    mkdir -p ../backend/staticfiles/frontend
    cp -r build/* ../backend/staticfiles/frontend/
    
    cd ..
else
    echo "⚠️ Node.js not found, skipping frontend build"
fi

echo "✅ Build process completed successfully!"
echo "🌐 Your application is ready for deployment on Render!"
