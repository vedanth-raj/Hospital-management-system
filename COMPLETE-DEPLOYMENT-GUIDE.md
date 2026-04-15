# Complete Deployment Guide - Session Manager + CloudFront

## 🎯 Your Goal

Deploy Hospital Management System with:
- ✅ Session Manager (no SSH keys)
- ✅ CloudFront (`.cloudfront.net` link)
- ✅ HTTPS/SSL
- ✅ Global CDN

---

## 📋 Complete Timeline

| Phase | Time | Status |
|-------|------|--------|
| **Phase 1: IAM Setup** | 5 min | Setup |
| **Phase 2: Deploy App** | 15 min | Deployment |
| **Phase 3: Initialize DB** | 1 min | Database |
| **Phase 4: Add CloudFront** | 10 min | CDN |
| **Total** | **~30 minutes** | ✅ Live |

---

## 🔐 Phase 1: IAM Setup (5 minutes)

### Step 1.1: Create IAM Role
1. AWS Console → IAM → Roles
2. Create role → AWS service → EC2
3. Add permission: "AmazonSSMManagedInstanceCore"
4. Name: `EC2-SSM-Role`
5. Create role

### Step 1.2: Attach Role to EC2
1. AWS Console → EC2 → Instances
2. Select: `54.242.171.2`
3. Instance State → Security → Modify IAM instance profile
4. Select: `EC2-SSM-Role`
5. Update IAM instance profile
6. ⏳ Wait 1-2 minutes

✅ **IAM Setup Complete**

---

## 🚀 Phase 2: Deploy Application (15 minutes)

### Step 2.1: Open Session Manager Terminal
1. AWS Console → Systems Manager → Session Manager
2. Start session
3. Select your EC2 instance
4. Click "Start session"

### Step 2.2: Deploy App
In the terminal, run:

```bash
sudo su - ec2-user
```

```bash
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app
```

```bash
chmod +x ec2-userdata.sh
./ec2-userdata.sh
```

⏳ **Wait 10-15 minutes for build to complete**

You'll see: `Deployment complete! App running at http://54.242.171.2`

✅ **App Deployed**

---

## 🗄️ Phase 3: Initialize Database (1 minute)

In the same terminal:

```bash
curl http://localhost:3000/api/init
```

Expected response: `{"success":true}`

✅ **Database Initialized**

---

## 🌐 Phase 4: Add CloudFront (10 minutes)

### Step 4.1: Create CloudFront Distribution
1. AWS Console → CloudFront → Distributions
2. Create distribution
3. **Origin Domain**: `54.242.171.2`
4. **Protocol**: HTTP
5. **HTTP Port**: 80
6. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
7. **Cache Policy**: Managed-CachingDisabled
8. **Origin Request Policy**: AllViewerExceptHostHeader
9. Click "Create distribution"
10. ⏳ Wait 5-10 minutes for deployment

### Step 4.2: Get Your CloudFront URL
1. CloudFront → Distributions
2. Wait for status: "Enabled"
3. Copy **Domain Name** (e.g., `d123abc456.cloudfront.net`)

✅ **CloudFront Ready**

---

## 🎉 Your App is Live!

### Access URLs

| URL | Purpose |
|-----|---------|
| `http://54.242.171.2:3000` | Direct EC2 (no HTTPS) |
| `https://d123abc456.cloudfront.net` | ✅ CloudFront (HTTPS) |

### Demo Credentials

```
Admin: admin@hospital.com / admin123
Doctor: doctor@hospital.com / doctor123
Reception: reception@hospital.com / reception123
Patient: patient@hospital.com / patient123
```

---

## 📊 Your Infrastructure

```
┌─────────────────────────────────────────────────────┐
│                   Your Users                         │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │   CloudFront (CDN)     │
        │ d123abc456.cloudfront  │
        │   .net (HTTPS)         │
        └────────────┬───────────┘
                     │
                     ↓
        ┌────────────────────────┐
        │   EC2 Instance         │
        │   54.242.171.2         │
        │   (t3.micro - free)    │
        └────────────┬───────────┘
                     │
        ┌────────────┴───────────┐
        ↓                        ↓
    ┌────────┐          ┌──────────────┐
    │ Nginx  │          │ RDS Database │
    │ (80)   │          │ (PostgreSQL) │
    └────┬───┘          └──────────────┘
         │
         ↓
    ┌────────────┐
    │ Next.js    │
    │ App (3000) │
    └────────────┘
```

---

## ✅ Verification Checklist

- [ ] Session Manager terminal opens
- [ ] Deployment script runs without errors
- [ ] App starts successfully
- [ ] Database initializes
- [ ] CloudFront distribution created
- [ ] CloudFront status: "Enabled"
- [ ] Can access via CloudFront URL
- [ ] HTTPS works (green lock icon)
- [ ] Can login with demo credentials
- [ ] Dashboard loads
- [ ] No console errors

---

## 🆘 Troubleshooting

### Session Manager not showing instance
```
→ Wait 2-3 minutes after attaching role
→ Refresh the page
→ Check instance is running
```

### Build fails
```
→ Check Node.js: node -v
→ Check npm: npm -v
→ Check disk space: df -h
```

### CloudFront shows 502 error
```
→ Wait 5-10 minutes for full deployment
→ Verify EC2 instance is running
→ Check Nginx: sudo systemctl status nginx
→ Check app: pm2 status
```

### Can't access CloudFront URL
```
→ Wait for status to change to "Enabled"
→ Check origin is correct: 54.242.171.2
→ Check EC2 security group allows port 80
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `START-HERE.md` | Overview |
| `QUICK-START-SESSION-MANAGER.md` | 5-step quick start |
| `SESSION-MANAGER-SETUP.md` | Detailed setup |
| `SESSION-MANAGER-CHECKLIST.md` | Step-by-step checklist |
| `ADD-CLOUDFRONT.md` | CloudFront setup |
| `CLOUDFRONT-CHECKLIST.md` | CloudFront checklist |
| `COMPLETE-DEPLOYMENT-GUIDE.md` | This file |

---

## 💰 Cost Breakdown

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|-----------|------|
| EC2 t3.micro | 750 hrs/mo | 24/7 | $0 |
| RDS db.t3.micro | 750 hrs/mo | 24/7 | $0 |
| CloudFront | 1TB/mo | ~50GB | $0 |
| **Total** | | | **$0/month** |

---

## 🚀 Next Steps (Optional)

1. **Add Custom Domain**
   - Buy domain from Route 53
   - Create CNAME record
   - Request SSL certificate

2. **Setup Monitoring**
   - CloudWatch alarms
   - Email notifications
   - Performance metrics

3. **Enable Auto-Scaling**
   - Multiple EC2 instances
   - Load balancer
   - Auto-scaling group

4. **Setup Backups**
   - RDS automated backups
   - Database snapshots
   - Point-in-time recovery

---

## 📞 Support Resources

- **AWS Documentation**: https://docs.aws.amazon.com/
- **Session Manager**: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html
- **CloudFront**: https://docs.aws.amazon.com/cloudfront/
- **EC2**: https://docs.aws.amazon.com/ec2/

---

## 🎯 Summary

✅ **Phase 1**: IAM setup (5 min)
✅ **Phase 2**: Deploy app (15 min)
✅ **Phase 3**: Initialize DB (1 min)
✅ **Phase 4**: Add CloudFront (10 min)

**Total: ~30 minutes**

Your app is now live at:
```
https://d123abc456.cloudfront.net
```

With:
- ✅ HTTPS/SSL
- ✅ Global CDN
- ✅ DDoS protection
- ✅ Fast loading worldwide

---

## 🎉 Congratulations!

Your Hospital Management System is deployed and live!

**Start with**: `QUICK-START-SESSION-MANAGER.md`

Good luck! 🚀
