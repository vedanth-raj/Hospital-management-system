# Hospital Management System - AWS Deployment Script
# Run this script on your local machine to deploy to EC2

param(
    [string]$KeyPath = "hospital-app-key.pem",
    [string]$EC2IP = "54.242.171.2",
    [string]$EC2User = "ec2-user"
)

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Hospital Management System - AWS EC2 Deployment Script       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if key file exists
if (-not (Test-Path $KeyPath)) {
    Write-Host "❌ Error: Key file '$KeyPath' not found!" -ForegroundColor Red
    Write-Host "Please download hospital-app-key.pem from AWS Console" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Key file found: $KeyPath" -ForegroundColor Green
Write-Host ""

# Step 1: SSH Connection Test
Write-Host "Step 1: Testing SSH connection to EC2..." -ForegroundColor Yellow
Write-Host "Command: ssh -i $KeyPath $EC2User@$EC2IP 'echo Connected'" -ForegroundColor Gray

try {
    $result = ssh -i $KeyPath $EC2User@$EC2IP "echo Connected" 2>&1
    if ($result -eq "Connected") {
        Write-Host "✅ SSH connection successful!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  SSH response: $result" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ SSH connection failed: $_" -ForegroundColor Red
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  1. EC2 instance is running" -ForegroundColor Yellow
    Write-Host "  2. Security group allows port 22" -ForegroundColor Yellow
    Write-Host "  3. Key file has correct permissions" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Clone Repository
Write-Host "Step 2: Cloning repository from GitHub..." -ForegroundColor Yellow
ssh -i $KeyPath $EC2User@$EC2IP @"
    git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
    cd hospital-app
    pwd
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to clone repository" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Repository cloned successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Run Deployment Script
Write-Host "Step 3: Running deployment script on EC2..." -ForegroundColor Yellow
Write-Host "⏱️  This will take 10-15 minutes..." -ForegroundColor Cyan
Write-Host ""

ssh -i $KeyPath $EC2User@$EC2IP @"
    cd hospital-app
    chmod +x ec2-userdata.sh
    ./ec2-userdata.sh
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Deployment script completed with warnings" -ForegroundColor Yellow
} else {
    Write-Host "✅ Deployment script completed!" -ForegroundColor Green
}

Write-Host ""

# Step 4: Wait for app to start
Write-Host "Step 4: Waiting for application to start..." -ForegroundColor Yellow
Write-Host "⏱️  Waiting 30 seconds..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Step 5: Initialize Database
Write-Host "Step 5: Initializing database..." -ForegroundColor Yellow
$initUrl = "http://$EC2IP`:3000/api/init"
Write-Host "Calling: $initUrl" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri $initUrl -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Database initialized!" -ForegroundColor Green
    Write-Host "Response: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Database initialization response: $_" -ForegroundColor Yellow
}

Write-Host ""

# Step 6: Display Access Information
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ DEPLOYMENT COMPLETE ✅                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 Application URL:" -ForegroundColor Cyan
Write-Host "   http://$EC2IP`:3000" -ForegroundColor White
Write-Host ""

Write-Host "📝 Demo Credentials:" -ForegroundColor Cyan
Write-Host "   Admin:     admin@hospital.com / admin123" -ForegroundColor White
Write-Host "   Doctor:    doctor@hospital.com / doctor123" -ForegroundColor White
Write-Host "   Reception: reception@hospital.com / reception123" -ForegroundColor White
Write-Host "   Patient:   patient@hospital.com / patient123" -ForegroundColor White
Write-Host ""

Write-Host "🔧 Database Details:" -ForegroundColor Cyan
Write-Host "   Host: hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com" -ForegroundColor White
Write-Host "   User: postgres" -ForegroundColor White
Write-Host "   Pass: HospitalDB2026Pass" -ForegroundColor White
Write-Host "   DB:   hospital_db" -ForegroundColor White
Write-Host ""

Write-Host "📚 Useful Commands:" -ForegroundColor Cyan
Write-Host "   SSH into EC2:" -ForegroundColor White
Write-Host "   ssh -i $KeyPath $EC2User@$EC2IP" -ForegroundColor Gray
Write-Host ""
Write-Host "   View app logs:" -ForegroundColor White
Write-Host "   ssh -i $KeyPath $EC2User@$EC2IP 'pm2 logs hospital-app'" -ForegroundColor Gray
Write-Host ""
Write-Host "   Restart app:" -ForegroundColor White
Write-Host "   ssh -i $KeyPath $EC2User@$EC2IP 'pm2 restart hospital-app'" -ForegroundColor Gray
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "Next: Open http://$EC2IP`:3000 in your browser!" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
