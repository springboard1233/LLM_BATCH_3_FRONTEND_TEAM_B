import { useState, useEffect } from 'react';
import { transactionAPI } from '../lib/api';
import { RiskAnalysisCard } from '../components/RiskAnalysisCard';
import { RecommendationsPanel } from '../components/RecommendationsPanel';
import { TransactionFilters } from '../components/TransactionFilters';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionDetailsModal } from '../components/TransactionDetailsModal';
import type { Transaction } from '../lib/types';
import { Download, RefreshCw } from 'lucide-react';

export const DashboardPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    channel: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    minRisk: '',
    maxRisk: '',
  });

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};

      if (filters.status) params.status = filters.status;
      if (filters.channel) params.channel = filters.channel;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.minAmount) params.minAmount = filters.minAmount;
      if (filters.maxAmount) params.maxAmount = filters.maxAmount;
      if (filters.minRisk) params.minRisk = filters.minRisk;
      if (filters.maxRisk) params.maxRisk = filters.maxRisk;

      const { data } = await transactionAPI.getAll(params);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      channel: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      minRisk: '',
      maxRisk: '',
    });
  };

  const handleExport = () => {
    const csv = [
      ['Transaction ID', 'Timestamp', 'Channel', 'Amount', 'Status', 'Risk Score', 'Account ID', 'Location'].join(','),
      ...transactions.map(t => [
        t.transaction_id,
        t.timestamp,
        t.channel,
        t.amount,
        t.status,
        t.risk_score,
        t.account_id,
        t.location,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Transaction Surveillance Dashboard</h1>
        <p className="text-slate-400">Real-time fraud detection and risk analysis</p>
      </div>

      <RiskAnalysisCard />

      <RecommendationsPanel />

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Transaction Management</h2>
            <p className="text-slate-400 text-sm">
              Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadTransactions}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={transactions.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <TransactionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <TransactionTable
            transactions={transactions}
            loading={loading}
            onViewDetails={setSelectedTransaction}
            onFlagTransaction={(transaction) => {
              alert(`Transaction ${transaction.transaction_id} has been flagged for investigation.`);
            }}
          />
        </div>
      </div>

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onUpdate={loadTransactions}
        />
      )}
    </div>
  );
};
