# E-Commerce Full Stack - Deployment Guide

## ✅ Project Status

- **Backend:** Deployed on Render ✅
  - URL: `https://e-shop-ihhs.onrender.com`
  - Live and Connected to MongoDB Atlas
  
- **Frontend:** Ready for Vercel Deployment
  - Environment Variables Configured
  - API Base URL Set

---

## 🚀 Frontend Deployment on Vercel

### Step-by-Step Instructions

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy the Application
```bash
cd c:\Users\obaid jan\OneDrive\Desktop\my-all-project\E-commerce-app
vercel
```

#### 4. Follow Prompts
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Root Directory:** `./`

#### 5. First Deployment Confirmation
The system will ask to confirm deployment first time:
```
? Set up and deploy "c:\Users\obaid...\E-commerce-app"? [Y/n] y
? Which scope do you want to deploy to? (Select your account)
? Link to existing project? [y/N] n
? What's your project's name? e-commerce-app
? Detected root directory? [Y/n] y
? Want to override the settings? [y/N] n
```

---

## 🔧 Environment Variables Configuration

### For Vercel Dashboard:

1. Go to: **Vercel Dashboard** → **Settings** → **Environment Variables**

2. Add the following variable:
```
Name: VITE_API_BASE_URL
Value: https://e-shop-ihhs.onrender.com/api
Environments: Production, Preview, Development
```

3. Click **Save**

4. **Redeploy** the project:
   ```bash
   vercel --prod
   ```

---

## 📋 Configuration Summary

### Backend (.env) - Already Configured ✅
```
PORT=5000
MONGODB_URI=mongodb+srv://samad5760279_db_user:kknxeak3WdbfYvGz@e-commerce.1bjt0fw.mongodb.net/ecommerce?appName=e-commerce
JWT_SECRET=your_super_secret_jwt_key_12345_change_this_in_production
NODE_ENV=production
ADMIN_EMAIL=samad123570@gmail.com
ADMIN_PASSWORD=samad123570
```

### Frontend (.env) - Updated ✅
```
VITE_API_BASE_URL=https://e-shop-ihhs.onrender.com/api
```

### Frontend (.env.example) - Reference ✅
```
VITE_API_BASE_URL=https://e-shop-ihhs.onrender.com/api
```

### Backend (.env.example) - Updated ✅
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
```

---

## ✅ URLs After Deployment

| Service | URL | Status |
|---------|-----|--------|
| Backend API | https://e-shop-ihhs.onrender.com | ✅ Live |
| Backend API Root | https://e-shop-ihhs.onrender.com/api | ✅ Live |
| Frontend | https://your-vercel-domain.vercel.app | 🚀 Deploy Now |
| Admin Login | https://your-vercel-domain.vercel.app/login | After Deploy |

---

## 🧪 Testing After Vercel Deployment

### 1. Test API Connection
```bash
curl https://e-shop-ihhs.onrender.com/api/products
```

Should return products list.

### 2. Test Frontend
1. Open: `https://your-vercel-domain.vercel.app`
2. You should see the e-commerce homepage
3. Click "Login"
4. Enter:
   - Email: `samad123570@gmail.com`
   - Password: `samad123570`
5. Click "Admin" after login
6. Should see all orders dashboard

---

## 🔐 Admin Credentials

```
Email: samad123570@gmail.com
Password: samad123570
```

These are set in backend `.env` and seeded to MongoDB.

---

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **403 Forbidden on Admin** | Make sure you're logged in with admin credentials |
| **API Not Found** | Check VITE_API_BASE_URL is correct in Vercel |
| **CORS Error** | Backend already has CORS enabled |
| **50s Delay on Render** | Upgrade from free tier to reduce cold starts |
| **Products Not Loading** | Check MongoDB Atlas connection is active |
| **Env Variables Not Loading** | Redeploy with `vercel --prod` after adding variables |

---

## 📱 Vercel CLI Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# View config
vercel env list

# Add environment variable
vercel env add VITE_API_BASE_URL
```

---

## 🎯 Deployment Checklist

- [x] Backend deployed on Render
- [x] MongoDB Atlas connected
- [x] Backend .env configured
- [x] Frontend .env updated with Render URL
- [x] Frontend .env.example created
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run `vercel login`
- [ ] Run `vercel` in project folder
- [ ] Add VITE_API_BASE_URL in Vercel dashboard
- [ ] Run `vercel --prod` to deploy to production
- [ ] Test admin login: samad123570@gmail.com
- [ ] Verify products load from API
- [ ] Test order creation flow

---

## 🚀 Quick Deploy Command

After Vercel CLI is installed and logged in:

```bash
cd "c:\Users\obaid jan\OneDrive\Desktop\my-all-project\E-commerce-app"
vercel --prod
```

---

**Everything is configured and ready for deployment!** 🎉