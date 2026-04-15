# Deploy Now - Quick Steps

## Your Resources Ready ✅

- **EC2 Instance**: `54.242.171.2` (t3.micro - free tier)
- **RDS Database**: `hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com`
- **GitHub Repo**: `https://github.com/vedanth-raj/Hospital-management-system.git`

---

## Step 1: SSH into EC2 (2 minutes)

```powershell
# Windows PowerShell
ssh -i hospital-app-key.pem ec2-user@54.242.171.2
```

**If connection times out:**
- Wait 2-3 minutes for EC2 to initialize
- Try again

---

## Step 2: Deploy Application (10-15 minutes)

Once SSH is connected, run:

```bash
# Clone repository
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app

# Run deployment script
chmod +x ec2-userdata.sh
./ec2-userdata.sh

# This will:
# - Install Node.js 20
# - Install PM2 (process manager)
# - Build Next.js app
# - Setup Nginx reverse proxy
# - Start application
```

**Wait for completion** (you'll see "Deployment complete!")

---

## Step 3: Initialize Database (1 minute)

```bash
curl http://54.242.171.2:3000/api/init
```

---

## Step 4: Test Application (1 minute)

Open browser and go to:
```
http://54.242.171.2:3000
```

**Demo Credentials:**
- Admin: `admin@hospital.com` / `admin123`
- Doctor: `doctor@hospital.com` / `doctor123`
- Reception: `reception@hospital.com` / `reception123`
- Patient: `patient@hospital.com` / `patient123`

---

## Step 5: Setup CloudFront (Optional - 10 minutes)

For faster global access with HTTPS:

1. Go to **AWS Console → CloudFront**
2. Click **"Create Distribution"**
3. Set **Origin Domain**: `54.242.171.2`
4. Set **Protocol**: HTTP
5. Set **HTTP Port**: 80
6. Set **Viewer Protocol Policy**: Redirect HTTP to HTTPS
7. Set **Cache Policy**: Managed-CachingDisabled
8. Click **"Create Distribution"**
9. Wait 5-10 minutes
10. Access via CloudFront URL (e.g., `https://d123abc.cloudfront.net`)

---

## Total Time: ~30 minutes

✅ EC2 Deployment: 15 minutes
✅ Database Init: 1 minute
✅ CloudFront Setup: 10 minutes

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| SSH timeout | Wait 2-3 min for EC2 to initialize |
| Build fails | Check Node.js installed: `node -v` |
| App won't start | Check logs: `pm2 logs hospital-app` |
| Database error | Verify credentials in `.env.production` |
| CloudFront 502 | Wait 5 min, check EC2 is running |

---

## Database Details

```
Host: hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com
User: postgres
Password: HospitalDB2026Pass
Database: hospital_db
Port: 5432
```

---

**Ready? Start with Step 1!** 🚀
