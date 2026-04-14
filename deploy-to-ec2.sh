#!/bin/bash
set -e

echo "=== Hospital Management System - AWS Deployment ==="

# Update system
sudo yum update -y
sudo yum install -y git curl wget

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone or pull the repository
if [ ! -d "/home/ec2-user/hospital-app" ]; then
  cd /home/ec2-user
  git clone https://github.com/your-repo/Hospital-Management-System.git hospital-app
else
  cd /home/ec2-user/hospital-app
  git pull origin main
fi

cd /home/ec2-user/hospital-app

# Install dependencies
npm ci

# Build the app
npm run build

# Create .env.production
cat > .env.production << 'EOF'
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
EOF

# Start the app with PM2
pm2 start npm --name "hospital-app" -- start
pm2 startup
pm2 save

echo "=== Deployment Complete ==="
echo "App running at: http://54.242.171.2:3000"
