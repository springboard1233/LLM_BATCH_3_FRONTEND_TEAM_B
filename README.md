# Fraud Analysis System

A full-stack fraud detection and analysis platform built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB - **See [MONGODB_SETUP.md](./MONGODB_SETUP.md)** for setup
  - Recommended: MongoDB Atlas (free, no installation)
  - Alternative: Local MongoDB installation
- npm or yarn

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 2. Configure Environment

**Frontend - Create `.env` in root:**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend - Update `server/.env`:**
```
MONGODB_URI=mongodb://localhost:27017/fraud-analysis
JWT_SECRET=your-secret-key-here
PORT=5000
```

### 3. Setup MongoDB

**See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed instructions**

Quick option: Use MongoDB Atlas (free, cloud-based, no installation)

### 4. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
project/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── lib/               # API client & types
│   ├── pages/             # Page components
│   └── utils/             # Utility functions
├── server/                # Node.js backend
│   └── src/
│       ├── config/        # Database config
│       ├── models/        # Mongoose models
│       ├── routes/        # API routes
│       └── middleware/    # Auth middleware
```

## 🔐 Authentication

- JWT-based authentication
- Roles: Admin, Analyst, Viewer
- Protected routes on both frontend and backend

## 🎨 Features

- 📊 Real-time transaction monitoring
- 🔍 Fraud detection and risk scoring
- 📈 Analytics dashboard
- 👥 User management
- 🔒 Role-based access control

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS
- Axios
- React Router
- Recharts

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- CORS

## 📚 API Documentation

See [CONVERSION_NOTES.md](./CONVERSION_NOTES.md) for detailed API endpoints.

## 🧪 Development

```bash
# Run frontend in dev mode
npm run dev

# Build frontend for production
npm run build

# Run backend in dev mode
cd server && npm run dev

# Type check
npm run typecheck

# Lint code
npm run lint
```

## 🚢 Deployment

**Frontend:** Deploy `dist/` folder to Vercel, Netlify, or any static hosting

**Backend:** Deploy to Heroku, Railway, DigitalOcean, or AWS

## 📝 License

MIT
