#!/bin/bash
set -e
export PATH=$PATH:/usr/local/bin:/usr/bin
cd /home/ec2-user
rm -rf Hospital-management-system
git clone https://github.com/vedanth-raj/Hospital-management-system.git
cd Hospital-management-system
npm install
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://107.20.9.43:3000
DATABASE_URL=postgresql://postgres:HospitalDB2026Pass@hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com:5432/hospital_db
NODE_ENV=production
EOF
npm run build
mkdir -p dist-export
cp -r .next/static dist-export/
cp public/index.html dist-export/
cp public/app.html dist-export/
cp -r public/* dist-export/ 2>/dev/null || true
aws s3 sync dist-export/ s3://hospital-app-static-vedanth/ --delete --region us-east-1
aws cloudfront create-invalidation --distribution-id EH1TOQCO7EDZG --paths "/*" --region us-east-1
sudo npm install -g pm2
pm2 start "npm start" --name "hospital-app"
pm2 startup
pm2 save
sleep 5
curl http://localhost:3000/api/init || true
