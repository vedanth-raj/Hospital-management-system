# Deploy via AWS ECS (Container-Based, Easiest)

## Overview

This approach uses Docker containers on AWS ECS - no server management needed.

---

## Setup (15 minutes)

### Step 1: Build and Push Docker Image

You already have the Dockerfile. Push to ECR:

```powershell
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 972803002725.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t hospital-app:latest .

# Tag for ECR
docker tag hospital-app:latest 972803002725.dkr.ecr.us-east-1.amazonaws.com/hospital-app:latest

# Push to ECR
docker push 972803002725.dkr.ecr.us-east-1.amazonaws.com/hospital-app:latest
```

### Step 2: Create ECS Cluster

1. Go to **AWS Console → ECS**
2. Click **"Create cluster"**
3. Name: `hospital-cluster`
4. Infrastructure: **AWS Fargate**
5. Click **"Create**

### Step 3: Create Task Definition

1. Click **"Task Definitions"** → **"Create new task definition"**
2. Name: `hospital-task`
3. Launch type: **Fargate**
4. CPU: **0.25 vCPU** (free tier)
5. Memory: **512 MB** (free tier)
6. Container name: `hospital-app`
7. Image: `972803002725.dkr.ecr.us-east-1.amazonaws.com/hospital-app:latest`
8. Port mappings: `3000:3000`
9. Environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres:HospitalDB2026Pass@hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432/hospital_db
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbHhl7nwjRjIZE0qiAX8FC577UqYfQby8
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smart-hospital-managemen-d2fb0.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=smart-hospital-managemen-d2fb0
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smart-hospital-managemen-d2fb0.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=718372719687
   NEXT_PUBLIC_FIREBASE_APP_ID=1:718372719687:web:d0ae99aa3d9a0033e23562
   ```
10. Click **"Create"**

### Step 4: Create Service

1. Go to **Cluster → hospital-cluster**
2. Click **"Create service"**
3. Launch type: **Fargate**
4. Task definition: `hospital-task`
5. Service name: `hospital-service`
6. Desired count: **1**
7. VPC: Default
8. Subnets: Select all
9. Security group: Create new or select existing
10. Load balancer: **Application Load Balancer**
11. Container port: **3000**
12. Click **"Create service"**

### Step 5: Configure Load Balancer

1. Go to **EC2 → Load Balancers**
2. Find the ALB created by ECS
3. Add listener for port 80 → forward to port 3000
4. Get the ALB DNS name

### Step 6: Initialize Database

```bash
curl http://<ALB-DNS-NAME>/api/init
```

### Step 7: Access Application

```
http://<ALB-DNS-NAME>
```

---

## Demo Credentials

- **Admin**: admin@hospital.com / admin123
- **Doctor**: doctor@hospital.com / doctor123
- **Reception**: reception@hospital.com / reception123
- **Patient**: patient@hospital.com / patient123

---

## Advantages

✅ No server management
✅ Auto-scaling ready
✅ Load balancing included
✅ Container-based (modern approach)
✅ Easy to update (just push new image)
✅ Fargate free tier available

---

## Cost (Free Tier)

- **Fargate**: 750 hours/month free
- **ALB**: 750 hours/month free
- **RDS**: 750 hours/month free
- **Total**: ~$0/month

---

## Total Time: ~20 minutes

✅ Docker build & push: 5 minutes
✅ ECS setup: 10 minutes
✅ Database init: 1 minute
✅ Testing: 5 minutes

**Recommended for production!** 🚀
