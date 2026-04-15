# Simple S3 + CloudFront Deployment (Easiest AWS Approach)

## Overview

Deploy your Next.js app as static files on S3 with CloudFront CDN.

---

## Prerequisites

1. Build your Next.js app locally
2. Export as static HTML
3. Upload to S3
4. Setup CloudFront

---

## Step 1: Build Your App Locally (5 minutes)

### 1.1 On Your Computer
```bash
cd Hospital-Management-System-main
npm install
npm run build
```

This creates a `.next` folder with your built app.

---

## Step 2: Create S3 Bucket (AWS Console - 3 minutes)

### 2.1 Go to S3
1. AWS Console → S3 → **"Create bucket"**
2. **Bucket name**: `hospital-app-static-12345` (unique)
3. **Region**: us-east-1
4. Click **"Create bucket"**

### 2.2 Enable Static Website Hosting
1. Click your bucket
2. **Properties** → **"Static website hosting"** → **"Edit"**
3. Select **"Enable"**
4. **Index document**: `index.html`
5. **Error document**: `404.html`
6. Click **"Save changes"**

### 2.3 Upload Files
1. Click **"Upload"**
2. Drag and drop your `.next/static` folder
3. Click **"Upload"**

---

## Step 3: Create CloudFront Distribution (AWS Console - 10 minutes)

### 3.1 Go to CloudFront
1. AWS Console → CloudFront → **"Create distribution"**

### 3.2 Configure Origin
1. **Origin Domain**: Your S3 bucket
2. **S3 access**: Use OAI (Origin Access Identity)
3. Click **"Create OAI"**

### 3.3 Configure Viewer
1. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
2. **Allowed HTTP Methods**: GET, HEAD
3. **Cache Policy**: Managed-CachingOptimized

### 3.4 Create Distribution
1. Click **"Create distribution"**
2. Wait 5-10 minutes

### 3.5 Get Your URL
1. CloudFront → Distributions
2. Copy **Domain Name** (e.g., `d123abc456.cloudfront.net`)

---

## Step 4: Access Your App

```
https://d123abc456.cloudfront.net
```

---

## Advantages

✅ **Simple** - Just upload files
✅ **Fast** - Global CDN
✅ **Cheap** - Pay-per-use
✅ **Secure** - HTTPS included
✅ **No Server** - Fully managed

---

## Cost

- **S3**: ~$0.023 per GB (first 5GB free)
- **CloudFront**: ~$0.085 per GB (1TB free)
- **Total**: **~$0/month** (within free tier)

---

## Limitations

❌ **Static Only** - No server-side rendering
❌ **No API** - Can't call database directly
❌ **No Dynamic Content** - Can't update without rebuild

---

## Better Approach: S3 + Lambda + API Gateway

For a full-featured app with database, use:
- **S3** - Static files
- **Lambda** - API endpoints
- **API Gateway** - Route requests
- **CloudFront** - CDN

See: `AWS-S3-DEPLOYMENT.md`

---

## Total Time: ~20 minutes

- Build: 5 min
- S3 setup: 3 min
- CloudFront: 10 min
- Deploy: 2 min

---

## Your Final URL

```
https://d123abc456.cloudfront.net
```

---

**Ready? Start with Step 1!** 🚀
