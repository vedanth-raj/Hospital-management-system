#!/bin/bash

# Hospital Management System - Quick Deploy to EC2 + CloudFront
# This script deploys the complete app with all features working

set -e

echo "=========================================="
echo "Hospital Management System"
echo "Quick Deploy to EC2 + CloudFront"
echo "=========================================="
echo ""

# Configuration
S3_BUCKET="hospital-app-static-vedanth"
CLOUDFRONT_ID="EH1TOQCO7EDZG"
EC2_IP="107.20.9.43"
DB_HOST="hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com"
DB_USER="postgres"
DB_PASS="HospitalDB2026Pass"
DB_NAME="hospital_db"

# Step 1: Update system
echo "Step 1: Updating system packages..."
sudo yum update -y
sudo yum install -y nodejs npm git curl

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
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://$EC2_IP:3000
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@$DB_HOST:5432/$DB_NAME
NODE_ENV=production
EOF

# Step 5: Build application
echo "Step 5: Building Next.js application..."
npm run build

# Step 6: Export static files
echo "Step 6: Exporting static files..."
mkdir -p dist-export
cp -r .next/static dist-export/
cp public/index.html dist-export/
cp public/app.html dist-export/
cp -r public/* dist-export/ 2>/dev/null || true

# Step 7: Upload to S3
echo "Step 7: Uploading to S3..."
aws s3 sync dist-export/ s3://$S3_BUCKET/ --delete --region us-east-1

# Step 8: Invalidate CloudFront
echo "Step 8: Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*" \
  --region us-east-1

# Step 9: Install PM2
echo "Step 9: Installing PM2 for process management..."
sudo npm install -g pm2

# Step 10: Start backend application
echo "Step 10: Starting backend application..."
pm2 start "npm start" --name "hospital-app"
pm2 startup
pm2 save

# Step 11: Initialize database
echo "Step 11: Initializing database..."
sleep 5
curl http://localhost:3000/api/init || true

# Step 12: Summary
echo ""
echo "=========================================="
echo "✓ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Frontend is now live at:"
echo "  https://dsf39o1myt7eb.cloudfront.net"
echo ""
echo "Backend API is running at:"
echo "  http://$EC2_IP:3000"
echo ""
echo "Demo Credentials:"
echo "  Admin: admin@hospital.com / admin123"
echo "  Doctor: doctor@hospital.com / doctor123"
echo "  Reception: reception@hospital.com / reception123"
echo "  Patient: patient@hospital.com / patient123"
echo ""
echo "Useful Commands:"
echo "  View logs: pm2 logs hospital-app"
echo "  Stop app: pm2 stop hospital-app"
echo "  Restart app: pm2 restart hospital-app"
echo "  Status: pm2 status"
echo ""
