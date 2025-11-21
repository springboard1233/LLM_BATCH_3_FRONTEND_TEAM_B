import { transactionAPI } from '../lib/api';

const SEED_SIZE = 5019;
const TARGET_FRAUD_COUNT = 432;
const FRAUD_RATE = TARGET_FRAUD_COUNT / SEED_SIZE;

const channels = ['Mobile', 'ATM', 'POS', 'Web'] as const;
const locations = [
  'Mumbai, Maharashtra',
  'Delhi, NCR',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
];

const accountIds = Array.from({ length: 500 }, (_, i) => `ACC${String(i + 1000).padStart(6, '0')}`);

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function generateTransactionId(index: number): string {
  return `TXN${String(index).padStart(8, '0')}`;
}

function generateTransaction(index: number, rand: () => number) {
  const isFraud = rand() < FRAUD_RATE;

  const baseRiskScore = isFraud ? 60 + Math.floor(rand() * 40) : Math.floor(rand() * 60);
  const riskScore = Math.min(100, Math.max(0, baseRiskScore));

  const channel = channels[Math.floor(rand() * channels.length)];

  let amount: number;
  if (isFraud) {
    amount = rand() < 0.5
      ? 5000 + rand() * 95000
      : 100000 + rand() * 400000;
  } else {
    amount = 500 + rand() * 49500;
  }

  const daysAgo = Math.floor(rand() * 90);
  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() - daysAgo);
  timestamp.setHours(Math.floor(rand() * 24), Math.floor(rand() * 60), Math.floor(rand() * 60));

  const deviceInfo = {
    type: channel === 'Mobile' || channel === 'Web' ? 'smartphone' : 'terminal',
    os: channel === 'Mobile' || channel === 'Web'
      ? rand() < 0.6 ? 'Android' : 'iOS'
      : 'embedded',
    browser: channel === 'Web' ? (rand() < 0.5 ? 'Chrome' : 'Safari') : null,
  };

  return {
    transaction_id: generateTransactionId(index),
    account_id: accountIds[Math.floor(rand() * accountIds.length)],
    timestamp: timestamp.toISOString(),
    channel,
    amount: Math.round(amount * 100) / 100,
    currency: 'INR',
    status: isFraud ? 'flagged' : (rand() < 0.1 ? 'pending' : 'completed'),
    risk_score: riskScore,
    location: locations[Math.floor(rand() * locations.length)],
    device_info: deviceInfo,
    metadata: {
      ip_address: `${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}`,
      session_id: `sess_${Math.random().toString(36).substr(2, 9)}`,
    },
  };
}

function generateRecommendations(rand: () => number) {
  const recommendations = [
    {
      title: 'Unusual activity detected on Account ACC001234',
      description: 'This account has shown 15 transactions in the last 24 hours, which is 300% above the normal pattern. Recommend immediate review and potential account freeze.',
      severity: 'high',
      confidence: 0.92,
      related_transaction_ids: ['TXN00000123', 'TXN00000456', 'TXN00000789'],
    },
    {
      title: 'Enable 2FA for high-risk user segments',
      description: 'Users with transaction patterns similar to flagged fraud cases should be required to enable two-factor authentication. This could reduce fraud incidents by an estimated 40%.',
      severity: 'medium',
      confidence: 0.85,
    },
    {
      title: 'Geographic anomaly in ATM transactions',
      description: 'Multiple accounts show transactions from geographically distant ATMs within short time windows. Recommend implementing velocity checks based on location.',
      severity: 'high',
      confidence: 0.88,
      related_transaction_ids: ['TXN00001234', 'TXN00001567'],
    },
    {
      title: 'Review mobile app security patches',
      description: 'Several fraudulent transactions originated from outdated mobile app versions. Consider forcing updates for versions older than 3 months.',
      severity: 'medium',
      confidence: 0.78,
    },
    {
      title: 'Suspicious POS merchant activity',
      description: 'Merchant ID M45678 has an unusually high fraud rate (23% vs industry average of 2%). Recommend investigation and possible merchant hold.',
      severity: 'high',
      confidence: 0.94,
      related_transaction_ids: ['TXN00002345', 'TXN00002678', 'TXN00002901'],
    },
  ];

  return recommendations.map(rec => ({
    ...rec,
    related_transaction_ids: rec.related_transaction_ids || [],
    acknowledged: rand() < 0.3,
  }));
}

export async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    const rand = seededRandom(42);

    console.log(`Generating ${SEED_SIZE} transactions (target ${TARGET_FRAUD_COUNT} fraud cases)...`);
    const transactions = Array.from({ length: SEED_SIZE }, (_, i) => generateTransaction(i + 1, rand));

    const fraudCount = transactions.filter(t => t.status === 'flagged').length;
    console.log(`Generated ${fraudCount} fraud transactions (${((fraudCount / SEED_SIZE) * 100).toFixed(1)}% fraud rate)`);

    console.log('Inserting transactions...');
    for (const transaction of transactions) {
      await transactionAPI.create(transaction);
    }

    console.log('Database seeding completed successfully!');
    console.log(`- Total transactions: ${SEED_SIZE}`);
    console.log(`- Fraud cases: ${fraudCount}`);
    console.log(`- Fraud rate: ${((fraudCount / SEED_SIZE) * 100).toFixed(1)}%`);

    return { success: true, fraudCount, totalCount: SEED_SIZE };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
