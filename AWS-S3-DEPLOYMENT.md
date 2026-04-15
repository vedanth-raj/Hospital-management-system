# AWS S3 + CloudFront + Lambda Deployment (No Terminal)

## Overview

Deploy your Hospital Management System using:
- **S3** - Store static files
- **CloudFront** - CDN + HTTPS
- **Lambda** - Run Next.js app
- **API Gateway** - Route requests
- **RDS** - Database

All from AWS Console, no terminal needed.

---

## Architecture

```
Your Browser
    ↓
CloudFront (HTTPS)
    ↓
S3 (Static Files) + Lambda (API)
    ↓
RDS Database
```

---

## Step 1: Create S3 Bucket (AWS Console - 3 minutes)

### 1.1 Go to S3 Console
1. AWS Console → Search for **"S3"**
2. Click **"Buckets"**
3. Click **"Create bucket"**

### 1.2 Configure Bucket
1. **Bucket name**: `hospital-app-bucket-12345` (must be unique)
2. **Region**: us-east-1
3. **Block Public Access**: Uncheck all
4. Click **"Create bucket"**

### 1.3 Enable Static Website Hosting
1. Click on your bucket
2. Click **"Properties"**
3. Scroll to **"Static website hosting"**
4. Click **"Edit"**
5. Select **"Enable"**
6. **Index document**: `index.html`
7. **Error document**: `404.html`
8. Click **"Save changes"**

### 1.4 Upload Your App Files
1. Click **"Upload"**
2. Upload your built Next.js files from `.next/` folder
3. Click **"Upload"**

---

## Step 2: Create Lambda Function (AWS Console - 5 minutes)

### 2.1 Go to Lambda Console
1. AWS Console → Search for **"Lambda"**
2. Click **"Functions"**
3. Click **"Create function"**

### 2.2 Configure Function
1. **Function name**: `hospital-app-api`
2. **Runtime**: Node.js 20.x
3. **Architecture**: x86_64
4. **Execution role**: Create new role with basic Lambda permissions
5. Click **"Create function"**

### 2.3 Add Code
1. Click **"Code"** tab
2. Paste your Next.js server code
3. Click **"Deploy"**

### 2.4 Add Environment Variables
1. Click **"Configuration"** → **"Environment variables"**
2. Click **"Edit"**
3. Add:
   ```
   DATABASE_URL=postgresql://postgres:HospitalDB2026Pass@hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432/hospital_db
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   ```
4. Click **"Save"**

### 2.5 Configure VPC
1. Click **"Configuration"** → **"VPC"**
2. Click **"Edit"**
3. Select your VPC
4. Select subnets
5. Select security group (allow RDS)
6. Click **"Save"**

---

## Step 3: Create API Gateway (AWS Console - 5 minutes)

### 3.1 Go to API Gateway Console
1. AWS Console → Search for **"API Gateway"**
2. Click **"Create API"**
3. Select **"REST API"**
4. Click **"Build"**

### 3.2 Configure API
1. **API name**: `hospital-app-api`
2. **Endpoint type**: Regional
3. Click **"Create API"**

### 3.3 Create Resource
1. Click **"Create Resource"**
2. **Resource name**: `api`
3. Click **"Create Resource"**

### 3.4 Create Method
1. Click **"Create Method"**
2. Select **"ANY"**
3. **Integration type**: Lambda Function
4. **Lambda Function**: `hospital-app-api`
5. Click **"Create"**

### 3.5 Deploy API
1. Click **"Deploy API"**
2. **Stage**: `prod`
3. Click **"Deploy"**
4. Copy **Invoke URL**

---

## Step 4: Create CloudFront Distribution (AWS Console - 10 minutes)

### 4.1 Go to CloudFront Console
1. AWS Console → Search for **"CloudFront"**
2. Click **"Distributions"**
3. Click **"Create distribution"**

### 4.2 Configure Origins
Create 2 origins:

**Origin 1 - S3 (Static Files):**
1. **Origin Domain**: Your S3 bucket
2. **S3 access**: Use OAI (Origin Access Identity)
3. Click **"Create OAI"**

**Origin 2 - API Gateway (Dynamic):**
1. **Origin Domain**: Your API Gateway URL
2. **Protocol**: HTTPS
3. **HTTP Port**: 443

### 4.3 Configure Behaviors
1. **Path Pattern**: `/api/*`
2. **Origin**: API Gateway
3. **Cache Policy**: Managed-CachingDisabled

### 4.4 Default Behavior
1. **Origin**: S3
2. **Cache Policy**: Managed-CachingOptimized
3. **Viewer Protocol Policy**: Redirect HTTP to HTTPS

### 4.5 Create Distribution
1. Click **"Create distribution"**
2. Wait 5-10 minutes for deployment

### 4.6 Get CloudFront URL
1. CloudFront → Distributions
2. Copy **Domain Name** (e.g., `d123abc456.cloudfront.net`)

---

## Step 5: Initialize Database (AWS Console - 1 minute)

1. Open browser
2. Go to: `https://d123abc456.cloudfront.net/api/init`
3. Should see: `{"success":true}`

---

## Step 6: Access Your App

```
https://d123abc456.cloudfront.net
```

**Demo Credentials:**
- Admin: `admin@hospital.com` / `admin123`
- Doctor: `doctor@hospital.com` / `doctor123`
- Reception: `reception@hospital.com` / `reception123`
- Patient: `patient@hospital.com` / `patient123`

---

## Advantages

✅ **No Terminal** - Everything in AWS Console
✅ **No SSH Keys** - No PEM files
✅ **No Server Management** - Fully serverless
✅ **Auto-Scaling** - Handles traffic
✅ **HTTPS/SSL** - Built-in
✅ **Global CDN** - CloudFront
✅ **Pay-Per-Use** - Only pay for what you use

---

## Cost (Free Tier)

- **S3**: 5GB storage (free)
- **Lambda**: 1 million requests/month (free)
- **API Gateway**: 1 million requests/month (free)
- **CloudFront**: 1TB data transfer/month (free)
- **RDS**: 750 hours/month (free)
- **Total**: **$0/month** ✅

---

## Troubleshooting

### CloudFront shows 403 error
```
→ Check S3 bucket permissions
→ Check OAI is configured
→ Check bucket policy allows CloudFront
```

### Lambda returns 502 error
```
→ Check environment variables
→ Check VPC configuration
→ Check RDS security group
→ View CloudWatch logs
```

### Database connection fails
```
→ Verify DATABASE_URL
→ Check RDS security group allows Lambda
→ Test connection manually
```

---

## Total Time: ~25 minutes

- S3 setup: 3 min
- Lambda: 5 min
- API Gateway: 5 min
- CloudFront: 10 min
- Database init: 1 min

---

## Your Final URL

```
https://d123abc456.cloudfront.net
```

With:
- ✅ HTTPS/SSL
- ✅ Global CDN
- ✅ Auto-scaling
- ✅ $0/month
- ✅ No terminal needed

---

## Next Steps

1. **Step 1**: Create S3 bucket
2. **Step 2**: Create Lambda function
3. **Step 3**: Create API Gateway
4. **Step 4**: Create CloudFront distribution
5. **Step 5**: Initialize database
6. **Step 6**: Access your app

**All from AWS Console!** 🚀
