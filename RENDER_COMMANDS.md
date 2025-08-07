# 🎯 Render Deployment - Command Reference

## 📋 Quick Commands

### Pre-Deployment
```bash
# Push code to GitHub
cd IUBAT_SmartLibrary
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Render Configuration
```bash
# Build Command (copy to Render)
chmod +x build.sh && ./build.sh

# Start Command (copy to Render)
cd backend && gunicorn library_automation.wsgi:application --bind 0.0.0.0:$PORT
```

### Environment Variables (Set in Render Dashboard)
```
SECRET_KEY=django-insecure-your-secret-key-here-change-this-in-production
DATABASE_URL=postgresql://neondb_owner:npg_BD48fmwROHWL@ep-bold-moon-ad14lfg1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DEBUG=False
PYTHONPATH=/opt/render/project/src/backend
```

## 🧪 Testing Commands

### Test API Endpoints
```bash
# Replace YOUR_APP_URL with your actual Render URL

# Test student entry
curl -X POST https://YOUR_APP_URL/api/entry/library/ \
  -H "Content-Type: application/json" \
  -d '{"student_id": "001"}'

# Test PC status
curl https://YOUR_APP_URL/api/elibrary/pc_status/

# Test API root
curl https://YOUR_APP_URL/api/
```

### Browser Testing
```
Main App: https://YOUR_APP_URL/
Admin: https://YOUR_APP_URL/admin/
API: https://YOUR_APP_URL/api/
```

## 🔧 Troubleshooting Commands

### Check Build Locally
```bash
# Test build script locally
cd IUBAT_SmartLibrary
chmod +x build.sh
./build.sh

# Test Django manually
cd backend
python manage.py check
python manage.py migrate --check
```

### Database Commands
```bash
# Test database connection
cd backend
python manage.py dbshell

# Check migrations
python manage.py showmigrations

# Create superuser
python manage.py createsuperuser
```

## 🔄 Update Commands

### Update Application
```bash
# Make changes, then:
git add .
git commit -m "Update description"
git push origin main
# Render auto-deploys if enabled
```

### Manual Deploy via Git
```bash
# Force redeploy
git commit --allow-empty -m "Force redeploy"
git push origin main
```

## 📊 Monitoring Commands

### Check Application Health
```bash
# Health check
curl https://YOUR_APP_URL/api/

# Admin login test
curl -X POST https://YOUR_APP_URL/api/admin/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Performance Testing
```bash
# Response time test
time curl https://YOUR_APP_URL/

# Load test (install apache2-utils first)
ab -n 100 -c 10 https://YOUR_APP_URL/
```

## 🎯 Quick Checklist

### Pre-Deployment ✅
- [ ] Code pushed to GitHub
- [ ] Environment variables ready
- [ ] Database connection string verified

### During Deployment ✅
- [ ] Build command set correctly
- [ ] Start command configured
- [ ] Environment variables added
- [ ] Free/Paid tier selected

### Post-Deployment ✅
- [ ] Application loads successfully
- [ ] Admin panel accessible
- [ ] API endpoints responding
- [ ] Database connection working
- [ ] Admin password changed

## 🚀 Ready to Deploy!

1. **Render Setup**: 5 minutes
2. **Build Process**: 5-10 minutes  
3. **Testing**: 2 minutes
4. **Total Time**: ~15 minutes

Your IUBAT Smart Library will be live! 🎉
