# 🚀 START HERE - Deploy Your App in 20 Minutes

## You Chose: AWS Systems Manager Session Manager ✅

No SSH keys. No firewall issues. Just click and deploy from AWS Console.

---

## 📖 Read This First

**Quick Start (5 steps, 20 minutes):**
👉 `QUICK-START-SESSION-MANAGER.md`

**Detailed Setup Guide:**
👉 `SESSION-MANAGER-SETUP.md`

**Checklist to follow:**
👉 `SESSION-MANAGER-CHECKLIST.md`

---

## ⚡ TL;DR - 5 Steps

### Step 1: Create IAM Role (2 min)
- AWS Console → IAM → Roles → Create role
- Select EC2 → Add "AmazonSSMManagedInstanceCore"
- Name: `EC2-SSM-Role`

### Step 2: Attach Role to EC2 (3 min)
- AWS Console → EC2 → Instances
- Select `54.242.171.2`
- Modify IAM instance profile → Select `EC2-SSM-Role`
- Wait 1-2 minutes

### Step 3: Open Terminal (1 min)
- AWS Console → Systems Manager → Session Manager
- Start session → Select your instance
- Click "Start session"

### Step 4: Deploy (15 min)
```bash
sudo su - ec2-user
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app
chmod +x ec2-userdata.sh
./ec2-userdata.sh
```
Wait 10-15 minutes...

### Step 5: Initialize Database (1 min)
```bash
curl http://localhost:3000/api/init
```

---

## 🌐 Access Your App

```
http://54.242.171.2:3000
```

**Login:**
- Email: `admin@hospital.com`
- Password: `admin123`

---

## 📊 Your Resources

| Resource | Details |
|----------|---------|
| **EC2 Instance** | 54.242.171.2 (t3.micro - free) |
| **Database** | hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com |
| **DB User** | postgres |
| **DB Password** | HospitalDB2026Pass |
| **GitHub** | https://github.com/vedanth-raj/Hospital-management-system.git |
| **Cost** | $0/month (free tier) |

---

## 🎯 What Happens During Deployment

The `ec2-userdata.sh` script will:

1. ✅ Install Node.js 20
2. ✅ Install PM2 (process manager)
3. ✅ Clone your GitHub repo
4. ✅ Install dependencies
5. ✅ Build Next.js app
6. ✅ Setup Nginx reverse proxy
7. ✅ Start your app
8. ✅ Configure auto-restart

---

## 🆘 Troubleshooting

### Session Manager not showing instance
```
→ Wait 2-3 minutes after attaching role
→ Refresh the page
→ Check instance is running (green status)
```

### Build fails
```
→ Check Node.js: node -v
→ Check npm: npm -v
→ Check disk space: df -h
```

### App won't start
```
→ Check PM2: pm2 status
→ View logs: pm2 logs hospital-app
→ Restart: pm2 restart hospital-app
```

### Database error
```
→ Check credentials in .env.production
→ Verify RDS security group allows EC2
→ Test: psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `QUICK-START-SESSION-MANAGER.md` | 5-step quick start |
| `SESSION-MANAGER-SETUP.md` | Detailed setup guide |
| `SESSION-MANAGER-CHECKLIST.md` | Step-by-step checklist |
| `DEPLOYMENT-OPTIONS.md` | Compare all 4 options |
| `NO-SSH-DEPLOYMENT-GUIDE.md` | All no-SSH options |

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Session Manager terminal opens
- [ ] Deployment script runs without errors
- [ ] App starts successfully
- [ ] Database initializes
- [ ] Can login to app
- [ ] Dashboard loads
- [ ] No console errors

---

## 🎉 You're Done!

Your Hospital Management System is live at:
```
http://54.242.171.2:3000
```

### Demo Accounts:
- **Admin**: admin@hospital.com / admin123
- **Doctor**: doctor@hospital.com / doctor123
- **Reception**: reception@hospital.com / reception123
- **Patient**: patient@hospital.com / patient123

---

## 🚀 Next Steps (Optional)

1. **Add CloudFront** - Global CDN + HTTPS
2. **Setup SSL/HTTPS** - AWS Certificate Manager
3. **Configure Auto-Scaling** - Multiple instances
4. **Setup Monitoring** - CloudWatch alerts
5. **Enable Backups** - RDS automated backups

---

## 📞 Need Help?

1. **Read the detailed guide**: `SESSION-MANAGER-SETUP.md`
2. **Follow the checklist**: `SESSION-MANAGER-CHECKLIST.md`
3. **Check troubleshooting** above
4. **Review AWS documentation**: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html

---

## 🎯 Ready?

👉 **Start with Step 1 in `QUICK-START-SESSION-MANAGER.md`**

**Estimated time: 20 minutes** ⏱️

Good luck! 🚀
