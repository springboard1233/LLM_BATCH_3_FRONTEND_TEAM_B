# Project Structure: React + Node.js + MongoDB

## ✅ Tech Stack

### Frontend
- ✅ React.js 18.3
- ✅ TypeScript
- ✅ Vite (Build tool)
- ✅ TailwindCSS
- ✅ Axios (API calls)
- ✅ React Router

### Backend
- ✅ Node.js + Express
- ✅ MongoDB + Mongoose
- ✅ JWT authentication
- ✅ bcrypt (Password hashing)
```

## 📁 File Structure

```
project/
├── src/                       # Frontend
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   └── types.ts         # TypeScript types
│   ├── pages/
│   └── utils/
├── server/                    # Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js        # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js      # User model
│   │   │   └── Transaction.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── transaction.routes.js
│   │   │   └── profile.routes.js
│   │   ├── middleware/
│   │   │   └── auth.js      # JWT authentication
│   │   └── index.js         # Server entry point
│   ├── .env                  # Backend config
│   └── package.json
├── .env                       # Frontend config
└── package.json
```

## 🔄 API Integration

### Authentication Context (`src/contexts/AuthContext.tsx`)
```typescript
import { authAPI } from '../lib/api';
const { data } = await authAPI.login({ email, password });
```

### Transaction Loading
```typescript
import { transactionAPI } from '../lib/api';
const { data } = await transactionAPI.getAll(filters);
```

### Type Definitions
```typescript
import { Transaction, User } from '../lib/types';
```

## 🔐 Authentication Flow

1. User submits credentials
2. Backend validates with bcrypt
3. JWT generated with jsonwebtoken
4. Token stored in localStorage
5. Token sent in Authorization header

## 🗄️ Database Schema

### Users Collection
```javascript
{
  email: String,
  password: String (hashed),
  fullName: String,
  role: String (admin|analyst|viewer),
  createdAt: Date
}
```

### Transactions Collection
```javascript
{
  transaction_id: String,
  account_id: String,
  amount: Number,
  timestamp: Date,
  channel: String,
  location: String,
  status: String (pending|completed|flagged|rejected),
  risk_score: Number,
  metadata: Object
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Transactions
- `GET /api/transactions` - Get all (with filters)
- `GET /api/transactions/stats` - Get statistics
- `GET /api/transactions/:id` - Get single transaction
- `PATCH /api/transactions/:id` - Update transaction
- `POST /api/transactions` - Create transaction

### Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile

## 🎨 UI/UX

- ✅ **No visual changes** - All UI components maintained
- ✅ Same TailwindCSS styling
- ✅ Same component structure
- ✅ Same user experience

## 🚀 Deployment

### Frontend
- Build: `npm run build`
- Serves static files from `dist/`
- Can deploy to: Vercel, Netlify, GitHub Pages

### Backend
- Start: `npm start` (production) or `npm run dev` (development)
- Requires: Node.js runtime, MongoDB connection
- Can deploy to: Heroku, Railway, DigitalOcean, AWS

### Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```
MONGODB_URI=mongodb://localhost:27017/fraud-analysis
JWT_SECRET=your-secret-key-here
PORT=5000
```

## 📝 Setup Instructions

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Start MongoDB:**
   ```bash
   mongod
   ```

4. **Start backend server:**
   ```bash
   cd server
   npm run dev
   ```

5. **Start frontend:**
   ```bash
   npm run dev
   ```

## ✨ Benefits

1. ✅ **Full control** over backend logic
2. ✅ **No vendor lock-in**
3. ✅ **Customizable** authentication & authorization
4. ✅ **Better understanding** of full stack architecture
5. ✅ **Free hosting** options
6. ✅ **No usage limits** from third-party services
