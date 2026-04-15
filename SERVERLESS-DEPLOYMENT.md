# Serverless Deployment - No Terminal, No SSH, No PEM Files

## Overview

Deploy your Hospital Management System using **AWS Lambda + API Gateway** - completely serverless, no terminal needed.

---

## Architecture

```
Your Browser
    ↓
CloudFront (CDN)
    ↓
API Gateway
    ↓
Lambda Functions
    ↓
RDS Database
```

---

## Step 1: Create Lambda Function (AWS Console - 5 minutes)

### 1.1 Go to Lambda Console
1. AWS Console → Search for **"Lambda"**
2. Click **"Functions"**
3. Click **"Create function"**

### 1.2 Configure Function
1. **Function name**: `hospital-app`
2. **Runtime**: Node.js 20.x
3. **Architecture**: x86_64
4. **Execution role**: Create new role with basic Lambda permissions
5. Click **"Create function"**

### 1.3 Upload Code
1. Click **"Upload from"** → **"Amazon S3"**
2. Or use inline code editor

---

## Step 2: Create API Gateway (AWS Console - 5 minutes)

### 2.1 Go to API Gateway Console
1. AWS Console → Search for **"API Gateway"**
2. Click **"Create API"**
3. Select **"REST API"**
4. Click **"Build"**

### 2.2 Configure API
1. **API name**: `hospital-app-api`
2. **Endpoint type**: Regional
3. Click **"Create API"**

### 2.3 Create Resource
1. Click **"Create Resource"**
2. **Resource name**: `app`
3. Click **"Create Resource"**

### 2.4 Create Method
1. Click **"Create Method"**
2. Select **"ANY"**
3. **Integration type**: Lambda Function
4. **Lambda Function**: `hospital-app`
5. Click **"Create"**

### 2.5 Deploy API
1. Click **"Deploy API"**
2. **Stage**: `prod`
3. Click **"Deploy"**
4. Copy **Invoke URL**

---

## Step 3: Connect to RDS (AWS Console - 3 minutes)

### 3.1 Update Lambda Environment Variables
1. Lambda → `hospital-app` function
2. Click **"Configuration"** → **"Environment variables"**
3. Add:
   ```
   DATABASE_URL=postgresql://postgres:HospitalDB2026Pass@hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432/hospital_db
   NODE_ENV=production
   ```
4. Click **"Save"**

### 3.2 Update Lambda VPC
1. Lambda → `hospital-app` function
2. Click **"Configuration"** → **"VPC"**
3. Select your VPC
4. Select subnets
5. Select security group (allow RDS access)
6. Click **"Save"**

---

## Step 4: Add CloudFront (AWS Console - 10 minutes)

### 4.1 Create CloudFront Distribution
1. AWS Console → CloudFront → **"Create distribution"**
2. **Origin Domain**: Your API Gateway URL
3. **Protocol**: HTTPS
4. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
5. **Cache Policy**: Managed-CachingDisabled
6. Click **"Create distribution"**
7. Wait 5-10 minutes

### 4.2 Get CloudFront URL
1. CloudFront → Distributions
2. Copy **Domain Name** (e.g., `d123abc456.cloudfront.net`)

---

## Step 5: Access Your App

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
✅ **No SSH Keys** - No PEM files needed
✅ **No Server Management** - Fully serverless
✅ **Auto-Scaling** - Handles traffic automatically
✅ **Pay-Per-Use** - Only pay for what you use
✅ **HTTPS/SSL** - Built-in security
✅ **Global CDN** - CloudFront included

---

## Cost (Free Tier)

- **Lambda**: 1 million requests/month (free)
- **API Gateway**: 1 million requests/month (free)
- **CloudFront**: 1TB data transfer/month (free)
- **RDS**: 750 hours/month (free)
- **Total**: **$0/month** ✅

---

## Troubleshooting

### Lambda function returns 502 error
```
→ Check environment variables
→ Check VPC configuration
→ Check RDS security group
→ View CloudWatch logs
```

### API Gateway returns 403 error
```
→ Check Lambda execution role
→ Check API Gateway permissions
→ Check CORS settings
```

### CloudFront shows error
```
→ Wait 5-10 minutes for deployment
→ Check origin is correct
→ Check API Gateway is working
```

---

## Alternative: Use Vercel (Even Easier)

If you want the absolute easiest approach:

1. Go to **vercel.com**
2. Sign up with GitHub
3. Import your repository
4. Click **"Deploy"**
5. Done! Your app is live

**Vercel URL**: `hospital-app.vercel.app`

---

## Total Time: ~20 minutes

- Lambda setup: 5 min
- API Gateway: 5 min
- RDS connection: 3 min
- CloudFront: 10 min

---

## Your Final URLs

| URL | Purpose |
|-----|---------|
| `https://d123abc456.cloudfront.net` | CloudFront (HTTPS) |
| `https://hospital-app.vercel.app` | Vercel (if using) |

---

**Ready? Start with Step 1 in AWS Console!** 🚀
