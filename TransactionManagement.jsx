import React, { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { apiService } from './src/services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const PAGE_SIZE = 15;
const MAX_RESULTS = 200; // safety cap to avoid loading too much in UI

// Generate mock transactions with fraud cases
const generateMockTransactions = (page, limit) => {
  const startIndex = (page - 1) * limit;
  const mockData = [];
  
  for (let i = 0; i < limit; i++) {
    const index = startIndex + i;
    // Ensure consistent fraud rate - every 3rd transaction is fraud
    const isFraud = (index % 3) === 0; // 33% fraud rate
    const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    
    mockData.push({
      transaction_id: `TXN${String(index + 1).padStart(6, '0')}`,
      customer_id: `CUST${String(Math.floor(Math.random() * 1000) + 1).padStart(4, '0')}`,
      transaction_amount: parseFloat((Math.random() * 10000 + 100).toFixed(2)),
      channel: ['mobile', 'web', 'atm', 'pos'][Math.floor(Math.random() * 4)],
      is_fraud: isFraud,
      status: isFraud ? 'fraud' : ['completed', 'pending'][Math.floor(Math.random() * 2)],
      risk_score: isFraud ? Math.random() * 0.4 + 0.6 : Math.random() * 0.4,
      timestamp: timestamp,
      ml_reason: isFraud && Math.random() > 0.5 ? 'Anomalous pattern detected' : null,
      rule_reasons: isFraud && Math.random() > 0.3 ? ['High amount', 'Unusual location'] : [],
    });
  }
  
  console.log('Generated mock data:', { 
    total: mockData.length, 
    fraudCount: mockData.filter(t => t.is_fraud === true).length,
    sample: mockData[0]
  });
  
  return { data: mockData };
};

const TransactionManagement = ({ theme = 'dark' }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [detailsModalTxn, setDetailsModalTxn] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination state (client-side view)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFetched, setTotalFetched] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [lastFetchedPage, setLastFetchedPage] = useState(0);

  const isDark = theme === 'dark';

  // initial + incremental fetch
  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPage = async (page) => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiService.getPredictionHistory(page, PAGE_SIZE);

      const raw =
        res?.items ||
        res?.transactions ||
        res?.data ||
        res ||
        [];

      const normalized = Array.isArray(raw)
        ? raw.map(normalizeTransaction)
        : [];

      const fraudInBatch = normalized.filter(t => t.isFraud === true).length;
      console.log('Fetched prediction history:', { 
        page, 
        count: normalized.length, 
        fraudCount: fraudInBatch,
        sampleTransaction: normalized[0],
        rawSample: raw[0]
      });

      setTransactions((prev) => {
        if (page === 1) {
          return normalized.slice(0, MAX_RESULTS);
        }

        const existingIds = new Set(prev.map((txn) => txn.id));
        const merged = [...prev];
        normalized.forEach((txn) => {
          if (!existingIds.has(txn.id)) {
            merged.push(txn);
            existingIds.add(txn.id);
          }
        });
        return merged.slice(0, MAX_RESULTS);
      });

      setTotalFetched((prev) => {
        if (page === 1) return normalized.length;
        return Math.min(MAX_RESULTS, prev + normalized.length);
      });

      setHasMorePages(Boolean(res?.has_next));
      setLastFetchedPage(page);

    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to load prediction history, showing sample data.');

      // Use mock data as final fallback
      const mockRes = generateMockTransactions(page, PAGE_SIZE);
      const mockRaw = mockRes?.data || [];
      const normalized = Array.isArray(mockRaw) ? mockRaw.map(normalizeTransaction) : [];
      setTransactions((prev) => {
        if (page === 1) return normalized;
        return [...prev, ...normalized].slice(0, MAX_RESULTS);
      });
      setTotalFetched((prev) => {
        if (page === 1) return normalized.length;
        return Math.min(MAX_RESULTS, prev + normalized.length);
      });
      setHasMorePages(false);
      setLastFetchedPage(page);
    } finally {
      setLoading(false);
    }
  };

  // --- Normalize backend transaction object into UI shape ---
  const normalizeTransaction = (t) => {
    const id = t.id || t.transaction_id || t._id || 'UNKNOWN';
    const customerId = t.customer_id || t.customerId || 'N/A';
    const amount =
      t.amount ?? t.transaction_amount ?? t.txn_amount ?? 0;
    const channel = (t.channel || t.txn_channel || 'unknown').toLowerCase();

    // Check for fraud status - prioritize is_fraud boolean field
    let isFraud = false;
    if (typeof t.is_fraud === 'boolean') {
      isFraud = t.is_fraud;
    } else if (typeof t.isFraud === 'boolean') {
      isFraud = t.isFraud;
    } else if (t.status === 'flagged' || t.status === 'fraud') {
      isFraud = true;
    }

    const status =
      t.status || (isFraud ? 'fraud' : 'completed');

    const riskScore =
      typeof t.risk_score === 'number'
        ? t.risk_score
        : typeof t.riskScore === 'number'
        ? t.riskScore
        : 0;

    const timestamp =
      t.timestamp || t.created_at || t.processed_at || 'N/A';

    const type = t.type || t.txn_type || 'transaction';

    // extra metadata from API if present
    const mlReason = t.ml_reason || null;
    const ruleReasons = Array.isArray(t.rule_reasons) ? t.rule_reasons : [];
    const explanation = t.explanation || null;

    return {
      id,
      customerId,
      amount,
      status,
      type,
      timestamp,
      channel,
      riskScore,
      isFraud,
      mlReason,
      ruleReasons,
      explanation,
    };
  };

  // --- Apply search + status filter ---
  useEffect(() => {
    let data = [...transactions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (txn) =>
          txn.id.toLowerCase().includes(term) ||
          txn.customerId.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== 'all') {
      data = data.filter((txn) => {
        if (filterStatus === 'fraud') {
          return txn.isFraud === true;
        }
        if (filterStatus === 'completed' || filterStatus === 'pending' || filterStatus === 'flagged') {
          return txn.status === filterStatus;
        }
        return false;
      });
    }

    console.log('Filter applied:', { filterStatus, totalTransactions: transactions.length, filteredCount: data.length, fraudCount: data.filter(t => t.isFraud).length });
    setFilteredTransactions(data);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, transactions]);

  // --- Derived stats for cards + charts ---
  const totalCount = filteredTransactions.length;
  const fraudCount = filteredTransactions.filter((t) => t.isFraud).length;
  const legitCount = totalCount - fraudCount;

  const avgAmount =
    totalCount > 0
      ? filteredTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) /
        totalCount
      : 0;

  const avgRisk =
    totalCount > 0
      ? filteredTransactions.reduce((sum, t) => sum + (Number(t.riskScore) || 0), 0) /
        totalCount
      : 0;

  const fraudVsLegitData = [
    { label: 'Fraud', value: fraudCount },
    { label: 'Legit', value: legitCount },
  ];

  const channelCounts = filteredTransactions.reduce((acc, t) => {
    const ch = t.channel || 'unknown';
    acc[ch] = (acc[ch] || 0) + 1;
    return acc;
  }, {});
  const channelData = Object.entries(channelCounts).map(([channel, count]) => ({
    channel,
    count,
  }));

  // --- client-side pagination of filtered list ---
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const pageSlice = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleNext = async () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    } else if (hasMorePages) {
      const nextServerPage = lastFetchedPage + 1;
      await fetchPage(nextServerPage);
      setCurrentPage((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleSelectTransaction = (id) => {
    setSelectedTransactions((prev) =>
      prev.includes(id)
        ? prev.filter((txnId) => txnId !== id)
        : [...prev, id]
    );
  };

  const getStatusChipClass = (status, isFraud) => {
    if (isFraud) {
      return 'bg-red-500/10 text-red-300 border border-red-500/40';
    }
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40';
      case 'flagged':
        return 'bg-orange-500/10 text-orange-300 border border-orange-500/40';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/40';
      default:
        return 'bg-white/5 text-gray-200 border border-white/10';
    }
  };

  const getRiskBg = (score) => {
    if (score < 0.3) return 'bg-emerald-500/10 border-emerald-500/40';
    if (score < 0.7) return 'bg-yellow-500/10 border-yellow-500/40';
    return 'bg-red-500/10 border-red-500/40';
  };

  const getRiskText = (score) => {
    if (score < 0.3) return 'text-emerald-300';
    if (score < 0.7) return 'text-yellow-300';
    return 'text-red-300';
  };

  const exportToCsv = () => {
    if (!filteredTransactions.length) return;

    const header = [
      'Transaction ID',
      'Customer ID',
      'Amount',
      'Channel',
      'Status',
      'Is Fraud',
      'Risk Score',
      'Timestamp',
    ];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.customerId,
      t.amount,
      t.channel,
      t.status,
      t.isFraud ? 'Fraud' : 'Legit',
      t.riskScore,
      t.timestamp,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (loading && transactions.length === 0) {
    return (
      <div className={`rounded-2xl p-6 backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded-lg" />
          <div className="h-10 bg-white/5 rounded-lg" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-2xl p-6 backdrop-blur-lg border ${isDark ? 'bg-black/30 border-red-500/40' : 'bg-red-50 border-red-300'}`}>
        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
          Failed to load transactions
        </h3>
        <p className={`text-sm ${isDark ? 'text-red-200/80' : 'text-red-600'}`}>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + controls + metrics */}
      <div className={`rounded-2xl p-6 backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Transaction Management
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1`}>
              Explore, filter and export up to 100 recent transactions processed by the fraud engine.
            </p>
          </div>

          {/* key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <MetricPill
              label="Total"
              value={totalCount}
              isDark={isDark}
            />
            <MetricPill
              label="Fraud"
              value={fraudCount}
              accent="red"
              isDark={isDark}
            />
            <MetricPill
              label="Avg Amount"
              value={`₹${Math.round(avgAmount).toLocaleString()}`}
              isDark={isDark}
            />
            <MetricPill
              label="Avg Risk"
              value={`${(avgRisk * 100).toFixed(1)}%`}
              isDark={isDark}
            />
          </div>
        </div>

        {/* filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Transaction ID or Customer ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-lg pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`flex-1 rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="flagged">Flagged</option>
              <option value="fraud">Fraud</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Export */}
          <button
            type="button"
            onClick={exportToCsv}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fraud vs Legit */}
          <div className={`${isDark ? 'bg-black/40' : 'bg-gray-50'} border border-white/10 rounded-xl p-4`}>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm mb-2`}>
              Fraud vs Legit (filtered)
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fraudVsLegitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff22' : '#00000011'} />
                  <XAxis dataKey="label" stroke={isDark ? '#e5e7eb' : '#374151'} />
                  <YAxis allowDecimals={false} stroke={isDark ? '#e5e7eb' : '#374151'} />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#020617' : '#ffffff',
                      border: '1px solid rgba(148, 163, 184, 0.5)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions by Channel */}
          <div className={`${isDark ? 'bg-black/40' : 'bg-gray-50'} border border-white/10 rounded-xl p-4`}>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm mb-2`}>
              Transactions by Channel (filtered)
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff22' : '#00000011'} />
                  <XAxis dataKey="channel" stroke={isDark ? '#e5e7eb' : '#374151'} />
                  <YAxis allowDecimals={false} stroke={isDark ? '#e5e7eb' : '#374151'} />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#020617' : '#ffffff',
                      border: '1px solid rgba(148, 163, 184, 0.5)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl p-0 overflow-hidden backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead
              className={`text-xs uppercase tracking-wide border-b ${
                isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              <tr>
                <th className="px-6 py-3"></th>
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">Customer ID</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Channel</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Risk Score</th>
                <th className="px-6 py-3">Flags</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3 text-right">LLM Reasons</th>
              </tr>
            </thead>
            <tbody>
              {pageSlice.map((txn) => (
                <tr
                  key={txn.id}
                  className={`border-b ${
                    isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(txn.id)}
                      onChange={() => handleSelectTransaction(txn.id)}
                      className="rounded bg-black/40 border-white/30"
                    />
                  </td>
                  <td className="px-6 py-3 font-mono text-xs">
                    {txn.id}
                  </td>
                  <td className="px-6 py-3">
                    {txn.customerId}
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    ₹{Number(txn.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 capitalize">
                    {txn.channel}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusChipClass(
                        txn.status,
                        txn.isFraud
                      )}`}
                    >
                      {txn.isFraud ? 'Fraud' : txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full border text-xs font-semibold ${getRiskBg(
                        txn.riskScore
                      )} ${getRiskText(txn.riskScore)}`}
                    >
                      {(txn.riskScore * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs">
                    {txn.mlReason && (
                      <span className="block text-emerald-300">
                        ML
                      </span>
                    )}
                    {txn.ruleReasons && txn.ruleReasons.length > 0 && (
                      <span className="block text-amber-300">
                        Rules ({txn.ruleReasons.length})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-400">
                    {txn.timestamp}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      type="button"
                      onClick={() => setDetailsModalTxn(txn)}
                      disabled={!txn.explanation && (!txn.ruleReasons || txn.ruleReasons.length === 0)}
                      className={`text-xs px-3 py-1 rounded-full border transition ${
                        txn.explanation || (txn.ruleReasons && txn.ruleReasons.length)
                          ? 'border-emerald-400 text-emerald-200 hover:bg-emerald-400/10'
                          : 'border-gray-600 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      View Reason
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageSlice.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No transactions found for the current filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={handlePrev}
          className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-gray-300 text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={!hasMorePages && currentPage === totalPages}
          onClick={handleNext}
          className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {detailsModalTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className={`max-w-2xl w-full rounded-2xl p-6 relative border ${isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            <button
              className="absolute top-4 right-4 text-sm text-gray-400 hover:text-gray-200"
              onClick={() => setDetailsModalTxn(null)}
            >
              Close
            </button>
            <h3 className="text-xl font-semibold mb-2">AI Explanation</h3>
            <p className="text-sm text-gray-400 mb-4">Transaction {detailsModalTxn.id}</p>

            {detailsModalTxn.explanation ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed mb-4">{detailsModalTxn.explanation}</p>
            ) : (
              <p className="text-sm text-gray-400 mb-4">No LLM explanation stored.</p>
            )}

            {detailsModalTxn.ruleReasons && detailsModalTxn.ruleReasons.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Rule Triggers</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                  {detailsModalTxn.ruleReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400"
                onClick={() => setDetailsModalTxn(null)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricPill = ({ label, value, accent, isDark }) => {
  const colorClass =
    accent === 'red'
      ? isDark
        ? 'text-red-300'
        : 'text-red-600'
      : isDark
      ? 'text-emerald-300'
      : 'text-emerald-600';

  return (
    <div
      className={`px-3 py-2 rounded-lg border text-xs ${
        isDark ? 'border-white/10 bg-black/40 text-gray-200' : 'border-gray-200 bg-white text-gray-800'
      }`}
    >
      <p className="uppercase tracking-wide text-[10px] opacity-70">
        {label}
      </p>
      <p className={`mt-1 font-semibold ${colorClass}`}>{value}</p>
    </div>
  );
};

export default TransactionManagement;
