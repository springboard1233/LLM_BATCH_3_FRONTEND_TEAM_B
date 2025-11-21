import express from 'express';
import Transaction from '../models/Transaction.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const {
      status,
      channel,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      minRisk,
      maxRisk,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (channel) filter.channel = channel;
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }
    if (minRisk || maxRisk) {
      filter.risk_score = {};
      if (minRisk) filter.risk_score.$gte = parseInt(minRisk);
      if (maxRisk) filter.risk_score.$lte = parseInt(maxRisk);
    }
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = end;
      }
    }

    const transactions = await Transaction.find(filter)
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const highRisk = await Transaction.countDocuments({ risk_score: { $gte: 70 } });
    const flagged = await Transaction.countDocuments({ status: 'flagged' });
    
    const riskStats = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          avgRisk: { $avg: '$risk_score' },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    res.json({
      totalTransactions,
      highRisk,
      flagged,
      avgRisk: riskStats[0]?.avgRisk || 0,
      totalAmount: riskStats[0]?.totalAmount || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
