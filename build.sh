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
# Copy React build files and override existing ones
if [ -d "../frontend/build" ]; then
    echo "📱 Copying React build files..."
    cp -rf ../frontend/build/* staticfiles/
    # Override the main.97e84a4f.js file specifically with the new one
    if [ -f "../frontend/build/static/js/main.6e209e95.js" ]; then
        echo "🔄 Overriding old JS file with new API URLs..."
        cp ../frontend/build/static/js/main.6e209e95.js staticfiles/js/main.97e84a4f.js
    fi
    cp ../frontend/build/index.html templates/
    echo "✅ React build files copied and JS file updated"
fi
python manage.py collectstatic --noinput --clear

echo "✅ Build process completed successfully!"
echo "🌐 Your application is ready for deployment on Render!"
echo "� Frontend files are pre-built and included in the repository"
