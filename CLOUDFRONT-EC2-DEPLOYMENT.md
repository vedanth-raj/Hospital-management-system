# CloudFront + EC2 Deployment Guide

## Quick Setup (5-10 minutes)

### Step 1: Deploy to EC2 (Already Have Instance)

Your EC2 instance is ready at: `54.242.171.2`

SSH into it and run the deployment:

```bash
ssh -i hospital-app-key.pem ec2-user@54.242.171.2

# Clone and deploy
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app
chmod +x ec2-userdata.sh
./ec2-userdata.sh

# Wait 5-10 minutes for build to complete
```

### Step 2: Initialize Database

```bash
curl http://54.242.171.2:3000/api/init
```

### Step 3: Create CloudFront Distribution

1. **Go to AWS Console → CloudFront**
2. **Click "Create Distribution"**
3. **Configure:**
   - **Origin Domain**: `54.242.171.2` (your EC2 instance)
   - **Protocol**: HTTP
   - **HTTP Port**: 80
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Cache Policy**: Managed-CachingDisabled (for dynamic content)
   - **Origin Request Policy**: AllViewerExceptHostHeader

4. **Click "Create Distribution"**
5. **Wait 5-10 minutes for deployment**

### Step 4: Access Your App

Once CloudFront is deployed, you'll get a domain like:
```
https://d123abc.cloudfront.net
```

Use this URL to access your application.

---

## Architecture

```
User → CloudFront (CDN) → EC2 (54.242.171.2:80) → Nginx → Next.js (3000)
```

## Database Connection

- **Host**: `hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com`
- **User**: `postgres`
- **Password**: `HospitalDB2026Pass`
- **Database**: `hospital_db`

## Demo Credentials (After /api/init)

- **Admin**: admin@hospital.com / admin123
- **Doctor**: doctor@hospital.com / doctor123
- **Reception**: reception@hospital.com / reception123
- **Patient**: patient@hospital.com / patient123

---

## Troubleshooting

### EC2 SSH Connection Timeout
- Wait 2-3 minutes for EC2 to fully initialize
- Check security group allows port 22
- Verify key pair permissions: `chmod 400 hospital-app-key.pem`

### CloudFront Shows 502 Error
- Verify EC2 instance is running
- Check Nginx is running: `sudo systemctl status nginx`
- Check app is running: `pm2 status`

### Database Connection Error
- Verify RDS security group allows port 5432 from EC2
- Check database credentials in `.env.production`

---

## Cost Estimate (Free Tier)

- **EC2 t3.micro**: 750 hours/month (free)
- **RDS db.t3.micro**: 750 hours/month (free)
- **CloudFront**: 1TB data transfer free per month
- **Total**: ~$0/month (within free tier)

---

## Next Steps

1. SSH into EC2 and run deployment
2. Wait for build to complete
3. Initialize database
4. Create CloudFront distribution
5. Access app via CloudFront URL

**Estimated total time: 20-30 minutes**
