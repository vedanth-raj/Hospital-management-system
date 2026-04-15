# Quick Start - Session Manager (5 Steps, 20 Minutes)

## 🎯 Goal
Deploy your Hospital Management System to AWS EC2 using Session Manager (no SSH keys needed).

---

## ⏱️ Timeline
- Step 1: 2 minutes
- Step 2: 3 minutes (+ 1-2 min wait)
- Step 3: 1 minute
- Step 4: 15 minutes
- Step 5: 1 minute
- **Total: ~20 minutes**

---

## 📋 Step 1: Create IAM Role (2 minutes)

1. Open AWS Console
2. Search for **"IAM"**
3. Click **"Roles"**
4. Click **"Create role"**
5. Select **"AWS service"** → **"EC2"**
6. Click **"Next"**
7. Search for **"AmazonSSMManagedInstanceCore"**
8. ✅ Check the box
9. Click **"Next"** → **"Next"**
10. Name: **`EC2-SSM-Role`**
11. Click **"Create role"**

✅ **Role created!**

---

## 🔗 Step 2: Attach Role to EC2 (3 minutes + wait)

1. Search for **"EC2"**
2. Click **"Instances"**
3. Select instance: **`54.242.171.2`**
4. Click **"Instance State"** (top right)
5. Click **"Security"**
6. Click **"Modify IAM instance profile"**
7. Select: **`EC2-SSM-Role`**
8. Click **"Update IAM instance profile"**
9. ⏳ **Wait 1-2 minutes**

✅ **Role attached!**

---

## 💻 Step 3: Open Session Manager Terminal (1 minute)

1. Search for **"Systems Manager"**
2. Click **"Session Manager"** (left sidebar)
3. Click **"Start session"**
4. Select your instance: **`54.242.171.2`**
5. Click **"Start session"**

✅ **Terminal opens in browser!**

---

## 🚀 Step 4: Deploy Application (15 minutes)

Copy and paste these commands in the Session Manager terminal:

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

✅ **App deployed!**

---

## 🗄️ Step 5: Initialize Database (1 minute)

In the same terminal:

```bash
curl http://localhost:3000/api/init
```

You should see: `{"success":true}`

✅ **Database initialized!**

---

## 🌐 Access Your App

Open your browser and go to:

```
http://54.242.171.2:3000
```

### Login Credentials:
- **Email**: admin@hospital.com
- **Password**: admin123

✅ **You're live!**

---

## 📊 Demo Accounts

After login, you can test with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Reception | reception@hospital.com | reception123 |
| Patient | patient@hospital.com | patient123 |

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Session Manager not showing instance | Wait 2-3 min, refresh page |
| Build fails | Check: `node -v`, `npm -v`, `df -h` |
| App won't start | Run: `pm2 logs hospital-app` |
| Database error | Check credentials in `.env.production` |
| Can't access app | Check: `pm2 status`, `netstat -tlnp \| grep 3000` |

---

## 📚 More Info

- **Full Setup Guide**: `SESSION-MANAGER-SETUP.md`
- **Checklist**: `SESSION-MANAGER-CHECKLIST.md`
- **Deployment Options**: `DEPLOYMENT-OPTIONS.md`

---

## 🎉 Success!

Your Hospital Management System is now live at:
```
http://54.242.171.2:3000
```

**Next Steps:**
1. Test the application
2. (Optional) Add CloudFront for global CDN
3. (Optional) Setup SSL/HTTPS
4. (Optional) Configure auto-scaling

---

**Questions? Check the full guides above!** 📖
