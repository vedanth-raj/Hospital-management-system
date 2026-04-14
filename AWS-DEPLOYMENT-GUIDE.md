# AWS Free Tier Deployment Guide

## Current Status

✅ **Completed:**
- Docker image built and pushed to ECR
- RDS PostgreSQL database created
- EC2 t3.micro instance launched (free tier eligible)
- Security groups configured

**Instance Details:**
- EC2 Instance ID: `i-056f474051a09fb07`
- EC2 Public IP: `54.242.171.2`
- EC2 Instance Type: `t3.micro` (free tier)
- RDS Endpoint: `hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432`
- RDS Credentials: `postgres` / `HospitalDB2026Pass`

---

## Deployment Steps

### Option 1: Manual SSH Deployment (Recommended for Free Tier)

1. **SSH into EC2 instance:**
```bash
ssh -i hospital-app-key.pem ec2-user@54.242.171.2
```

2. **Run deployment script:**
```bash
curl -O https://raw.githubusercontent.com/your-repo/Hospital-Management-System/main/ec2-userdata.sh
chmod +x ec2-userdata.sh
./ec2-userdata.sh
```

3. **Access the app:**
```
http://54.242.171.2:3000
```

---

### Option 2: Using AWS Systems Manager Session Manager (No SSH Key Needed)

1. **Attach IAM role to EC2 instance** (from AWS Console):
   - Go to EC2 → Instances → hospital-app
   - Actions → Security → Modify IAM role
   - Attach `AmazonSSMManagedInstanceCore` role

2. **Connect via Session Manager:**
```bash
aws ssm start-session --target i-056f474051a09fb07 --region us-east-1
```

3. **Run deployment:**
```bash
cd /home/ec2-user
git clone https://github.com/your-repo/Hospital-Management-System.git hospital-app
cd hospital-app
chmod +x ec2-userdata.sh
./ec2-userdata.sh
```

---

## Database Initialization

Once the app is running, initialize the PostgreSQL schema:

```bash
# SSH into EC2
ssh -i hospital-app-key.pem ec2-user@54.242.171.2

# Connect to RDS and run schema
psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres -d hospital_db -f scripts/init-db.sql
```

Or call the init endpoint:
```bash
curl http://54.242.171.2:3000/api/init
```

---

## Environment Variables

The app uses these environment variables (set in `.env.production`):

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://54.242.171.2:3000
DATABASE_URL=postgresql://postgres:HospitalDB2026Pass@hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432/hospital_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbHhl7nwjRjIZE0qiAX8FC577UqYfQby8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smart-hospital-managemen-d2fb0.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smart-hospital-managemen-d2fb0
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smart-hospital-managemen-d2fb0.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=718372719687
NEXT_PUBLIC_FIREBASE_APP_ID=1:718372719687:web:d0ae99aa3d9a0033e23562
```

---

## Demo Credentials

After running `/api/init`, use these credentials:

- **Admin:** `admin@hospital.com` / `admin123`
- **Doctor:** `doctor@hospital.com` / `doctor123`
- **Reception:** `reception@hospital.com` / `reception123`
- **Patient:** `patient@hospital.com` / `patient123`

---

## Monitoring & Logs

### Check PM2 status:
```bash
pm2 status
pm2 logs hospital-app
```

### Check Nginx:
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Check RDS connection:
```bash
psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres -d hospital_db -c "SELECT version();"
```

---

## Stopping/Restarting

```bash
# Stop the app
pm2 stop hospital-app

# Restart the app
pm2 restart hospital-app

# View logs
pm2 logs hospital-app
```

---

## Free Tier Limits

- **EC2:** 750 hours/month of t2.micro or t3.micro
- **RDS:** 750 hours/month of db.t3.micro
- **Data Transfer:** 100 GB/month outbound
- **Storage:** 20 GB for RDS

**Estimated Monthly Cost:** $0 (within free tier)

---

## Troubleshooting

### App not accessible
1. Check security group allows port 3000: `aws ec2 describe-security-groups --group-ids sg-0ed84c6f38af4f068`
2. Check EC2 is running: `aws ec2 describe-instances --instance-ids i-056f474051a09fb07`
3. Check app logs: `pm2 logs hospital-app`

### Database connection error
1. Verify RDS is available: `aws rds describe-db-instances --db-instance-identifier hospital-db`
2. Check security group allows port 5432 from EC2
3. Test connection: `psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres`

### Out of free tier
- Monitor usage in AWS Console → Billing
- Set up billing alerts: AWS Console → Billing → Alerts

---

## Next Steps

1. SSH into EC2 and run the deployment script
2. Initialize the database
3. Access the app at `http://54.242.171.2:3000`
4. Configure a domain name (optional)
5. Set up SSL/TLS with Let's Encrypt (optional)

