# IUBAT Smart Library - Render Deployment Guide

## Prerequisites
1. GitHub account with your code pushed
2. Render account (free tier available)
3. Neon PostgreSQL database (you already have this)

## Step 1: Deploy Backend (Django API)

### 1.1 Create Backend Service on Render
1. Go to https://render.com and sign in
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository: `IUBAT_SmartLibrary`
4. Configure the service:
   - **Name**: `iubat-smartlibrary-backend`
   - **Environment**: `Python 3`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your current branch)
   - **Root Directory**: `backend`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn library_automation.wsgi:application --bind 0.0.0.0:$PORT`

### 1.2 Set Environment Variables
In Render dashboard, go to your backend service → Environment tab:

```
DATABASE_URL=postgresql://neondb_owner:npg_q21haZeluxOU@ep-purple-waterfall-added26e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

SECRET_KEY=y02klAsspCFaZfgj_q-omBjcU4fKt&N^KBqaU=Nvlv@8PJ6Ke!

DEBUG=False

PYTHON_VERSION=3.9.20
```

### 1.3 Make build.sh executable
Before deploying, make sure build.sh is executable:
```bash
chmod +x backend/build.sh
```

## Step 2: Deploy Frontend (React)

### 2.1 Create Frontend Service on Render
1. Click "New +" and select "Static Site"
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `iubat-smartlibrary-frontend`
   - **Branch**: `main` (or your current branch)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `build`

### 2.2 Set Frontend Environment Variables
```
REACT_APP_API_URL=https://iubat-smartlibrary-backend.onrender.com
```
(Replace with your actual backend URL from step 1)

## Step 3: Update Configuration

### 3.1 Update Backend CORS Settings
After getting your actual Render URLs, update these in `backend/library_automation/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    # ... existing localhost entries ...
    "https://your-actual-frontend-url.onrender.com",
]

CSRF_TRUSTED_ORIGINS = [
    # ... existing entries ...
    "https://your-actual-backend-url.onrender.com",
    "https://your-actual-frontend-url.onrender.com",
]

ALLOWED_HOSTS = [
    # ... existing entries ...
    'your-actual-backend-url.onrender.com',
]
```

### 3.2 Update Frontend API URL
Update `frontend/src/config/axios.js`:
```javascript
return process.env.REACT_APP_API_URL || 'https://your-actual-backend-url.onrender.com';
```

## Step 4: Database Setup

### 4.1 Run Migrations
Once your backend is deployed:
1. Go to Render dashboard → Your backend service
2. Go to "Shell" tab
3. Run:
```bash
python manage.py migrate
python manage.py createsuperuser
```

### 4.2 Load Initial Data (Optional)
```bash
python manage.py shell
```
Then run your data setup scripts if needed.

## Step 5: Testing

1. Access your backend at: `https://your-backend-url.onrender.com/api/status/`
2. Access your frontend at: `https://your-frontend-url.onrender.com`
3. Test admin login with the superuser you created

## Important Notes

### Free Tier Limitations
- Backend services go to sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month free (enough for small projects)

### Production Security
- Use strong SECRET_KEY
- Set DEBUG=False
- Use HTTPS (Render provides this automatically)
- Review CORS and CSRF settings

### Monitoring
- Check Render logs for any deployment issues
- Monitor database usage in Neon dashboard
- Set up proper error logging

## Troubleshooting

### Common Issues:
1. **Build fails**: Check logs in Render dashboard
2. **Database connection**: Verify DATABASE_URL format
3. **CORS errors**: Update CORS_ALLOWED_ORIGINS
4. **Static files**: Ensure collectstatic runs in build script

### Useful Commands:
```bash
# Check logs
render logs follow --service=your-service-name

# Run shell commands
render shell --service=your-service-name
```

## Next Steps After Deployment

1. Test all functionality
2. Set up monitoring/alerts
3. Configure custom domain (if needed)
4. Set up backup strategy for database
5. Consider upgrading to paid plan for production use
