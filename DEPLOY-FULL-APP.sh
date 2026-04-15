#!/bin/bash

# Hospital Management System - Full Deployment Script
# Run this on your EC2 instance to deploy the complete application

set -e

echo "=========================================="
echo "Hospital Management System - Full Deploy"
echo "=========================================="

# Step 1: Update system
echo "Step 1: Updating system packages..."
sudo yum update -y
sudo yum install -y nodejs npm git

# Step 2: Clone repository
echo "Step 2: Cloning repository..."
cd /home/ec2-user
rm -rf Hospital-management-system
git clone https://github.com/vedanth-raj/Hospital-management-system.git
cd Hospital-management-system

# Step 3: Install dependencies
echo "Step 3: Installing dependencies..."
npm install

# Step 4: Create environment file
echo "Step 4: Creating environment configuration..."
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:HospitalDB2026Pass@hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432/hospital_db
NODE_ENV=production
EOF

# Step 5: Build the application
echo "Step 5: Building Next.js application..."
npm run build

# Step 6: Initialize database
echo "Step 6: Initializing database..."
npm start &
sleep 10
curl http://localhost:3000/api/init || true
pkill -f "npm start" || true

# Step 7: Start the application with PM2 (for persistence)
echo "Step 7: Installing PM2 for process management..."
sudo npm install -g pm2

echo "Step 8: Starting application with PM2..."
pm2 start "npm start" --name "hospital-app"
pm2 startup
pm2 save

echo ""
echo "=========================================="
echo "✓ Deployment Complete!"
echo "=========================================="
echo ""
echo "Application is running at: http://107.20.9.43:3000"
echo ""
echo "Demo Credentials:"
echo "  Admin: admin@hospital.com / admin123"
echo "  Doctor: doctor@hospital.com / doctor123"
echo "  Reception: reception@hospital.com / reception123"
echo "  Patient: patient@hospital.com / patient123"
echo ""
echo "To view logs: pm2 logs hospital-app"
echo "To stop app: pm2 stop hospital-app"
echo "To restart app: pm2 restart hospital-app"
echo ""
