# Quick Start - Deploy to AWS EC2

## 🎯 In 5 Minutes

### Step 1: SSH into EC2
```bash
ssh -i hospital-app-key.pem ec2-user@54.242.171.2
```

### Step 2: Clone Repository
```bash
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app
```

### Step 3: Run Deployment
```bash
chmod +x ec2-userdata.sh
./ec2-userdata.sh
```

### Step 4: Initialize Database
```bash
curl http://54.242.171.2:3000/api/init
```

### Step 5: Access Application
```
http://54.242.171.2:3000
```

---

## 🔑 Demo Credentials

```
Admin:     admin@hospital.com / admin123
Doctor:    doctor@hospital.com / doctor123
Reception: reception@hospital.com / reception123
Patient:   patient@hospital.com / patient123
```

---

## 📊 AWS Resources

| Resource | Value |
|----------|-------|
| EC2 IP | 54.242.171.2 |
| EC2 Type | t3.micro (free) |
| RDS Host | hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com |
| RDS Type | db.t3.micro (free) |
| App Port | 3000 |
| Nginx Port | 80 |

---

## 🛠️ Useful Commands

```bash
# SSH into EC2
ssh -i hospital-app-key.pem ec2-user@54.242.171.2

# View app logs
pm2 logs hospital-app

# Restart app
pm2 restart hospital-app

# Check app status
pm2 status

# Stop app
pm2 stop hospital-app

# View Nginx logs
sudo tail -f /var/log/nginx/error.log

# Connect to database
psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres -d hospital_db
```

---

## ⚠️ Important Notes

1. **SSH Key:** Keep `hospital-app-key.pem` safe
2. **Database Password:** Change `HospitalDB2026Pass` after deployment
3. **JWT Secret:** Change in `.env.production`
4. **Free Tier:** Monitor usage to avoid charges
5. **Backups:** Setup RDS automated backups

---

## 🆘 Troubleshooting

### App not accessible
```bash
# Check if running
pm2 status

# Check logs
pm2 logs hospital-app

# Check Nginx
sudo systemctl status nginx
```

### Database connection error
```bash
# Test connection
psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres

# Check security group
aws ec2 describe-security-groups --group-ids sg-0ed84c6f38af4f068
```

### Out of memory
```bash
# Check memory usage
free -h

# Restart app
pm2 restart hospital-app
```

---

## 📚 Full Documentation

See `AWS-DEPLOYMENT-GUIDE.md` for detailed instructions.

