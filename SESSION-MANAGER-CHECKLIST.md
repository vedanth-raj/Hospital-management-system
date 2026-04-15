# Session Manager Deployment Checklist

## Pre-Deployment Checklist

- [ ] AWS Account access
- [ ] EC2 instance running (54.242.171.2)
- [ ] RDS database running
- [ ] GitHub repo updated

---

## Step 1: Create IAM Role

- [ ] Go to AWS Console → IAM → Roles
- [ ] Click "Create role"
- [ ] Select "AWS service" → "EC2"
- [ ] Search for "AmazonSSMManagedInstanceCore"
- [ ] Check the box
- [ ] Click "Next"
- [ ] Name: `EC2-SSM-Role`
- [ ] Click "Create role"

**Time: 2 minutes**

---

## Step 2: Attach Role to EC2

- [ ] Go to AWS Console → EC2 → Instances
- [ ] Select instance `54.242.171.2`
- [ ] Click "Instance State" → "Security" → "Modify IAM instance profile"
- [ ] Select `EC2-SSM-Role`
- [ ] Click "Update IAM instance profile"
- [ ] ⏳ Wait 1-2 minutes

**Time: 2 minutes + 1-2 min wait**

---

## Step 3: Connect via Session Manager

- [ ] Go to AWS Console → Systems Manager → Session Manager
- [ ] Click "Start session"
- [ ] Select your EC2 instance
- [ ] Click "Start session"
- [ ] ✅ Terminal opens in browser

**Time: 1 minute**

---

## Step 4: Deploy Application

In the Session Manager terminal:

```bash
# [ ] Switch to ec2-user
sudo su - ec2-user

# [ ] Clone repository
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app

# [ ] Run deployment
chmod +x ec2-userdata.sh
./ec2-userdata.sh

# [ ] Wait for completion (10-15 minutes)
# [ ] See "Deployment complete!" message
```

**Time: 15 minutes**

---

## Step 5: Initialize Database

In the same terminal:

```bash
# [ ] Initialize database
curl http://localhost:3000/api/init

# [ ] Should see: {"success":true}
```

**Time: 1 minute**

---

## Step 6: Test Application

- [ ] Open browser
- [ ] Go to: `http://54.242.171.2:3000`
- [ ] Login with: admin@hospital.com / admin123
- [ ] ✅ App is working!

**Time: 1 minute**

---

## Post-Deployment Verification

- [ ] App loads without errors
- [ ] Login works
- [ ] Dashboard displays
- [ ] Database connected
- [ ] No console errors

---

## Optional: Add CloudFront

- [ ] Go to AWS Console → CloudFront
- [ ] Click "Create Distribution"
- [ ] Origin Domain: `54.242.171.2`
- [ ] Protocol: HTTP
- [ ] HTTP Port: 80
- [ ] Viewer Protocol Policy: Redirect HTTP to HTTPS
- [ ] Cache Policy: Managed-CachingDisabled
- [ ] Click "Create Distribution"
- [ ] ⏳ Wait 5-10 minutes
- [ ] Access via CloudFront URL

**Time: 10 minutes**

---

## Troubleshooting Checklist

### Session Manager not showing instance
- [ ] Wait 2-3 minutes after attaching role
- [ ] Refresh page
- [ ] Check instance status is "running"
- [ ] Check role is attached in EC2 → Security tab

### Build fails
- [ ] Check Node.js: `node -v`
- [ ] Check npm: `npm -v`
- [ ] Check disk space: `df -h`
- [ ] Check logs: `tail -f /var/log/messages`

### App won't start
- [ ] Check PM2: `pm2 status`
- [ ] View logs: `pm2 logs hospital-app`
- [ ] Restart: `pm2 restart hospital-app`
- [ ] Check port: `netstat -tlnp | grep 3000`

### Database error
- [ ] Check credentials in `.env.production`
- [ ] Test connection: `psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres`
- [ ] Check RDS security group

---

## Database Credentials (Reference)

```
Host: hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com
User: postgres
Password: HospitalDB2026Pass
Database: hospital_db
Port: 5432
```

---

## Demo Credentials (After /api/init)

```
Admin: admin@hospital.com / admin123
Doctor: doctor@hospital.com / doctor123
Reception: reception@hospital.com / reception123
Patient: patient@hospital.com / patient123
```

---

## Total Time: ~20 minutes

- IAM Setup: 2 min
- Attach Role: 2 min + 1-2 min wait
- Connect: 1 min
- Deploy: 15 min
- Database: 1 min
- Test: 1 min

---

## Success Criteria

✅ Session Manager terminal opens
✅ Deployment script runs without errors
✅ App starts successfully
✅ Database initializes
✅ Can login to app
✅ Dashboard loads

---

**Ready to start? Follow the steps in SESSION-MANAGER-SETUP.md** 🚀
