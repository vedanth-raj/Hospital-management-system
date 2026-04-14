#!/bin/bash
set -e

# Update system
yum update -y
yum install -y git curl wget

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# Install PM2
npm install -g pm2

# Create app directory
mkdir -p /home/ec2-user/hospital-app
cd /home/ec2-user/hospital-app

# Clone repository
git clone https://github.com/vedanth-raj/Hospital-management-system.git .

# Install dependencies
npm ci

# Build Next.js app
npm run build

# Create production env file
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

# Start app with PM2
pm2 start npm --name "hospital-app" -- start
pm2 startup -u ec2-user --hp /home/ec2-user
pm2 save

# Setup Nginx as reverse proxy (optional but recommended)
yum install -y nginx
systemctl start nginx
systemctl enable nginx

# Create Nginx config
cat > /etc/nginx/conf.d/hospital-app.conf << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Reload Nginx
nginx -s reload

echo "Deployment complete! App running at http://54.242.171.2"
