# Deploy Now - Hospital Management System on AWS

## ✅ Project Uploaded to GitHub

Your project is now available at:
```
https://github.com/vedanth-raj/Hospital-management-system.git
```

---

## 🚀 Deploy to EC2 (When SSH is Ready)

### Step 1: Wait for EC2 to Initialize
The EC2 instance is still initializing. Wait 5-10 minutes, then try SSH again:

```bash
ssh -i hospital-app-key.pem ec2-user@54.242.171.2
```

### Step 2: Clone the Repository
```bash
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app
```

### Step 3: Run Deployment Script
```bash
chmod +x ec2-userdata.sh
./ec2-userdata.sh
```

This script will:
- Install Node.js 20
- Install PM2 (process manager)
- Install Nginx (reverse proxy)
- Clone the repository
- Install dependencies
- Build the Next.js app
- Start the application
- Configure Nginx

### Step 4: Initialize Database
```bash
curl http://54.242.171.2:3000/api/init
```

### Step 5: Access Application
```
http://54.242.171.2:3000
```

---

## 📝 Demo Credentials

After running `/api/init`, use these credentials:

```
Admin:     admin@hospital.com / admin123
Doctor:    doctor@hospital.com / doctor123
Reception: reception@hospital.com / reception123
Patient:   patient@hospital.com / patient123
```

---

## 🔧 AWS Resources

| Resource | Details |
|----------|---------|
| **EC2 Instance** | i-056f474051a09fb07 (54.242.171.2) |
| **RDS Database** | hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com |
| **Database User** | postgres |
| **Database Pass** | HospitalDB2026Pass |
| **Database Name** | hospital_db |
| **Region** | us-east-1 |
| **Free Tier** | ✅ Yes |

---

## 🛠️ Troubleshooting SSH Connection Timeout

If you get "Connection timed out":

1. **Wait longer** - EC2 takes 5-10 minutes to fully initialize
2. **Check instance status:**
   ```bash
   aws ec2 describe-instances --instance-ids i-056f474051a09fb07 --region us-east-1
   ```
3. **Check security group:**
   ```bash
   aws ec2 describe-security-groups --group-ids sg-0ed84c6f38af4f068 --region us-east-1
   ```
4. **Try again after 10 minutes**

---

## 📚 Documentation Files

All documentation is in the repository:

- `QUICK-START.md` - 5-minute deployment guide
- `AWS-DEPLOYMENT-GUIDE.md` - Detailed instructions
- `DEPLOYMENT-SUMMARY.md` - Complete overview
- `DEPLOYMENT-CHECKLIST.md` - Step-by-step checklist
- `AWS-RESOURCES.txt` - All resource details
- `Dockerfile` - Docker configuration
- `ec2-userdata.sh` - Automated deployment script

---

## 🔒 Security Notes

⚠️ **Important:**

1. Change `JWT_SECRET` in `.env.production` after deployment
2. Change RDS password from `HospitalDB2026Pass`
3. Keep `hospital-app-key.pem` secure
4. Monitor AWS billing to stay within free tier

---

## 💰 Cost

**Monthly Cost: $0.00** (within AWS free tier)

- EC2 t3.micro: 750 hours/month ✅
- RDS db.t3.micro: 750 hours/month ✅
- Data Transfer: 100 GB/month ✅
- Storage: 20 GB ✅

---

## ✨ What's Next

1. ⏳ Wait for EC2 to initialize (5-10 minutes)
2. 🔑 SSH into EC2 with the key pair
3. 📥 Clone the repository from GitHub
4. 🚀 Run the deployment script
5. 🗄️ Initialize the database
6. 🌐 Access the application
7. 🧪 Test with demo credentials
8. 🔐 Configure security settings

---

## 📞 Support

If you need help:

1. Check the documentation files in the repository
2. Review AWS CloudWatch logs
3. SSH into EC2 and check PM2 logs: `pm2 logs hospital-app`
4. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

**Status:** ✅ Ready for deployment  
**GitHub:** https://github.com/vedanth-raj/Hospital-management-system.git  
**EC2 IP:** 54.242.171.2  
**Last Updated:** April 15, 2026

