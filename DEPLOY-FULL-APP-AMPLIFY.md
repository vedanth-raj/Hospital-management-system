# Deploy Full Next.js App with Amplify (10 Minutes)

## Overview

Deploy your complete Hospital Management System with:
- ✅ Full Next.js application
- ✅ Backend API (serverless)
- ✅ RDS PostgreSQL database
- ✅ Authentication system
- ✅ All features (Patient, Doctor, Billing, etc.)
- ✅ HTTPS/SSL
- ✅ Global CDN

---

## Step 1: Go to AWS Amplify Console (1 minute)

1. AWS Console → Search for **"Amplify"**
2. Click **"Amplify Hosting"**
3. Click **"Create new app"**

---

## Step 2: Connect GitHub Repository (2 minutes)

1. Select **"GitHub"**
2. Click **"Connect branch"**
3. Authorize Amplify to access GitHub
4. Select repository: **`Hospital-management-system`**
5. Select branch: **`main`**
6. Click **"Next"**

---

## Step 3: Configure Build Settings (3 minutes)

### 3.1 Build Configuration
- **App name**: `hospital-app`
- **Environment**: `prod`
- **Build command**: `npm run build`
- **Start command**: `npm start`

### 3.2 Add Environment Variables
Click **"Add environment variable"** and add:

```
DATABASE_URL=postgresql://postgres:HospitalDB2026Pass@hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432/hospital_db
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbHhl7nwjRjIZE0qiAX8FC577UqYfQby8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smart-hospital-managemen-d2fb0.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smart-hospital-managemen-d2fb0
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smart-hospital-managemen-d2fb0.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=718372719687
NEXT_PUBLIC_FIREBASE_APP_ID=1:718372719687:web:d0ae99aa3d9a0033e23562
```

---

## Step 4: Deploy (4 minutes)

1. Click **"Save and deploy"**
2. Wait for build to complete (3-5 minutes)
3. View build logs in real-time
4. Once complete, you'll get your URL

---

## Step 5: Initialize Database (1 minute)

Once deployment is complete:

1. Go to your Amplify URL
2. Visit: `https://your-url/api/init`
3. Should see: `{"success":true}`

---

## Step 6: Login and Test (1 minute)

Use demo credentials:

```
Admin: admin@hospital.com / admin123
Doctor: doctor@hospital.com / doctor123
Reception: reception@hospital.com / reception123
Patient: patient@hospital.com / patient123
```

---

## Your Final URL

After deployment, you'll get a URL like:
```
https://hospital-app-xxxxx.amplifyapp.com
```

---

## What's Included

✅ **Full Next.js App** - All pages and components
✅ **Backend API** - All endpoints
✅ **Database** - Connected to RDS
✅ **Authentication** - Login system
✅ **Features**:
  - Patient Management
  - Doctor Scheduling
  - Appointments
  - Medical Records
  - Billing
  - Emergency Response
  - Notifications
  - Analytics

---

## Auto-Deploy on Git Push

Every time you push to GitHub:
1. Amplify detects the change
2. Automatically builds
3. Deploys to production
4. Your app updates instantly

---

## Cost

- **Amplify**: Free tier (15GB build/month)
- **RDS**: Free tier (750 hours/month)
- **Total**: **$0/month**

---

## Troubleshooting

### Build fails
- Check build logs in Amplify console
- Verify environment variables
- Check package.json

### Database connection error
- Verify DATABASE_URL is correct
- Check RDS security group
- Ensure RDS is running

### App shows 502 error
- Wait 2-3 minutes for deployment
- Check CloudWatch logs
- Verify environment variables

---

## Total Time: ~10 minutes

- Connect GitHub: 2 min
- Configure: 3 min
- Deploy: 4 min
- Initialize DB: 1 min

---

## Next Steps

1. Go to AWS Amplify
2. Click "Create new app"
3. Connect GitHub
4. Add environment variables
5. Click "Save and deploy"
6. Your full app is live! 🎉

---

**Ready? Go to AWS Amplify now!** 🚀
