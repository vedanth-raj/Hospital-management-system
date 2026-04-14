#!/bin/bash

# Hospital Management System - AWS Deployment Script
# Run this script on your local machine to deploy to EC2

set -e

# Configuration
KEY_PATH="${1:-hospital-app-key.pem}"
EC2_IP="${2:-54.242.171.2}"
EC2_USER="${3:-ec2-user}"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Hospital Management System - AWS EC2 Deployment Script       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if key file exists
if [ ! -f "$KEY_PATH" ]; then
    echo "❌ Error: Key file '$KEY_PATH' not found!"
    echo "Please download hospital-app-key.pem from AWS Console"
    exit 1
fi

echo "✅ Key file found: $KEY_PATH"
echo ""

# Set correct permissions on key
chmod 400 "$KEY_PATH"
echo "✅ Key permissions set to 400"
echo ""

# Step 1: SSH Connection Test
echo "Step 1: Testing SSH connection to EC2..."
echo "Command: ssh -i $KEY_PATH $EC2_USER@$EC2_IP 'echo Connected'"
echo ""

if ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$EC2_USER@$EC2_IP" "echo Connected"; then
    echo "✅ SSH connection successful!"
else
    echo "❌ SSH connection failed!"
    echo "Make sure:"
    echo "  1. EC2 instance is running"
    echo "  2. Security group allows port 22"
    echo "  3. Key file has correct permissions"
    exit 1
fi

echo ""

# Step 2: Clone Repository
echo "Step 2: Cloning repository from GitHub..."
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_IP" << 'EOF'
    git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
    cd hospital-app
    pwd
EOF

echo "✅ Repository cloned successfully!"
echo ""

# Step 3: Run Deployment Script
echo "Step 3: Running deployment script on EC2..."
echo "⏱️  This will take 10-15 minutes..."
echo ""

ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_IP" << 'EOF'
    cd hospital-app
    chmod +x ec2-userdata.sh
    ./ec2-userdata.sh
EOF

echo "✅ Deployment script completed!"
echo ""

# Step 4: Wait for app to start
echo "Step 4: Waiting for application to start..."
echo "⏱️  Waiting 30 seconds..."
sleep 30

# Step 5: Initialize Database
echo "Step 5: Initializing database..."
INIT_URL="http://$EC2_IP:3000/api/init"
echo "Calling: $INIT_URL"
echo ""

if curl -s -o /dev/null -w "%{http_code}" "$INIT_URL" | grep -q "200"; then
    echo "✅ Database initialized!"
else
    echo "⚠️  Database initialization in progress..."
fi

echo ""

# Step 6: Display Access Information
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              ✅ DEPLOYMENT COMPLETE ✅                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "🌐 Application URL:"
echo "   http://$EC2_IP:3000"
echo ""

echo "📝 Demo Credentials:"
echo "   Admin:     admin@hospital.com / admin123"
echo "   Doctor:    doctor@hospital.com / doctor123"
echo "   Reception: reception@hospital.com / reception123"
echo "   Patient:   patient@hospital.com / patient123"
echo ""

echo "🔧 Database Details:"
echo "   Host: hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com"
echo "   User: postgres"
echo "   Pass: HospitalDB2026Pass"
echo "   DB:   hospital_db"
echo ""

echo "📚 Useful Commands:"
echo "   SSH into EC2:"
echo "   ssh -i $KEY_PATH $EC2_USER@$EC2_IP"
echo ""
echo "   View app logs:"
echo "   ssh -i $KEY_PATH $EC2_USER@$EC2_IP 'pm2 logs hospital-app'"
echo ""
echo "   Restart app:"
echo "   ssh -i $KEY_PATH $EC2_USER@$EC2_IP 'pm2 restart hospital-app'"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "Next: Open http://$EC2_IP:3000 in your browser!"
echo "═══════════════════════════════════════════════════════════════"
