# Session Manager - Commands to Run

## Copy and paste these commands in Session Manager terminal

---

## Command 1: Switch to ec2-user
```bash
sudo su - ec2-user
```

---

## Command 2: Clone and Deploy (All-in-One)
```bash
cd /home/ec2-user && \
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app && \
cd hospital-app && \
chmod +x ec2-userdata.sh && \
./ec2-userdata.sh
```

**OR if that fails, try this:**

```bash
cd /home/ec2-user && \
mkdir -p hospital-app && \
cd hospital-app && \
git init && \
git remote add origin https://github.com/vedanth-raj/Hospital-management-system.git && \
git fetch origin main && \
git checkout main && \
chmod +x ec2-userdata.sh && \
./ec2-userdata.sh
```

---

## Command 3: Monitor Deployment
While deployment is running, in another Session Manager terminal:
```bash
pm2 logs hospital-app
```

---

## Command 4: Initialize Database (After deployment completes)
```bash
curl http://localhost:3000/api/init
```

---

## Command 5: Check App Status
```bash
pm2 status
```

---

## Command 6: View Nginx Status
```bash
sudo systemctl status nginx
```

---

## Command 7: Check Logs
```bash
pm2 logs hospital-app
```

---

## Troubleshooting Commands

### If git clone fails:
```bash
cd /home/ec2-user
rm -rf hospital-app
git clone --depth 1 https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app
chmod +x ec2-userdata.sh
./ec2-userdata.sh
```

### If build fails:
```bash
# Check Node.js
node -v

# Check npm
npm -v

# Check disk space
df -h

# Check memory
free -h
```

### If app won't start:
```bash
# Restart PM2
pm2 restart hospital-app

# View logs
pm2 logs hospital-app

# Check port 3000
netstat -tlnp | grep 3000
```

### If Nginx won't start:
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Expected Output

### After deployment completes:
```
Deployment complete! App running at http://54.242.171.2
```

### After database init:
```
{"success":true}
```

### After pm2 status:
```
┌─────────────────────────────────────────────────────────────┐
│ id │ name          │ namespace   │ version │ mode │ pid  │ uptime │
├─────────────────────────────────────────────────────────────┤
│ 0  │ hospital-app  │ default     │ 0.1.0   │ fork │ 1234 │ 5m    │
└─────────────────────────────────────────────────────────────┘
```

---

## Timeline

- **Clone & Install**: 2-3 minutes
- **Build**: 10-15 minutes
- **Start**: 1 minute
- **Database Init**: 1 minute
- **Total**: ~15-20 minutes

---

## Your App URLs

After deployment:
- **Direct**: `http://107.20.9.43:3000`
- **Via Nginx**: `http://107.20.9.43`

After CloudFront:
- **CloudFront**: `https://d123abc456.cloudfront.net`

---

## Demo Credentials

```
Admin: admin@hospital.com / admin123
Doctor: doctor@hospital.com / doctor123
Reception: reception@hospital.com / reception123
Patient: patient@hospital.com / patient123
```

---

## Quick Copy-Paste

**Step 1:**
```bash
sudo su - ec2-user
```

**Step 2:**
```bash
cd /home/ec2-user && git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app && cd hospital-app && chmod +x ec2-userdata.sh && ./ec2-userdata.sh
```

**Step 3 (after deployment):**
```bash
curl http://localhost:3000/api/init
```

---

**Ready? Paste these commands in Session Manager!** 🚀
