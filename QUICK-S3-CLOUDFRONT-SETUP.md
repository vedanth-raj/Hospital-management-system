# Quick S3 + CloudFront Setup (10 Minutes)

## Step 1: Create S3 Bucket (AWS Console - 2 minutes)

1. **AWS Console** → **S3** → **Create bucket**
2. **Bucket name**: `hospital-app-static-12345` (must be unique)
3. **Region**: us-east-1
4. **Uncheck**: "Block all public access"
5. Click **Create bucket**

---

## Step 2: Enable Static Website Hosting (1 minute)

1. Click your bucket
2. **Properties** tab
3. Scroll to **Static website hosting**
4. Click **Edit**
5. Select **Enable**
6. **Index document**: `index.html`
7. **Error document**: `404.html`
8. Click **Save changes**

---

## Step 3: Upload Your App Files (2 minutes)

### Option A: Upload Pre-built Files
1. Click **Upload**
2. Upload your `.next/static` folder contents
3. Click **Upload**

### Option B: Upload HTML Files
1. Create simple `index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hospital Management System</title>
</head>
<body>
    <h1>Hospital Management System</h1>
    <p>Deployment in progress...</p>
</body>
</html>
```
2. Upload to S3

---

## Step 4: Create CloudFront Distribution (5 minutes)

1. **AWS Console** → **CloudFront** → **Create distribution**

### Configure Origin:
- **Origin Domain**: Your S3 bucket
- **S3 access**: Use OAI (Origin Access Identity)
- Click **Create OAI**

### Configure Viewer:
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Allowed HTTP Methods**: GET, HEAD
- **Cache Policy**: Managed-CachingOptimized

### Create:
- Click **Create distribution**
- Wait 5-10 minutes

---

## Step 5: Get Your URL

1. **CloudFront** → **Distributions**
2. Wait for status: **Enabled**
3. Copy **Domain Name** (e.g., `d123abc456.cloudfront.net`)

---

## Your App is Live!

```
https://d123abc456.cloudfront.net
```

---

## Cost

- **S3**: ~$0.023/GB (5GB free)
- **CloudFront**: ~$0.085/GB (1TB free)
- **Total**: **$0/month** ✅

---

## Next: Add Your Full App

Once CloudFront is working:
1. Build your Next.js app locally
2. Upload `.next/static` to S3
3. CloudFront automatically serves it

---

**Start with Step 1 in AWS Console!** 🚀
