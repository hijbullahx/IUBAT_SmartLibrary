# 🚀 IUBAT Smart Library - Quick Deployment Guide

## Quick Deploy to Vercel (One-Click Solution)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy with Environment Variables
```bash
# Navigate to your project directory
cd IUBAT_SmartLibrary

# Set environment variables during deployment
vercel --prod

# When prompted, set these environment variables:
# - SECRET_KEY: django-insecure-your-secret-key-here-change-this
# - DATABASE_URL: postgresql://neondb_owner:npg_BD48fmwROHWL@ep-bold-moon-ad14lfg1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
# - DEBUG: False
```

### 4. Access Your Deployed Application
After deployment, you'll get a single URL like:
- **https://iubat-smart-library-xyz.vercel.app**

This URL serves:
- ✅ Frontend React App
- ✅ Backend Django API
- ✅ Admin Panel (/admin)
- ✅ All API endpoints (/api/...)

## Alternative: Deploy to Render (Detailed Guide)

### Step 1: Prepare Your Repository
```bash
cd IUBAT_SmartLibrary
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account** (recommended)
4. Authorize Render to access your repositories

### Step 3: Create New Web Service
1. **Dashboard**: Click **"New +"** button
2. **Select**: Choose **"Web Service"**
3. **Connect Repository**: 
   - Click **"Connect account"** if not connected
   - Find your repository: `hijbullahx/IUBAT_SmartLibrary`
   - Click **"Connect"**

### Step 4: Configure Service Settings

#### Basic Configuration:
- **Name**: `iubat-smart-library` (or your preferred name)
- **Root Directory**: Leave blank (uses root directory)
- **Environment**: `Python 3`
- **Region**: Choose closest to your users (Oregon US West recommended)
- **Branch**: `main`

#### Build and Deploy Commands:
- **Build Command**: 
  ```bash
  chmod +x build.sh && ./build.sh
  ```
- **Start Command**: 
  ```bash
  cd backend && gunicorn library_automation.wsgi:application --bind 0.0.0.0:$PORT
  ```

### Step 5: Set Environment Variables
Click **"Advanced"** → **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | `django-insecure-your-secret-key-here-change-this-in-production` |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_BD48fmwROHWL@ep-bold-moon-ad14lfg1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `DEBUG` | `False` |
| `PYTHONPATH` | `/opt/render/project/src/backend` |

### Step 6: Choose Plan and Deploy
1. **Free Tier**: Perfect for development/testing
   - 750 hours/month
   - Sleeps after 15 minutes of inactivity
   - Automatic HTTPS included
2. Click **"Create Web Service"**
3. Monitor build process in **"Logs"** tab (5-10 minutes)

### Step 7: Access Your Application
After successful deployment, you'll get a URL like:
**`https://iubat-smart-library.onrender.com`**

This URL provides:
- 🌐 **Frontend**: Main application interface
- 🔧 **Admin Panel**: `/admin/` - Admin dashboard
- 📡 **API**: `/api/` - All backend endpoints

## 🔑 Admin Access
- **URL**: `https://your-domain.com/admin`
- **Username**: admin
- **Password**: admin123
- **Email**: admin@iubat.edu

**⚠️ Change these credentials after first login!**

## 🧪 Testing Locally First (Optional)

### Backend Test
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Test
```bash
cd frontend
npm install
npm start
```

## 📱 Features Available After Deployment

✅ **Main Library System**
- Student entry/exit tracking
- Real-time student status
- Barcode scanning support

✅ **E-Library PC Management**
- 10 PC status monitoring
- Student check-in/check-out
- PC availability tracking

✅ **Admin Dashboard**
- Time-based activity reports
- Student-specific reports
- System statistics

✅ **Database**
- 41 real IUBAT students pre-loaded
- PostgreSQL (Neon) cloud database
- Automated backups

## 🛠️ Troubleshooting

### If deployment fails:
1. **Check Build Logs**: Go to Render dashboard → "Logs" tab
2. **Common Issues**:
   - **Environment Variables**: Verify all variables are set correctly
   - **GitHub Connection**: Ensure repository is accessible
   - **Build Script**: Check if `build.sh` has execute permissions
   - **Dependencies**: Verify `requirements.txt` and `package.json` are correct

### If the app doesn't load:
1. **Check Deployment Logs**: Look for error messages in Render logs
2. **Database Connection**: Verify Neon database is active and connection string is correct
3. **Environment Variables**: Ensure all required variables are set
4. **Static Files**: Check if `collectstatic` ran successfully during build

### Free Tier Limitations:
- **App Sleep**: App sleeps after 15 minutes of inactivity
- **Wake Time**: First request after sleep may take 30+ seconds
- **Workaround**: Upgrade to paid plan for 24/7 availability

### Testing Your Deployment:

#### Test Main Features:
```bash
# Test student entry (replace with your Render URL)
curl -X POST https://your-app.onrender.com/api/entry/library/ \
  -H "Content-Type: application/json" \
  -d '{"student_id": "001"}'

# Test PC status
curl https://your-app.onrender.com/api/elibrary/pc_status/

# Test admin API (after login)
curl https://your-app.onrender.com/api/admin/reports/time-based/
```

#### Test in Browser:
1. **Main App**: `https://your-app.onrender.com/`
2. **Admin Panel**: `https://your-app.onrender.com/admin/`
3. **API Status**: `https://your-app.onrender.com/api/`

## 🔄 Updates

### Auto-Deploy (Recommended):
1. **Enable Auto-Deploy**: In Render dashboard → Settings → Auto-Deploy: "Yes"
2. **Make Changes**: Update your code locally
3. **Push to GitHub**: 
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```
4. **Automatic Deployment**: Render detects changes and redeploys automatically

### Manual Deploy:
1. Go to Render dashboard
2. Click **"Manual Deploy"** button
3. Select branch and commit to deploy

## 🚀 Post-Deployment Setup

### Immediate Actions After Deployment:

1. **Change Admin Password**:
   - Go to `https://your-app.onrender.com/admin/`
   - Login with `admin` / `admin123`
   - Click your username → "Change password"
   - Set a strong password

2. **Test All Features**:
   - ✅ Student entry/exit (try ID: 001, 002, 003)
   - ✅ E-Library PC booking
   - ✅ Admin reports generation
   - ✅ Mobile responsiveness

3. **Share with Team**:
   - Send the Render URL to your team members
   - Provide admin access to authorized staff
   - Document any custom configurations

### Monitor Your Application:

1. **Check Logs**: Render Dashboard → "Logs" tab
2. **Monitor Performance**: Check response times and errors
3. **Database Health**: Verify Neon database connection is stable

## 📱 Team Access Instructions

### For Students:
1. Visit: `https://your-app.onrender.com`
2. Enter student ID (001-041) to track library entry/exit
3. Use E-Library section for PC booking

### For Library Staff:
1. **Admin Access**: `https://your-app.onrender.com/admin/`
2. **Generate Reports**: Use admin dashboard for analytics
3. **Monitor Activity**: Real-time tracking of student activities

### For Developers:
1. **API Documentation**: Available at `/api/`
2. **Make Updates**: Push to GitHub for auto-deployment
3. **Debug Issues**: Check Render logs for troubleshooting

Your IUBAT Smart Library is ready for production! 🎉
