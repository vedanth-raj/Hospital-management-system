# Deploy via AWS CodeDeploy (Fully Automated)

## Setup (10 minutes)

### Step 1: Create IAM Role for CodeDeploy

1. Go to **AWS Console → IAM → Roles**
2. Click **"Create role"**
3. Select **"AWS service"** → **"EC2"**
4. Click **"Next"**
5. Search for and select: **"AmazonSSMManagedInstanceCore"** and **"AmazonEC2RoleforAWSCodeDeploy"**
6. Click **"Next"** → **"Next"**
7. Name it: `CodeDeploy-EC2-Role`
8. Click **"Create role"**

### Step 2: Attach Role to EC2 Instance

1. Go to **AWS Console → EC2 → Instances**
2. Select your instance: `54.242.171.2`
3. Click **"Instance State"** → **"Security"** → **"Modify IAM instance profile"**
4. Select: `CodeDeploy-EC2-Role`
5. Click **"Update IAM instance profile"**
6. Wait 1-2 minutes

### Step 3: Install CodeDeploy Agent

Via Session Manager (see DEPLOY-VIA-SESSION-MANAGER.md for connection):

```bash
sudo su -
yum update -y
yum install -y ruby wget

cd /home/ec2-user
wget https://aws-codedeploy-${AWS_REGION}.s3.${AWS_REGION}.amazonaws.com/latest/install
chmod +x ./install
./install auto

systemctl start codedeploy-agent
systemctl enable codedeploy-agent
```

Replace `${AWS_REGION}` with `us-east-1`

### Step 4: Create CodeDeploy Application

1. Go to **AWS Console → CodeDeploy**
2. Click **"Create application"**
3. Name: `hospital-app`
4. Compute platform: **EC2/On-premises**
5. Click **"Create application"**

### Step 5: Create Deployment Group

1. Click **"Create deployment group"**
2. Name: `hospital-app-group`
3. Service role: Create new or select existing
4. Deployment type: **In-place**
5. Environment: Select your EC2 instance
6. Deployment configuration: **CodeDeployDefault.OneAtATime**
7. Click **"Create deployment group"**

### Step 6: Create appspec.yml

Add this file to your GitHub repo root:

```yaml
version: 0.0
os: linux
files:
  - source: /
    destination: /home/ec2-user/hospital-app
hooks:
  BeforeInstall:
    - location: scripts/before-install.sh
      timeout: 300
      runas: root
  ApplicationStart:
    - location: scripts/app-start.sh
      timeout: 300
      runas: ec2-user
  ApplicationStop:
    - location: scripts/app-stop.sh
      timeout: 300
      runas: ec2-user
```

### Step 7: Create Deployment Scripts

Create `scripts/` folder in repo with:

**scripts/before-install.sh:**
```bash
#!/bin/bash
set -e
yum update -y
yum install -y git curl wget
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs
npm install -g pm2
```

**scripts/app-stop.sh:**
```bash
#!/bin/bash
pm2 stop hospital-app || true
pm2 delete hospital-app || true
```

**scripts/app-start.sh:**
```bash
#!/bin/bash
set -e
cd /home/ec2-user/hospital-app
npm ci
npm run build

cat > .env.production << 'EOF'
NODE_ENV=production
DATABASE_URL=postgresql://postgres:HospitalDB2026Pass@hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432/hospital_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbHhl7nwjRjIZE0qiAX8FC577UqYfQby8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smart-hospital-managemen-d2fb0.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smart-hospital-managemen-d2fb0
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smart-hospital-managemen-d2fb0.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=718372719687
NEXT_PUBLIC_FIREBASE_APP_ID=1:718372719687:web:d0ae99aa3d9a0033e23562
EOF

pm2 start npm --name "hospital-app" -- start
pm2 save
```

### Step 8: Deploy

1. Go to **CodeDeploy → Applications → hospital-app**
2. Click **"Create deployment"**
3. Repository name: `Hospital-management-system`
4. Commit ID: Get from GitHub (latest commit hash)
5. Click **"Create deployment"**
6. Monitor deployment status

---

## Advantages

✅ Fully automated
✅ No manual SSH needed
✅ Automatic rollback on failure
✅ Deployment history
✅ Can trigger from GitHub webhooks
✅ Scales to multiple instances

---

## Total Time: ~20 minutes

✅ IAM Setup: 5 minutes
✅ CodeDeploy Setup: 10 minutes
✅ Deployment: 5 minutes

**Recommended for production!** 🚀
