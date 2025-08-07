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
# First run collectstatic to create the directory structure
python manage.py collectstatic --noinput --clear

# Ensure staticfiles directory exists and has proper structure
mkdir -p staticfiles
mkdir -p staticfiles/js
mkdir -p staticfiles/css
mkdir -p staticfiles/media

# Copy React build files and override existing ones
if [ -d "../frontend/build" ]; then
    echo "📱 Copying React build files..."
    
    # Clean previous React files to avoid conflicts
    echo "🧹 Cleaning previous React files..."
    rm -rf staticfiles/css staticfiles/js staticfiles/media 2>/dev/null || true
    rm -rf staticfiles/static/ 2>/dev/null || true
    
    # Copy the React build static files directly to staticfiles
    echo "📂 Copying static files..."
    cp -r ../frontend/build/static/* staticfiles/
    
    # Copy other React build files (manifest.json, favicon.ico, etc.) to staticfiles root
    echo "📄 Copying root files..."
    cp ../frontend/build/*.ico ../frontend/build/*.json ../frontend/build/*.txt staticfiles/ 2>/dev/null || true
    
    echo "✅ React build files copied successfully"
    echo "📁 Directory structure:"
    ls -la staticfiles/css/ 2>/dev/null && echo "CSS files found" || echo "❌ No CSS directory"
    ls -la staticfiles/js/ 2>/dev/null && echo "JS files found" || echo "❌ No JS directory" 
    ls -la staticfiles/media/ 2>/dev/null && echo "Media files found" || echo "❌ No media directory"
fi

# Run collectstatic again to ensure everything is in place
echo "📁 Final static files collection..."
python manage.py collectstatic --noinput

echo "✅ Build process completed successfully!"
echo "🌐 Your application is ready for deployment on Render!"
echo "� Frontend files are pre-built and included in the repository"
