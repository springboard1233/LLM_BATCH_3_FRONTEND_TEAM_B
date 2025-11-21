import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transaction_id: {
    type: String,
    required: true,
    unique: true,
  },
  account_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  channel: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'flagged', 'rejected'],
    default: 'pending',
  },
  risk_score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

export default mongoose.model('Transaction', transactionSchema);
