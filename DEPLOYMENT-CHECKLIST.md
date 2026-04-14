# Deployment Checklist

## ✅ Pre-Deployment (Completed)

- [x] Docker image built (304MB)
- [x] Docker image pushed to ECR
- [x] RDS PostgreSQL created (db.t3.micro)
- [x] EC2 instance launched (t3.micro)
- [x] Security groups configured
- [x] Key pair created
- [x] Deployment scripts created

## 🚀 Deployment Steps (To Do)

### Step 1: SSH into EC2
- [ ] Download `hospital-app-key.pem` from AWS Console
- [ ] Set permissions: `chmod 400 hospital-app-key.pem`
- [ ] SSH: `ssh -i hospital-app-key.pem ec2-user@54.242.171.2`

### Step 2: Clone Repository
- [ ] `git clone https://github.com/your-repo/Hospital-Management-System.git hospital-app`
- [ ] `cd hospital-app`

### Step 3: Run Deployment Script
- [ ] `chmod +x ec2-userdata.sh`
- [ ] `./ec2-userdata.sh`
- [ ] Wait for script to complete (~5-10 minutes)

### Step 4: Verify Installation
- [ ] Check PM2 status: `pm2 status`
- [ ] Check app logs: `pm2 logs hospital-app`
- [ ] Check Nginx: `sudo systemctl status nginx`

### Step 5: Initialize Database
- [ ] Call init endpoint: `curl http://54.242.171.2:3000/api/init`
- [ ] Or use psql: `psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres -d hospital_db -f scripts/init-db.sql`

### Step 6: Test Application
- [ ] Open browser: `http://54.242.171.2:3000`
- [ ] Login with demo credentials
- [ ] Test basic functionality

## 🔒 Security Configuration (To Do)

- [ ] Change JWT_SECRET in `.env.production`
- [ ] Change RDS password from `HospitalDB2026Pass`
- [ ] Enable RDS encryption
- [ ] Setup SSL/TLS certificate
- [ ] Configure firewall rules
- [ ] Enable CloudWatch monitoring
- [ ] Setup automated RDS backups

## 📊 Post-Deployment (To Do)

- [ ] Setup domain name (optional)
- [ ] Configure DNS records
- [ ] Setup SSL certificate with Let's Encrypt
- [ ] Configure auto-scaling (optional)
- [ ] Setup monitoring and alerts
- [ ] Configure log aggregation
- [ ] Setup automated backups
- [ ] Document deployment process

## 🧪 Testing (To Do)

- [ ] Test admin login
- [ ] Test doctor login
- [ ] Test reception login
- [ ] Test patient login
- [ ] Test patient registration
- [ ] Test appointment booking
- [ ] Test emergency request
- [ ] Test billing functionality
- [ ] Test database connectivity
- [ ] Test file uploads

## 📈 Monitoring (To Do)

- [ ] Setup CloudWatch alarms
- [ ] Monitor EC2 CPU usage
- [ ] Monitor EC2 memory usage
- [ ] Monitor RDS CPU usage
- [ ] Monitor RDS storage
- [ ] Monitor network traffic
- [ ] Setup billing alerts
- [ ] Review logs regularly

## 🆘 Troubleshooting Checklist

If something goes wrong:

- [ ] Check EC2 instance status: `aws ec2 describe-instances --instance-ids i-056f474051a09fb07`
- [ ] Check RDS status: `aws rds describe-db-instances --db-instance-identifier hospital-db`
- [ ] Check security groups: `aws ec2 describe-security-groups --group-ids sg-0ed84c6f38af4f068`
- [ ] SSH into EC2 and check logs: `pm2 logs hospital-app`
- [ ] Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- [ ] Test database connection: `psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres`
- [ ] Check disk space: `df -h`
- [ ] Check memory: `free -h`

## 📝 Important Information

**EC2 Details:**
- Instance ID: `i-056f474051a09fb07`
- Public IP: `54.242.171.2`
- Instance Type: `t3.micro`
- Region: `us-east-1`
- Key Pair: `hospital-app-key`

**RDS Details:**
- Endpoint: `hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com`
- Port: `5432`
- Username: `postgres`
- Password: `HospitalDB2026Pass`
- Database: `hospital_db`

**Application Details:**
- URL: `http://54.242.171.2:3000`
- Port: `3000`
- Process Manager: `PM2`
- Reverse Proxy: `Nginx`

## 💰 Cost Tracking

- [ ] Setup AWS billing alerts
- [ ] Monitor free tier usage
- [ ] Check monthly charges
- [ ] Review cost optimization opportunities

## 📚 Documentation

- [x] QUICK-START.md - Created
- [x] AWS-DEPLOYMENT-GUIDE.md - Created
- [x] DEPLOYMENT-SUMMARY.md - Created
- [x] DEPLOYMENT-CHECKLIST.md - Created
- [ ] Update README.md with AWS deployment info
- [ ] Create troubleshooting guide
- [ ] Create monitoring guide

---

**Status:** Ready for deployment  
**Last Updated:** April 15, 2026  
**Next Action:** SSH into EC2 and run deployment script

