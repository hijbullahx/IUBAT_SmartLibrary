@echo off
REM IUBAT Smart Library Deployment Build Script for Windows

echo 🚀 Starting IUBAT Smart Library build process...

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
pip install -r requirements.txt

REM Run database migrations
echo 🗃️ Running database migrations...
python manage.py migrate

REM Create superuser (optional - only if needed)
echo 👤 Creating superuser (skip if exists)...
echo from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@iubat.edu', 'admin123') | python manage.py shell

REM Setup initial data
echo 📊 Setting up initial data...
python setup_data.py

REM Collect static files
echo 📁 Collecting static files...
python manage.py collectstatic --noinput

REM Go back to root
cd ..

REM Install frontend dependencies
echo ⚛️ Installing frontend dependencies...
cd frontend
npm install

REM Build frontend
echo 🏗️ Building frontend...
npm run build

echo ✅ Build process completed successfully!
echo 🌐 Your application is ready for deployment!

cd ..
