# AWS Amplify - Fixed Deployment (Recommended)

## Overview

Deploy directly from GitHub to AWS Amplify with proper Next.js configuration.

---

## Why Amplify?

✅ **Git Integration** - Auto-deploy on push
✅ **No Terminal** - Everything in AWS Console
✅ **No SSH Keys** - No PEM files
✅ **HTTPS/SSL** - Built-in
✅ **Global CDN** - CloudFront included
✅ **Free Tier** - $0/month
✅ **Easy Rollback** - One-click revert

---

## Step 1: Fix Configuration Files (Already Done ✅)

Your repo already has:
- ✅ `amplify.yml` - Build configuration
- ✅ `next.config.mjs` - Next.js config
- ✅ `postcss.config.mjs` - Tailwind config
- ✅ `package.json` - Dependencies

---

## Step 2: Connect GitHub to Amplify (AWS Console - 3 minutes)

### 2.1 Go to Amplify Console
1. AWS Console → Search for **"Amplify"**
2. Click **"Amplify Hosting"**
3. Click **"Create new app"**

### 2.2 Connect Repository
1. Select **"GitHub"**
2. Click **"Connect branch"**
3. Authorize Amplify to access GitHub
4. Select repository: **`Hospital-management-system`**
5. Select branch: **`main`**
6. Click **"Next"**

---

## Step 3: Configure Build Settings (AWS Console - 2 minutes)

### 3.1 Build Configuration
1. **App name**: `hospital-app`
2. **Environment**: `prod`
3. **Build command**: `npm run build`
4. **Start command**: `npm start`

### 3.2 Environment Variables
1. Click **"Add environment variable"**
2. Add:
   ```
   DATABASE_URL=postgresql://postgres:HospitalDB2026Pass@hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432/hospital_db
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbHhl7nwjRjIZE0qiAX8FC577UqYfQby8
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smart-hospital-managemen-d2fb0.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=smart-hospital-managemen-d2fb0
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smart-hospital-managemen-d2fb0.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=718372719687
   NEXT_PUBLIC_FIREBASE_APP_ID=1:718372719687:web:d0ae99aa3d9a0033e23562
   ```

### 3.3 Deploy
1. Click **"Save and deploy"**
2. Wait 5-10 minutes for build

---

## Step 4: Monitor Deployment (AWS Console - 5 minutes)

### 4.1 View Build Logs
1. Amplify → Deployments
2. Click on your deployment
3. View build progress
4. Wait for "Deployment successful"

### 4.2 Get Your URL
1. Amplify → App settings
2. Copy **Domain name** (e.g., `d123abc456.amplifyapp.com`)

---

## Step 5: Initialize Database (Browser - 1 minute)

1. Open browser
2. Go to: `https://d123abc456.amplifyapp.com/api/init`
3. Should see: `{"success":true}`

---

## Step 6: Access Your App

```
https://d123abc456.amplifyapp.com
```

**Demo Credentials:**
- Admin: `admin@hospital.com` / `admin123`
- Doctor: `doctor@hospital.com` / `doctor123`
- Reception: `reception@hospital.com` / `reception123`
- Patient: `patient@hospital.com` / `patient123`

---

## Auto-Deploy on Git Push

Every time you push to GitHub:
1. Amplify detects the change
2. Automatically builds your app
3. Deploys to production
4. Your app updates instantly

---

## Add Custom Domain (Optional)

1. Amplify → App settings → Domain management
2. Click **"Add domain"**
3. Enter your domain
4. Update DNS records
5. Done! Your app is on your custom domain

---

## Advantages

✅ **Easiest** - Just connect GitHub
✅ **No Terminal** - Everything in AWS Console
✅ **No SSH Keys** - No PEM files
✅ **Auto-Deploy** - Push to GitHub, app updates
✅ **HTTPS/SSL** - Built-in
✅ **Global CDN** - CloudFront included
✅ **Free Tier** - $0/month
✅ **Rollback** - One-click revert to previous version

---

## Cost (Free Tier)

- **Amplify Hosting**: 15GB build/month (free)
- **Amplify Data**: 1GB storage (free)
- **CloudFront**: 1TB data transfer/month (free)
- **RDS**: 750 hours/month (free)
- **Total**: **$0/month** ✅

---

## Troubleshooting

### Build fails
```
→ Check build logs in Amplify console
→ Verify environment variables
→ Check package.json dependencies
→ Verify amplify.yml configuration
```

### App shows 502 error
```
→ Wait 2-3 minutes for deployment
→ Check database connection
→ View CloudWatch logs
→ Check environment variables
```

### Database connection fails
```
→ Verify DATABASE_URL is correct
→ Check RDS security group
→ Test connection manually
```

---

## Total Time: ~15 minutes

- Connect GitHub: 3 min
- Configure: 2 min
- Deploy: 5 min
- Database init: 1 min
- Test: 4 min

---

## Your Final URL

```
https://d123abc456.amplifyapp.com
```

Or with custom domain:
```
https://your-domain.com
```

With:
- ✅ HTTPS/SSL
- ✅ Global CDN
- ✅ Auto-deploy
- ✅ $0/month
- ✅ No terminal needed

---

## Comparison

| Feature | Amplify | S3+CloudFront | Lambda+API |
|---------|---------|---------------|-----------|
| **Setup** | 3 min | 5 min | 20 min |
| **Auto-Deploy** | ✅ | ❌ | ❌ |
| **Database** | ✅ | ❌ | ✅ |
| **Terminal** | No | No | No |
| **Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

---

## Next Steps

1. Go to **AWS Console → Amplify**
2. Click **"Create new app"**
3. Connect your GitHub repository
4. Add environment variables
5. Click **"Save and deploy"**
6. Your app is live! 🎉

---

**Ready? Go to AWS Amplify now!** 🚀
