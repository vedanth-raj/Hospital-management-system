# CloudFront + EC2 Deployment Guide

## Architecture Overview

```
CloudFront (CDN) → EC2 (Application Server) → RDS (Database)
```

- **CloudFront**: Caches static assets and serves content globally
- **EC2**: Runs the Next.js application
- **RDS**: PostgreSQL database

---

## Step 1: Prepare EC2 Instance

Your EC2 instance is already created:
- **Instance ID**: `i-056f474051a09fb07`
- **Public IP**: `54.242.171.2`
- **Type**: `t3.micro` (free tier)
- **Region**: `us-east-1`

### Check EC2 Status

1. Go to **AWS Console** → **EC2** → **Instances**
2. Find instance `i-056f474051a09fb07`
3. Verify **State** is `running`
4. Verify **Status Checks** show `2/2 passed`

---

## Step 2: Connect to EC2 and Deploy

### Option A: Using SSH (Recommended)

```bash
# 1. Navigate to your key file location
cd "C:\Users\Vedanth Raj\Downloads\Hospital-Management-System"

# 2. SSH into EC2
ssh -i hospital-app-key.pem ec2-user@54.242.171.2

# 3. Clone and deploy
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app

# 4. Run deployment script
chmod +x ec2-userdata.sh
./ec2-userdata.sh

# 5. Wait 10-15 minutes for deployment to complete
```

### Option B: Using AWS Systems Manager Session Manager (No SSH Key Needed)

1. Go to **AWS Console** → **Systems Manager** → **Session Manager**
2. Click **Start session**
3. Select instance `i-056f474051a09fb07`
4. Run the same commands as Option A

---

## Step 3: Verify Application is Running

```bash
# Check if app is running
curl http://54.242.171.2:3000

# Check PM2 status
pm2 status

# View logs
pm2 logs hospital-app
```

---

## Step 4: Initialize Database

Once the app is running:

```bash
# Initialize database with demo data
curl http://54.242.171.2:3000/api/init
```

---

## Step 5: Create CloudFront Distribution

### 5.1 Create S3 Bucket for Static Assets (Optional)

1. Go to **AWS Console** → **S3**
2. Click **Create bucket**
3. Name: `hospital-app-static-{your-account-id}`
4. Region: `us-east-1`
5. Block all public access: **OFF**
6. Create bucket

### 5.2 Create CloudFront Distribution

1. Go to **AWS Console** → **CloudFront**
2. Click **Create distribution**

#### Origin Settings:
- **Origin domain**: `54.242.171.2` (your EC2 public IP)
- **Protocol**: `HTTP`
- **HTTP port**: `80`
- **Origin path**: (leave empty)

#### Default Cache Behavior:
- **Viewer protocol policy**: `Redirect HTTP to HTTPS`
- **Allowed HTTP methods**: `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
- **Cache policy**: `Managed-CachingDisabled` (for dynamic content)
- **Origin request policy**: `AllViewersExcept CloudFront-Preload`

#### Cache Behaviors (Add for static assets):
- **Path pattern**: `/public/*`
- **Cache policy**: `Managed-CachingOptimized`
- **Compress objects automatically**: `Yes`

#### Distribution Settings:
- **Default root object**: (leave empty)
- **Enable IPv6**: `Yes`
- **Comment**: `Hospital Management System`
- **Create distribution**: Click

### 5.3 Wait for Distribution to Deploy

- Status will show `Deploying` → `Enabled`
- This takes 5-10 minutes
- Once enabled, you'll get a domain like: `d123456.cloudfront.net`

---

## Step 6: Update Application URL

Once CloudFront is ready, update the EC2 environment:

```bash
# SSH into EC2
ssh -i hospital-app-key.pem ec2-user@54.242.171.2

# Update .env.production
sudo nano /home/ec2-user/hospital-app/.env.production

# Change NEXT_PUBLIC_APP_URL to CloudFront domain:
# NEXT_PUBLIC_APP_URL=https://d123456.cloudfront.net

# Restart app
pm2 restart hospital-app
```

---

## Step 7: Access Your Application

### Via CloudFront (Recommended):
```
https://d123456.cloudfront.net
```

### Via EC2 Direct:
```
http://54.242.171.2:3000
```

---

## Demo Credentials

After running `/api/init`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Reception | reception@hospital.com | reception123 |
| Patient | patient@hospital.com | patient123 |

---

## Database Connection

- **Host**: `hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: `HospitalDB2026Pass`
- **Database**: `hospital_db`

---

## Troubleshooting

### App not accessible after deployment

```bash
# SSH into EC2
ssh -i hospital-app-key.pem ec2-user@54.242.171.2

# Check if app is running
pm2 status

# View logs
pm2 logs hospital-app

# Restart if needed
pm2 restart hospital-app
```

### CloudFront shows 502 Bad Gateway

1. Verify EC2 instance is running
2. Verify security group allows port 80 from CloudFront
3. Check app logs: `pm2 logs hospital-app`
4. Restart app: `pm2 restart hospital-app`

### Database connection errors

1. Verify RDS instance is running
2. Check security group allows port 5432 from EC2
3. Verify credentials in `.env.production`
4. Test connection: `psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres`

---

## Monitoring

### View Application Logs
```bash
pm2 logs hospital-app
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitor CloudFront
1. Go to **AWS Console** → **CloudFront**
2. Select your distribution
3. View **Monitoring** tab for cache statistics

---

## Cost Estimate (Free Tier)

- **EC2 t3.micro**: 750 hours/month (free)
- **RDS db.t3.micro**: 750 hours/month (free)
- **CloudFront**: 1 TB data transfer/month (free)
- **Total**: **FREE** (within free tier limits)

---

## Next Steps

1. ✅ Verify EC2 instance is running
2. ✅ SSH into EC2 and run deployment script
3. ✅ Wait for deployment to complete
4. ✅ Initialize database
5. ✅ Create CloudFront distribution
6. ✅ Update application URL
7. ✅ Access via CloudFront domain

**Estimated total time**: 30-40 minutes

---

**Last Updated**: April 15, 2026
**Status**: Ready for deployment
