# Deploy via AWS Systems Manager (No SSH Needed)

## Setup (5 minutes)

### Step 1: Create IAM Role for EC2

1. Go to **AWS Console → IAM → Roles**
2. Click **"Create role"**
3. Select **"AWS service"** → **"EC2"**
4. Click **"Next"**
5. Search for and select: **"AmazonSSMManagedInstanceCore"**
6. Click **"Next"** → **"Next"**
7. Name it: `EC2-SSM-Role`
8. Click **"Create role"**

### Step 2: Attach Role to EC2 Instance

1. Go to **AWS Console → EC2 → Instances**
2. Select your instance: `54.242.171.2`
3. Click **"Instance State"** → **"Security"** → **"Modify IAM instance profile"**
4. Select: `EC2-SSM-Role`
5. Click **"Update IAM instance profile"**
6. Wait 1-2 minutes for role to attach

### Step 3: Connect via Session Manager

1. Go to **AWS Console → Systems Manager → Session Manager**
2. Click **"Start session"**
3. Select your EC2 instance
4. Click **"Start session"**
5. You now have a terminal! ✅

---

## Deploy Application (via Session Manager Terminal)

Once connected in Session Manager:

```bash
# Switch to ec2-user
sudo su - ec2-user

# Clone repository
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app

# Run deployment
chmod +x ec2-userdata.sh
./ec2-userdata.sh

# Wait 10-15 minutes for build to complete
```

---

## Initialize Database

```bash
curl http://localhost:3000/api/init
```

---

## Access Application

From your local machine:

```
http://54.242.171.2:3000
```

Or via EC2 public IP in browser.

---

## Demo Credentials

- **Admin**: admin@hospital.com / admin123
- **Doctor**: doctor@hospital.com / doctor123
- **Reception**: reception@hospital.com / reception123
- **Patient**: patient@hospital.com / patient123

---

## Advantages

✅ No SSH keys needed
✅ No port 22 to open
✅ Encrypted connection
✅ Audit trail in CloudTrail
✅ Works from AWS Console directly
✅ No firewall issues

---

## Troubleshooting

### Session Manager not showing instance
- Wait 2-3 minutes after attaching role
- Refresh the page
- Check instance is running

### "Unable to acquire credentials" error
- Verify role is attached: EC2 → Instance → Security tab
- Wait 2-3 minutes for role to propagate
- Try again

### Build fails
- Check Node.js: `node -v`
- Check npm: `npm -v`
- Check disk space: `df -h`

---

## Total Time: ~30 minutes

✅ IAM Setup: 5 minutes
✅ Deployment: 15 minutes
✅ Database Init: 1 minute
✅ Testing: 5 minutes

**Start with Step 1!** 🚀
