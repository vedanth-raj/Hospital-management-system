# CloudFront Setup Checklist

## Prerequisites

- [ ] EC2 instance deployed and running
- [ ] App accessible at `http://54.242.171.2:3000`
- [ ] Database initialized
- [ ] App is working

---

## Step 1: Create CloudFront Distribution (5 minutes)

### 1.1 Access CloudFront Console
- [ ] Open AWS Console
- [ ] Search for "CloudFront"
- [ ] Click "Distributions"
- [ ] Click "Create distribution"

### 1.2 Configure Origin
- [ ] Origin Domain: `54.242.171.2`
- [ ] Protocol: HTTP
- [ ] HTTP Port: 80
- [ ] Origin Path: (leave empty)

### 1.3 Configure Viewer Settings
- [ ] Viewer Protocol Policy: Redirect HTTP to HTTPS
- [ ] Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE

### 1.4 Configure Cache Settings
- [ ] Cache Policy: Managed-CachingDisabled
- [ ] Origin Request Policy: AllViewerExceptHostHeader

### 1.5 Create Distribution
- [ ] Click "Create distribution"
- [ ] ⏳ Wait 5-10 minutes for deployment

---

## Step 2: Get CloudFront URL (1 minute)

- [ ] Go to CloudFront → Distributions
- [ ] Wait for status to change from "Deploying" to "Enabled"
- [ ] Copy Domain Name (e.g., `d123abc456.cloudfront.net`)
- [ ] Save this URL

---

## Step 3: Test CloudFront (1 minute)

- [ ] Open browser
- [ ] Go to: `https://d123abc456.cloudfront.net`
- [ ] App loads successfully
- [ ] HTTPS works (green lock icon)
- [ ] Can login with admin@hospital.com / admin123

---

## Step 4: Verify Performance (Optional)

- [ ] Check page load time
- [ ] Check HTTPS certificate (should be valid)
- [ ] Test from different browser
- [ ] Check mobile responsiveness

---

## Step 5: Update Environment (Optional)

- [ ] Open Session Manager
- [ ] Edit `.env.production`
- [ ] Update: `NEXT_PUBLIC_APP_URL=https://d123abc456.cloudfront.net`
- [ ] Restart app: `pm2 restart hospital-app`

---

## Troubleshooting

### CloudFront shows 502 error
- [ ] Wait 5-10 minutes for full deployment
- [ ] Verify EC2 instance is running
- [ ] Check Nginx: `sudo systemctl status nginx`
- [ ] Check app: `pm2 status`

### CloudFront shows 403 error
- [ ] Check EC2 security group allows port 80
- [ ] Verify origin is correct: `54.242.171.2`

### Slow loading
- [ ] Clear CloudFront cache: Invalidations → Create invalidation → `/*`
- [ ] Check network tab in browser DevTools

### HTTPS certificate error
- [ ] This is normal (CloudFront uses its own cert)
- [ ] Your connection is still encrypted

---

## Performance Optimization (Optional)

- [ ] Enable compression: Distribution → Behaviors → Compress objects
- [ ] Set cache TTL for static content: 86400 seconds
- [ ] Set cache TTL for dynamic content: 0 seconds

---

## Your URLs

| URL | Status |
|-----|--------|
| `http://54.242.171.2:3000` | Direct EC2 (no HTTPS) |
| `http://54.242.171.2` | EC2 via Nginx (no HTTPS) |
| `https://d123abc456.cloudfront.net` | ✅ CloudFront (HTTPS) |

---

## Success Criteria

✅ CloudFront distribution created
✅ Status shows "Enabled"
✅ Can access via `.cloudfront.net` URL
✅ HTTPS works (green lock)
✅ App loads without errors
✅ Can login successfully
✅ Database connected

---

## Cost Verification

- [ ] CloudFront free tier: 1TB/month
- [ ] Your usage: ~10-100 GB/month
- [ ] Estimated cost: $0-1/month

---

## Final Checklist

- [ ] CloudFront URL: `https://d123abc456.cloudfront.net`
- [ ] App is live and working
- [ ] HTTPS is enabled
- [ ] Database is connected
- [ ] Can login with demo credentials
- [ ] Performance is good

---

## Demo Credentials

```
Admin: admin@hospital.com / admin123
Doctor: doctor@hospital.com / doctor123
Reception: reception@hospital.com / reception123
Patient: patient@hospital.com / patient123
```

---

## Total Time: ~15 minutes

- CloudFront setup: 5 minutes
- Wait for deployment: 5-10 minutes
- Testing: 1 minute

---

**Your app is now live with HTTPS!** 🎉
