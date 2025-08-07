# 🚀 Deploy IUBAT Smart Library to Render - Simple Steps

## Quick Setup (5 Minutes)

### 1. **Push Your Code to GitHub** 
```bash
cd IUBAT_SmartLibrary
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. **Go to Render.com**
- Visit [render.com](https://render.com)
- Click **"Get Started for Free"**
- Sign up with your **GitHub account**

### 3. **Create Web Service**
- Click **"New +"** → **"Web Service"**
- Connect your repository: `hijbullahx/IUBAT_SmartLibrary`
- Click **"Connect"**

### 4. **Configure Settings**

**Basic Info:**
- **Name**: `iubat-smart-library`
- **Root Directory**: (leave blank)
- **Environment**: `Python 3`
- **Region**: `Oregon (US West)` or closest to you

**Build & Deploy:**
- **Build Command**: 
  ```
  chmod +x build.sh && ./build.sh
  ```
- **Start Command**: 
  ```
  cd backend && gunicorn library_automation.wsgi:application --bind 0.0.0.0:$PORT
  ```

### 5. **Add Environment Variables**
Click **"Advanced"** and add:

| Variable | Value |
|----------|-------|
| `SECRET_KEY` | `django-insecure-your-secret-key-change-this` |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_BD48fmwROHWL@ep-bold-moon-ad14lfg1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `DEBUG` | `False` |

### 6. **Deploy**
- Click **"Create Web Service"**
- Wait 5-10 minutes for build
- Get your URL: `https://iubat-smart-library.onrender.com`

---

## ✅ After Deployment

### Test Your App:
1. **Main Page**: Visit your Render URL
2. **Admin Panel**: Add `/admin/` to your URL
   - Username: `admin`
   - Password: `admin123`
3. **API**: Add `/api/` to test endpoints

### Change Admin Password:
1. Go to `https://your-app.onrender.com/admin/`
2. Login with `admin`/`admin123`
3. Click your username → **Change password**

---

## 🔧 Troubleshooting

### Build Failed?
- Check **"Logs"** tab in Render dashboard
- Common fix: Verify environment variables are correct

### App Not Loading?
- Check if Neon database is active
- Verify `DATABASE_URL` is exactly correct

### Free Tier Sleeps?
- App sleeps after 15 minutes of inactivity
- First request wakes it up (may take 30 seconds)

---

## 🎉 You're Done!

Your IUBAT Smart Library is now live at:
**`https://your-app.onrender.com`**

Share this URL with your team - they can access:
- ✅ Student entry/exit system
- ✅ E-Library PC management  
- ✅ Admin dashboard
- ✅ All features working!

**Auto-Deploy**: Any push to GitHub main branch will auto-update your app!
