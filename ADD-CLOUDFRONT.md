# Add CloudFront to Your Deployment

## Overview

CloudFront will give you a `.cloudfront.net` link with:
- ✅ Global CDN
- ✅ HTTPS/SSL
- ✅ Faster loading worldwide
- ✅ DDoS protection

---

## Prerequisites

✅ EC2 instance deployed and running
✅ App accessible at `http://54.242.171.2:3000`
✅ Database initialized

---

## Step 1: Create CloudFront Distribution (5 minutes)

### 1.1 Go to CloudFront Console
1. Open AWS Console
2. Search for **"CloudFront"**
3. Click **"Distributions"**
4. Click **"Create distribution"**

### 1.2 Configure Origin

**Origin Domain:**
- Enter: `54.242.171.2` (your EC2 instance)

**Protocol:**
- Select: **HTTP**

**HTTP Port:**
- Enter: **80**

**Origin Path:**
- Leave empty

### 1.3 Configure Viewer Settings

**Viewer Protocol Policy:**
- Select: **Redirect HTTP to HTTPS**

**Allowed HTTP Methods:**
- Select: **GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE**

### 1.4 Configure Cache Settings

**Cache Policy:**
- Select: **Managed-CachingDisabled** (for dynamic content)

**Origin Request Policy:**
- Select: **AllViewerExceptHostHeader**

### 1.5 Create Distribution

- Click **"Create distribution"**
- ⏳ Wait 5-10 minutes for deployment

---

## Step 2: Get Your CloudFront URL (1 minute)

### 2.1 Find Distribution Domain Name

1. Go to **CloudFront → Distributions**
2. Find your distribution (status should change from "Deploying" to "Enabled")
3. Copy the **Domain Name** (looks like: `d123abc456.cloudfront.net`)

---

## Step 3: Access Your App via CloudFront

Once deployment is complete:

```
https://d123abc456.cloudfront.net
```

Replace `d123abc456` with your actual domain name.

### Demo Credentials:
- **Email**: admin@hospital.com
- **Password**: admin123

---

## Step 4: Update Environment Variables (Optional)

If you want the app to know its public URL:

1. Go to **Systems Manager → Session Manager**
2. Start session on your EC2 instance
3. Edit `.env.production`:

```bash
sudo nano /home/ec2-user/hospital-app/.env.production
```

Update:
```
NEXT_PUBLIC_APP_URL=https://d123abc456.cloudfront.net
```

Save and restart:
```bash
pm2 restart hospital-app
```

---

## Troubleshooting

### CloudFront shows 502 error
**Solution:**
- Wait 5-10 minutes for full deployment
- Verify EC2 instance is running
- Check Nginx is running: `sudo systemctl status nginx`
- Check app is running: `pm2 status`

### CloudFront shows 403 error
**Solution:**
- Check EC2 security group allows port 80 from CloudFront
- Verify origin is correct: `54.242.171.2`

### Slow loading
**Solution:**
- CloudFront caches content
- Clear cache: CloudFront → Distributions → Invalidations → Create invalidation
- Enter: `/*` to clear all

### HTTPS certificate error
**Solution:**
- CloudFront uses its own SSL certificate
- This is normal and secure
- Your data is encrypted end-to-end

---

## Performance Tips

### 1. Enable Compression
- CloudFront → Distribution → Behaviors
- Enable "Compress objects automatically"

### 2. Set Cache TTL
- For static content: 86400 seconds (1 day)
- For dynamic content: 0 seconds (no cache)

### 3. Add Custom Domain (Optional)
- Buy domain from Route 53
- Add CNAME record pointing to CloudFront
- Request SSL certificate from ACM
- Attach to CloudFront

---

## Cost

**CloudFront Free Tier:**
- 1TB data transfer per month (free)
- 10 million HTTP/HTTPS requests per month (free)

**Your usage:**
- Small app: ~10-100 GB/month
- **Cost: $0-1/month** (within free tier)

---

## Your URLs

| URL | Purpose |
|-----|---------|
| `http://54.242.171.2:3000` | Direct EC2 (no HTTPS) |
| `http://54.242.171.2` | EC2 via Nginx (no HTTPS) |
| `https://d123abc456.cloudfront.net` | CloudFront (HTTPS) ✅ |

---

## Next Steps

1. **Create CloudFront distribution** (Step 1)
2. **Wait 5-10 minutes** for deployment
3. **Access via CloudFront URL** (Step 3)
4. **Test your app**
5. **(Optional) Add custom domain** (Step 4)

---

## Summary

✅ CloudFront gives you a `.cloudfront.net` link
✅ HTTPS/SSL included
✅ Global CDN for faster loading
✅ Free tier covers your usage
✅ Takes 5-10 minutes to deploy

**Your CloudFront URL will look like:**
```
https://d123abc456.cloudfront.net
```

---

## Questions?

- **CloudFront Docs**: https://docs.aws.amazon.com/cloudfront/
- **Troubleshooting**: https://docs.aws.amazon.com/cloudfront/latest/developerguide/troubleshooting.html
