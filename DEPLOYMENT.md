# 🚀 IUBAT Smart Library Deployment Guide

This guide will help you deploy your IUBAT Smart Library application with full-stack functionality using one deployment link.

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (3.9 or higher)
- Git
- Neon PostgreSQL database (already configured)

## 🏗️ Deployment Options

### Option 1: Vercel (Recommended for Full-Stack)

#### Step 1: Prepare Your Repository
```bash
# Clone your repository (if not already done)
git clone https://github.com/hijbullahx/IUBAT_SmartLibrary.git
cd IUBAT_SmartLibrary

# Install dependencies and test locally
./build.bat  # On Windows
# or
./build.sh   # On Linux/Mac
```

#### Step 2: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Set Environment Variables:**
   ```bash
   vercel env add SECRET_KEY
   # Enter: your-super-secret-django-key-here
   
   vercel env add DATABASE_URL
   # Enter: postgresql://neondb_owner:npg_BD48fmwROHWL@ep-bold-moon-ad14lfg1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   
   vercel env add DEBUG
   # Enter: False
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

#### Step 3: Configure Domain

After deployment, Vercel will provide you with a URL like:
- `https://iubat-smart-library-abc123.vercel.app`

This single URL will serve both your frontend and backend!

### Option 2: Render (Alternative)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Set the following:**
   - Build Command: `./build.sh`
   - Start Command: `cd backend && gunicorn library_automation.wsgi:application`
   - Environment Variables:
     - `SECRET_KEY`: your-secret-key
     - `DATABASE_URL`: your-neon-connection-string
     - `DEBUG`: False

### Option 3: Heroku

1. **Create a new Heroku app:**
   ```bash
   heroku create iubat-smart-library
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set SECRET_KEY="your-secret-key"
   heroku config:set DATABASE_URL="your-neon-connection-string"
   heroku config:set DEBUG=False
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

## 🔧 Local Development Setup

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load initial data
python setup_data.py

# Start backend server
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start frontend server
npm start
```

## 🌐 Accessing Your Application

### Production (Single URL for both frontend and backend):
- **Frontend**: `https://your-app.vercel.app/`
- **Admin Panel**: `https://your-app.vercel.app/admin/`
- **API**: `https://your-app.vercel.app/api/`

### Development:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://127.0.0.1:8000`
- **Admin Panel**: `http://127.0.0.1:8000/admin`

## 📊 Features Available

✅ **Student Entry/Exit Management**
✅ **E-Library PC Management**
✅ **Admin Dashboard with Reports**
✅ **Real-time Status Updates**
✅ **Secure Authentication**
✅ **PostgreSQL Database (Neon)**
✅ **Full-Stack Single URL Deployment**

## 🔑 Default Admin Credentials

- **Username**: admin
- **Password**: admin123
- **Email**: admin@iubat.edu

**⚠️ Important**: Change these credentials after first login!

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Verify your Neon PostgreSQL connection string
   - Check environment variables are set correctly

2. **Static Files Not Loading**:
   - Run `python manage.py collectstatic`
   - Check STATIC_ROOT and STATIC_URL settings

3. **CORS Errors**:
   - Update CORS_ALLOWED_ORIGINS with your frontend domain
   - Ensure both frontend and backend are on the same domain in production

4. **Migration Issues**:
   - Run `python manage.py makemigrations`
   - Then `python manage.py migrate`

## 📞 Support

For technical support or questions about deployment, please:
1. Check the troubleshooting section above
2. Review the Django and React logs for specific error messages
3. Ensure all environment variables are correctly set

## 🔄 Updating Your Deployment

1. **Make changes to your code**
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```
3. **Redeploy (Vercel auto-deploys on push)**

Your IUBAT Smart Library is now ready for production! 🎉
