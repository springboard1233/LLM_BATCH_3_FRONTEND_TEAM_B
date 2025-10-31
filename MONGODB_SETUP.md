# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended - No Installation)

### Step 1: Create Free Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Choose the **FREE** M0 tier

### Step 2: Create Cluster
1. After login, click **"Build a Database"**
2. Choose **FREE** shared cluster
3. Select a cloud provider (AWS/Google/Azure)
4. Choose a region close to you
5. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Create Database User
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `fraudadmin` (or any name you want)
5. Password: Create a strong password (save it!)
6. User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist Your IP
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Or add your current IP for better security
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://fraudadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your .env File
1. Open `server/.env`
2. Replace `<password>` with your actual password
3. Add database name `/fraud-analysis` before the `?`:
   ```
   MONGODB_URI=mongodb+srv://fraudadmin:YourPassword123@cluster0.xxxxx.mongodb.net/fraud-analysis?retryWrites=true&w=majority
   ```

### Step 7: Test Connection
```bash
cd server
npm run dev
```

You should see: `✅ MongoDB Connected`

---

## Option 2: Local MongoDB Installation (Windows)

### Step 1: Download MongoDB
1. Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Select:
   - Version: Latest (7.0+)
   - Platform: Windows
   - Package: MSI
3. Click **"Download"**

### Step 2: Install MongoDB
1. Run the `.msi` installer
2. Choose **"Complete"** installation
3. **Important:** Check **"Install MongoDB as a Service"**
4. Check **"Install MongoDB Compass"** (optional GUI)
5. Click **"Install"**

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
mongod --version
```

If it shows version info, you're good!

### Step 4: Start MongoDB Service
```powershell
# Start service
net start MongoDB

# Or if installed differently:
mongod --dbpath C:\data\db
```

### Step 5: Update .env File
```
MONGODB_URI=mongodb://localhost:27017/fraud-analysis
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

### Step 6: Test Connection
```bash
cd server
npm run dev
```

---

## Quick Test Your Setup

Once MongoDB is running, test the backend:

```bash
cd server
npm run dev
```

**Expected output:**
```
Server running on port 5000
✅ MongoDB Connected
```

**Then test in browser:**
```
http://localhost:5000/api/health
```

Should return: `{"status":"ok","message":"Server is running"}`

---

## Troubleshooting

### Connection Error: "ECONNREFUSED"
- **Atlas:** Check your IP is whitelisted
- **Local:** Make sure MongoDB service is running

### Authentication Failed
- **Atlas:** Check username/password in connection string
- **Local:** Remove authentication if not configured

### Network Timeout
- **Atlas:** Check internet connection
- **Local:** Check if MongoDB service is running: `net start MongoDB`

### Can't Start MongoDB Service (Windows)
```powershell
# Create data directory
mkdir C:\data\db

# Start manually
mongod --dbpath C:\data\db
```

---

## Recommended: Use MongoDB Atlas

✅ No installation needed  
✅ Free 512MB storage  
✅ Works from anywhere  
✅ Automatic backups  
✅ Easy to scale  

For development, **MongoDB Atlas** is the easiest option!
