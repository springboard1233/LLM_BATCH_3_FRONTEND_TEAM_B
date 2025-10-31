export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'analyst' | 'viewer';
  createdAt?: string;
}

export interface Transaction {
  _id: string;
  transaction_id: string;
  account_id: string;
  amount: number;
  timestamp: string;
  channel: string;
  location: string;
  status: 'pending' | 'completed' | 'flagged' | 'rejected';
  risk_score: number;
  metadata?: Record<string, any>;
}

export interface TransactionStats {
  totalTransactions: number;
  highRisk: number;
  flagged: number;
  avgRisk: number;
  totalAmount: number;
}

export interface Profile extends User {}
