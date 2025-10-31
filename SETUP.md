# Quick Setup Guide

## Installation Steps

### 1. Install Dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install
cd ..
```

### 2. Setup MongoDB

Make sure MongoDB is installed and running on your machine. Download from: https://www.mongodb.com/try/download/community

Start MongoDB:
```bash
mongod
```

### 3. Configure Environment Variables

#### Frontend Environment (.env)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend Environment (server/.env)
Create a `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fraud-analysis
JWT_SECRET=change-this-to-a-secure-random-string
NODE_ENV=development
```

### 4. Start the Application

#### Terminal 1 - Start Backend
```bash
cd server
npm run dev
```

#### Terminal 2 - Start Frontend
```bash
npm run dev
```

### 5. Access the Application

Open your browser and navigate to: http://localhost:5173

### 6. Register and Login

1. Click "Register" to create a new account
2. Fill in your details
3. Login with your credentials
4. You'll be redirected to the dashboard

### 7. Seed Sample Data (Optional)

Once logged in, click the "Seed Data" button in the navigation bar to populate the database with sample transactions.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check if the MONGODB_URI in server/.env is correct

### Port Already in Use
- Frontend (5173): Change Vite port in vite.config.ts
- Backend (5000): Change PORT in server/.env

### Authentication Errors
- Clear browser localStorage
- Check that JWT_SECRET is set in server/.env

## Project Structure

```
project/
├── src/                    # Frontend React source
│   ├── components/         # React components
│   ├── contexts/           # Auth context
│   ├── lib/                # API client & types
│   ├── pages/              # Page components
│   └── utils/              # Utilities
├── server/                 # Backend Node.js source
│   └── src/
│       ├── config/         # Database config
│       ├── models/         # Mongoose models
│       ├── routes/         # API routes
│       ├── middleware/     # Auth middleware
│       └── index.js        # Server entry
└── README.md              # Full documentation
```

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt
- **Build Tools**: Vite

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the JWT secret in production
- Set up environment-specific configurations
- Deploy to your preferred hosting platform
