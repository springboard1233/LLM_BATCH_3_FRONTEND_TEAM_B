import { Eye, Flag, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { Transaction } from '../lib/types';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  onViewDetails: (transaction: Transaction) => void;
  onFlagTransaction: (transaction: Transaction) => void;
}

export const TransactionTable = ({
  transactions,
  loading,
  onViewDetails,
  onFlagTransaction,
}: TransactionTableProps) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      flagged: 'bg-red-900/50 text-red-200 border-red-700',
      rejected: 'bg-red-900/50 text-red-200 border-red-700',
      completed: 'bg-green-900/50 text-green-200 border-green-700',
      pending: 'bg-yellow-900/50 text-yellow-200 border-yellow-700',
    };

    const icons = {
      flagged: <AlertTriangle className="w-3 h-3" />,
      rejected: <AlertTriangle className="w-3 h-3" />,
      completed: <CheckCircle2 className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-400">Loading transactions...</span>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
        <p className="text-slate-400">No transactions found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Channel
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Risk Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Account ID
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {transactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="hover:bg-slate-700/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-mono text-slate-300">
                  {transaction.transaction_id}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">
                  {formatDate(transaction.timestamp)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium">
                    {transaction.channel}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-white">
                  {formatAmount(transaction.amount, 'INR')}
                </td>
                <td className="px-4 py-3 text-sm">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          transaction.risk_score >= 80
                            ? 'bg-red-500'
                            : transaction.risk_score >= 50
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${transaction.risk_score}%` }}
                      />
                    </div>
                    <span className={`font-bold ${getRiskScoreColor(transaction.risk_score)}`}>
                      {transaction.risk_score}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-mono text-slate-400">
                  {transaction.account_id}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(transaction)}
                      className="p-1.5 hover:bg-slate-600 rounded transition-colors group"
                      title="View details"
                    >
                      <Eye className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </button>
                    <button
                      onClick={() => onFlagTransaction(transaction)}
                      className="p-1.5 hover:bg-slate-600 rounded transition-colors group"
                      title="Flag for investigation"
                    >
                      <Flag className="w-4 h-4 text-slate-400 group-hover:text-yellow-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
