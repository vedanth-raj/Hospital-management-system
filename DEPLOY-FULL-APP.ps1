# Hospital Management System - Full Deployment Script (Windows)
# This script deploys the app to your EC2 instance via Session Manager

param(
    [string]$InstanceId = "i-0d295865d91f1320e",
    [string]$Region = "us-east-1"
)

Write-Host "=========================================="
Write-Host "Hospital Management System - Full Deploy"
Write-Host "=========================================="
Write-Host ""

# Step 1: Check AWS CLI
Write-Host "Step 1: Checking AWS CLI..."
$awsVersion = aws --version
Write-Host "✓ AWS CLI: $awsVersion"
Write-Host ""

# Step 2: Create deployment commands
$deploymentCommands = @"
#!/bin/bash
set -e

echo "Updating system..."
sudo yum update -y
sudo yum install -y nodejs npm git

echo "Cloning repository..."
cd /home/ec2-user
rm -rf Hospital-management-system
git clone https://github.com/vedanth-raj/Hospital-management-system.git
cd Hospital-management-system

echo "Installing dependencies..."
npm install

echo "Creating environment file..."
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:HospitalDB2026Pass@hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432/hospital_db
NODE_ENV=production
EOF

echo "Building application..."
npm run build

echo "Installing PM2..."
sudo npm install -g pm2

echo "Starting application..."
pm2 start "npm start" --name "hospital-app"
pm2 startup
pm2 save

echo "✓ Deployment Complete!"
echo "Application running at: http://107.20.9.43:3000"
"@

# Step 3: Save commands to file
$deploymentCommands | Out-File -FilePath "deploy-commands.sh" -Encoding UTF8

Write-Host "Step 2: Deployment script created"
Write-Host ""

# Step 4: Instructions
Write-Host "=========================================="
Write-Host "DEPLOYMENT INSTRUCTIONS"
Write-Host "=========================================="
Write-Host ""
Write-Host "Option A: Using AWS Session Manager (Recommended - No SSH needed)"
Write-Host "1. Go to AWS Console > Systems Manager > Session Manager"
Write-Host "2. Click 'Start session'"
Write-Host "3. Select instance: i-0d295865d91f1320e"
Write-Host "4. Copy and paste the deployment script below:"
Write-Host ""
Write-Host "------- COPY FROM HERE -------"
Write-Host $deploymentCommands
Write-Host "------- COPY TO HERE -------"
Write-Host ""
Write-Host ""
Write-Host "Option B: Using SSH (if you have the PEM key)"
Write-Host "1. ssh -i hospital-app-key.pem ec2-user@107.20.9.43"
Write-Host "2. Paste the deployment script"
Write-Host ""
Write-Host ""
Write-Host "After deployment:"
Write-Host "✓ Access at: http://107.20.9.43:3000"
Write-Host "✓ Admin: admin@hospital.com / admin123"
Write-Host "✓ Doctor: doctor@hospital.com / doctor123"
Write-Host "✓ Reception: reception@hospital.com / reception123"
Write-Host "✓ Patient: patient@hospital.com / patient123"
Write-Host ""
