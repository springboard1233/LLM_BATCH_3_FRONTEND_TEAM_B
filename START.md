# 🚀 Quick Start Guide

## ✅ Prerequisites

Before starting, make sure you have:
- ✅ Node.js (v18+) installed
- ✅ MongoDB installed and running
- ✅ npm installed

## 📦 Step 1: Dependencies Already Installed ✓

The dependencies have been installed for you:
- ✅ Frontend dependencies (axios, react, etc.)
- ✅ Backend dependencies (express, mongoose, etc.)
- ✅ Environment files created

## 🗄️ Step 2: Start MongoDB

Make sure MongoDB is running. Open a new terminal and run:

```bash
mongod
```

Or if MongoDB is installed as a service, it should already be running.

## 🎮 Step 3: Start the Application

### Option A: Run both servers (Recommended - 2 terminals)

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```

You should see:
```
VITE vX.X.X  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Option B: Using npm scripts from root

**Terminal 1:**
```bash
npm run server:dev
```

**Terminal 2:**
```bash
npm run dev
```

## 🌐 Step 4: Access the Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the login page

## 👤 Step 5: Create Your Account

1. Click **"Register"** or **"Don't have an account? Register"**
2. Fill in:
   - Full Name: `Your Name`
   - Email: `your@email.com`
   - Password: `password123` (or any password)
3. Click **"Create Account"**
4. You'll be automatically logged in and redirected to the dashboard

## 📊 Step 6: Add Sample Data (Optional)

Once on the dashboard:
1. Click the **"Seed Data"** button in the top navigation
2. Confirm when prompted
3. Wait for the seeding to complete
4. The page will refresh with sample transactions

## ✨ You're All Set!

You now have a fully functional fraud detection dashboard with:
- ✅ User authentication
- ✅ Transaction monitoring
- ✅ Risk analysis
- ✅ Real-time filtering
- ✅ CSV export

## 🔧 Configuration Files

The following files have been pre-configured:

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fraud-analysis
JWT_SECRET=your-secret-key-change-this-in-production-123456789
NODE_ENV=development
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
✗ MongoDB connection error
```
**Solution:** Make sure MongoDB is running (`mongod`)

### Port 5173 Already in Use
```
Port 5173 is already in use
```
**Solution:** Stop other Vite servers or change the port in vite.config.ts

### Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change `PORT=5001` in server/.env

### Can't Login
**Solution:** 
1. Clear browser localStorage (F12 > Application > Local Storage > Clear)
2. Make sure backend is running
3. Check browser console for errors

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Customize the application for your needs
- Deploy to production

## 🎉 Enjoy!

Your fraud detection platform is ready to use!
