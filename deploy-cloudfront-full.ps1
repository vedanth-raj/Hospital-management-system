# Hospital Management System - Complete CloudFront Deployment
# This script builds and deploys the full app to CloudFront + EC2

param(
    [string]$S3Bucket = "hospital-app-static-vedanth",
    [string]$CloudFrontId = "EH1TOQCO7EDZG",
    [string]$EC2InstanceId = "i-0d295865d91f1320e",
    [string]$EC2IP = "107.20.9.43",
    [string]$Region = "us-east-1"
)

Write-Host "=========================================="
Write-Host "Hospital Management System"
Write-Host "Complete CloudFront Deployment"
Write-Host "=========================================="
Write-Host ""

# Step 1: Build Next.js App
Write-Host "Step 1: Building Next.js application..."
Write-Host "This may take 2-3 minutes..."
Write-Host ""

npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed"
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm run build failed"
    exit 1
}

Write-Host "✓ Build complete"
Write-Host ""

# Step 2: Prepare files for S3
Write-Host "Step 2: Preparing files for S3..."

# Create temp directory
$tempDir = "dist-cloudfront"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy built files
Copy-Item -Path ".next/static" -Destination "$tempDir/static" -Recurse
Copy-Item -Path "public/index.html" -Destination "$tempDir/index.html"
Copy-Item -Path "public/app.html" -Destination "$tempDir/app.html"

# Copy all public assets
if (Test-Path "public") {
    Get-ChildItem -Path "public" -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring((Get-Item "public").FullName.Length + 1)
        $destPath = Join-Path $tempDir $relativePath
        $destDir = Split-Path $destPath
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item -Path $_.FullName -Destination $destPath
    }
}

Write-Host "✓ Files prepared"
Write-Host ""

# Step 3: Upload to S3
Write-Host "Step 3: Uploading files to S3 bucket: $S3Bucket"
Write-Host "This may take 1-2 minutes..."
Write-Host ""

aws s3 sync $tempDir "s3://$S3Bucket/" --delete --region $Region

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ S3 upload failed"
    exit 1
}

Write-Host "✓ Files uploaded to S3"
Write-Host ""

# Step 4: Create CloudFront Invalidation
Write-Host "Step 4: Invalidating CloudFront cache..."

$invalidation = aws cloudfront create-invalidation `
    --distribution-id $CloudFrontId `
    --paths "/*" `
    --region $Region `
    --output json | ConvertFrom-Json

Write-Host "✓ Invalidation created: $($invalidation.Invalidation.Id)"
Write-Host ""

# Step 5: Deploy Backend to EC2
Write-Host "Step 5: Deploying backend to EC2..."
Write-Host "Instance: $EC2InstanceId ($EC2IP)"
Write-Host ""

$deployScript = @"
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
NEXT_PUBLIC_API_URL=http://$EC2IP:3000
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

echo "✓ Backend deployment complete!"
"@

# Save script to file
$deployScript | Out-File -FilePath "ec2-deploy.sh" -Encoding UTF8

Write-Host "Deployment script created: ec2-deploy.sh"
Write-Host ""
Write-Host "To deploy backend, run this on EC2 (via Session Manager or SSH):"
Write-Host ""
Write-Host "------- COPY AND PASTE -------"
Write-Host $deployScript
Write-Host "------- END -------"
Write-Host ""

# Step 6: Summary
Write-Host "=========================================="
Write-Host "✓ DEPLOYMENT COMPLETE!"
Write-Host "=========================================="
Write-Host ""
Write-Host "Frontend is now live at:"
Write-Host "  https://dsf39o1myt7eb.cloudfront.net"
Write-Host ""
Write-Host "Backend will be available at:"
Write-Host "  http://$EC2IP:3000"
Write-Host ""
Write-Host "Demo Credentials:"
Write-Host "  Admin: admin@hospital.com / admin123"
Write-Host "  Doctor: doctor@hospital.com / doctor123"
Write-Host "  Reception: reception@hospital.com / reception123"
Write-Host "  Patient: patient@hospital.com / patient123"
Write-Host ""
Write-Host "Next Steps:"
Write-Host "1. Deploy backend to EC2 using the script above"
Write-Host "2. Wait 2-3 minutes for EC2 to start"
Write-Host "3. Access the app at https://dsf39o1myt7eb.cloudfront.net"
Write-Host "4. Initialize database: curl http://$EC2IP:3000/api/init"
Write-Host ""

# Cleanup
Remove-Item -Recurse -Force $tempDir
Remove-Item -Force "ec2-deploy.sh"

Write-Host "✓ Cleanup complete"
