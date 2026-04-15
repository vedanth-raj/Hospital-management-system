# Manual Deployment Steps (AWS Console)

Since your IAM user doesn't have role creation permissions, follow these manual steps in AWS Console.

---

## Step 1: Create IAM Role (AWS Console - 3 minutes)

### 1.1 Go to IAM Console
1. Open AWS Console: https://console.aws.amazon.com/
2. Search for **"IAM"**
3. Click **"Roles"** in left sidebar

### 1.2 Create New Role
1. Click **"Create role"**
2. Select **"AWS service"**
3. Choose **"EC2"**
4. Click **"Next"**

### 1.3 Add Permissions
1. Search for: **"AmazonSSMManagedInstanceCore"**
2. ✅ Check the box
3. Click **"Next"**

### 1.4 Name the Role
1. Role name: **`EC2-SSM-Role`**
2. Click **"Create role"**

✅ **Role created!**

---

## Step 2: Create Instance Profile (AWS Console - 2 minutes)

### 2.1 Go to IAM Console
1. AWS Console → IAM → Roles
2. Search for: **`EC2-SSM-Role`**
3. Click on it

### 2.2 Create Instance Profile
1. Click **"Create instance profile"**
2. Name: **`EC2-SSM-Profile`**
3. Click **"Create instance profile"**

### 2.3 Add Role to Instance Profile
1. Go back to **`EC2-SSM-Role`**
2. Copy the role ARN (looks like: `arn:aws:iam::972803002725:role/EC2-SSM-Role`)

---

## Step 3: Attach Role to EC2 Instance (AWS Console - 2 minutes)

### 3.1 Go to EC2 Console
1. AWS Console → EC2 → Instances
2. Find instance: **`54.242.171.2`**
3. Click to select it

### 3.2 Modify IAM Instance Profile
1. Click **"Instance State"** (top right)
2. Click **"Security"**
3. Click **"Modify IAM instance profile"**

### 3.3 Select Role
1. Dropdown: Select **`EC2-SSM-Role`**
2. Click **"Update IAM instance profile"**

⏳ **Wait 1-2 minutes for role to attach**

✅ **Role attached!**

---

## Step 4: Connect via Session Manager (AWS Console - 1 minute)

### 4.1 Go to Systems Manager
1. AWS Console → Search for **"Systems Manager"**
2. Click **"Session Manager"** (left sidebar)

### 4.2 Start Session
1. Click **"Start session"**
2. Select your EC2 instance: **`54.242.171.2`**
3. Click **"Start session"**

✅ **Terminal opens in browser!**

---

## Step 5: Deploy Application (Terminal - 15 minutes)

Once you have the Session Manager terminal open, run these commands:

### 5.1 Switch to ec2-user
```bash
sudo su - ec2-user
```

### 5.2 Clone Repository
```bash
git clone https://github.com/vedanth-raj/Hospital-management-system.git hospital-app
cd hospital-app
```

### 5.3 Run Deployment
```bash
chmod +x ec2-userdata.sh
./ec2-userdata.sh
```

⏳ **Wait 10-15 minutes for build to complete**

You'll see: `Deployment complete! App running at http://54.242.171.2`

✅ **App deployed!**

---

## Step 6: Initialize Database (Terminal - 1 minute)

In the same terminal:

```bash
curl http://localhost:3000/api/init
```

Expected response: `{"success":true}`

✅ **Database initialized!**

---

## Step 7: Test Application (Browser - 1 minute)

1. Open your browser
2. Go to: `http://54.242.171.2:3000`
3. Login with:
   - Email: `admin@hospital.com`
   - Password: `admin123`

✅ **App is working!**

---

## Step 8: Add CloudFront (AWS Console - 10 minutes)

### 8.1 Go to CloudFront Console
1. AWS Console → Search for **"CloudFront"**
2. Click **"Distributions"**
3. Click **"Create distribution"**

### 8.2 Configure Origin
1. **Origin Domain**: `54.242.171.2`
2. **Protocol**: HTTP
3. **HTTP Port**: 80
4. **Origin Path**: (leave empty)

### 8.3 Configure Viewer Settings
1. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
2. **Allowed HTTP Methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE

### 8.4 Configure Cache Settings
1. **Cache Policy**: Managed-CachingDisabled
2. **Origin Request Policy**: AllViewerExceptHostHeader

### 8.5 Create Distribution
1. Click **"Create distribution"**
2. ⏳ Wait 5-10 minutes for deployment

### 8.6 Get Your CloudFront URL
1. CloudFront → Distributions
2. Wait for status: "Enabled"
3. Copy **Domain Name** (e.g., `d123abc456.cloudfront.net`)

✅ **CloudFront ready!**

---

## Step 9: Access via CloudFront (Browser - 1 minute)

1. Open browser
2. Go to: `https://d123abc456.cloudfront.net`
3. Login with demo credentials

✅ **Your app is live with HTTPS!**

---

## 🎉 Complete!

Your Hospital Management System is now deployed with:
- ✅ Session Manager (no SSH keys)
- ✅ CloudFront (`.cloudfront.net` link)
- ✅ HTTPS/SSL
- ✅ Global CDN

---

## Your URLs

| URL | Purpose |
|-----|---------|
| `http://54.242.171.2:3000` | Direct EC2 (no HTTPS) |
| `https://d123abc456.cloudfront.net` | ✅ CloudFront (HTTPS) |

---

## Demo Credentials

```
Admin: admin@hospital.com / admin123
Doctor: doctor@hospital.com / doctor123
Reception: reception@hospital.com / reception123
Patient: patient@hospital.com / patient123
```

---

## Total Time: ~30 minutes

- IAM Setup: 5 minutes
- Deploy App: 15 minutes
- Initialize DB: 1 minute
- Add CloudFront: 10 minutes

---

## Troubleshooting

### Session Manager not showing instance
- Wait 2-3 minutes after attaching role
- Refresh the page
- Check instance is running

### Build fails
- Check Node.js: `node -v`
- Check npm: `npm -v`
- Check disk space: `df -h`

### CloudFront shows 502 error
- Wait 5-10 minutes for full deployment
- Verify EC2 instance is running
- Check Nginx: `sudo systemctl status nginx`

---

**Ready? Start with Step 1 in AWS Console!** 🚀
