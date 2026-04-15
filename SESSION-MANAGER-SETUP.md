# AWS Systems Manager Session Manager Setup - Step by Step

## Step 1: Create IAM Role (2 minutes)

### 1.1 Go to IAM Console
- Open AWS Console
- Search for **"IAM"**
- Click **"Roles"** in left sidebar

### 1.2 Create New Role
- Click **"Create role"**
- Select **"AWS service"**
- Choose **"EC2"**
- Click **"Next"**

### 1.3 Add Permissions
- Search for: **"AmazonSSMManagedInstanceCore"**
- Check the box next to it
- Click **"Next"**

### 1.4 Name the Role
- Role name: **`EC2-SSM-Role`**
- Click **"Create role"**

✅ **Role created!**

---

## Step 2: Attach Role to EC2 Instance (2 minutes)

### 2.1 Go to EC2 Console
- Search for **"EC2"**
- Click **"Instances"**

### 2.2 Select Your Instance
- Find instance: **`54.242.171.2`**
- Click to select it

### 2.3 Modify IAM Instance Profile
- Click **"Instance State"** (top right)
- Click **"Security"**
- Click **"Modify IAM instance profile"**

### 2.4 Select Role
- Dropdown: Select **`EC2-SSM-Role`**
- Click **"Update IAM instance profile"**

⏳ **Wait 1-2 minutes for role to attach**

---

## Step 3: Connect via Session Manager (1 minute)

### 3.1 Go to Systems Manager
- Search for **"Systems Manager"**
- Click **"Session Manager"** (left sidebar)

### 3.2 Start Session
- Click **"Start session"**
- Select your EC2 instance: **`54.242.171.2`**
- Click **"Start session"**

✅ **You now have a terminal!**

---

## Step 4: Deploy Application (15 minutes)

Once you have the terminal open in Session Manager, run these commands:

```bash
# Switch to ec2-user
sudo su - ec2-user

# Clone repository
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app

# Run deployment script
chmod +x ec2-userdata.sh
./ec2-userdata.sh

# Wait 10-15 minutes for build to complete
# You'll see: "Deployment complete! App running at http://54.242.171.2"
```

---

## Step 5: Initialize Database (1 minute)

In the same terminal:

```bash
curl http://localhost:3000/api/init
```

You should see: `{"success":true}`

---

## Step 6: Access Your Application (1 minute)

Open your browser and go to:

```
http://54.242.171.2:3000
```

### Demo Credentials:
- **Admin**: admin@hospital.com / admin123
- **Doctor**: doctor@hospital.com / doctor123
- **Reception**: reception@hospital.com / reception123
- **Patient**: patient@hospital.com / patient123

---

## Troubleshooting

### Session Manager not showing instance
**Solution:**
- Wait 2-3 minutes after attaching role
- Refresh the page
- Check instance is running (green status)

### "Unable to acquire credentials" error
**Solution:**
- Verify role is attached: EC2 → Instance → Security tab
- Wait 2-3 minutes for role to propagate
- Try again

### Build fails with "Cannot find module"
**Solution:**
- Check Node.js: `node -v` (should be v20+)
- Check npm: `npm -v`
- Check disk space: `df -h` (need at least 5GB)

### App won't start
**Solution:**
- Check PM2 status: `pm2 status`
- View logs: `pm2 logs hospital-app`
- Restart: `pm2 restart hospital-app`

### Database connection error
**Solution:**
- Check credentials in `.env.production`
- Verify RDS security group allows EC2 access
- Test connection: `psql -h hospital-db.c4ra6sksujdd.us-east-1.rds.amazonaws.com -U postgres -d hospital_db`

---

## Total Time: ~20 minutes

✅ IAM Setup: 2 minutes
✅ Attach Role: 2 minutes
✅ Connect: 1 minute
✅ Deployment: 15 minutes
✅ Database Init: 1 minute

---

## What's Happening

1. **IAM Role** - Gives EC2 permission to use Session Manager
2. **Session Manager** - Secure browser-based terminal (no SSH keys)
3. **Deployment Script** - Installs Node.js, builds app, starts with PM2
4. **Nginx** - Reverse proxy on port 80
5. **Next.js** - Running on port 3000 (proxied through Nginx)

---

## Architecture

```
Your Browser
    ↓
Session Manager (AWS Console)
    ↓
EC2 Instance (54.242.171.2)
    ↓
Nginx (port 80)
    ↓
Next.js App (port 3000)
    ↓
RDS Database
```

---

## Next Steps After Deployment

1. **Add CloudFront** (optional) for global CDN
2. **Setup SSL/HTTPS** with ACM certificate
3. **Configure auto-scaling** for multiple instances
4. **Setup monitoring** with CloudWatch

---

**Ready? Start with Step 1!** 🚀
