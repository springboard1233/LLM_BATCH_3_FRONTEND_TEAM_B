import { useState } from 'react';
import { Eye, Flag, AlertTriangle, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { Transaction } from '../lib/types';
import useResponsive from '../hooks/useResponsive';

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
  const { isMobile } = useResponsive();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (transactionId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

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

  // Mobile Card View
  if (isMobile) {
    return (
      <div className="space-y-4">
        {transactions.map((transaction) => {
          const isExpanded = expandedCards.has(transaction._id);
          
          return (
            <div
              key={transaction._id}
              className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden active:scale-[0.98] transition-transform"
            >
              {/* Card Header - Always Visible */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-1">Transaction ID</p>
                    <p className="text-sm font-mono text-slate-300 truncate">
                      {transaction.transaction_id}
                    </p>
                  </div>
                  <div className="ml-2">
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>

                {/* Key Information */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Amount</span>
                    <span className="text-base font-semibold text-white">
                      {formatAmount(transaction.amount, 'INR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Risk Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
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
                      <span className={`text-sm font-bold ${getRiskScoreColor(transaction.risk_score)}`}>
                        {transaction.risk_score}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Channel</span>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium">
                      {transaction.channel}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="space-y-2 pt-3 border-t border-slate-700">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-400">Timestamp</span>
                      <span className="text-sm text-slate-300 text-right">
                        {formatDate(transaction.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-400">Account ID</span>
                      <span className="text-sm font-mono text-slate-300 text-right break-all">
                        {transaction.account_id}
                      </span>
                    </div>
                    {transaction.location && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-slate-400">Location</span>
                        <span className="text-sm text-slate-300 text-right">
                          {transaction.location}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => toggleCardExpansion(transaction._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-lg transition-all min-h-[44px]"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? "Show less details" : "Show more details"}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span className="text-sm font-medium">Show More</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onViewDetails(transaction)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all min-h-[44px] min-w-[44px]"
                    title="View details"
                    aria-label="View transaction details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onFlagTransaction(transaction)}
                    className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-lg transition-all min-h-[44px] min-w-[44px]"
                    title="Flag for investigation"
                    aria-label="Flag transaction for investigation"
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Tablet/Desktop Table View
  const { isTablet } = useResponsive();
  
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* Horizontal scroll wrapper for tablet */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              {/* Sticky first column on tablet */}
              <th className="sticky left-0 z-10 bg-slate-900 px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider md:static">
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
              {/* Hide Account ID on tablet, show on desktop */}
              <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
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
                {/* Sticky first column on tablet */}
                <td className="sticky left-0 z-10 bg-slate-800 px-4 py-3 text-sm font-mono text-slate-300 md:static hover:bg-slate-700/50">
                  {transaction.transaction_id}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">
                  {formatDate(transaction.timestamp)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium whitespace-nowrap">
                    {transaction.channel}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-white whitespace-nowrap">
                  {formatAmount(transaction.amount, 'INR')}
                </td>
                <td className="px-4 py-3 text-sm">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2 min-w-[120px]">
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
                {/* Hide Account ID on tablet, show on desktop */}
                <td className="hidden lg:table-cell px-4 py-3 text-sm font-mono text-slate-400">
                  {transaction.account_id}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(transaction)}
                      className="p-2.5 hover:bg-slate-600 rounded-lg transition-colors group min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="View details"
                      aria-label="View transaction details"
                    >
                      <Eye className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </button>
                    <button
                      onClick={() => onFlagTransaction(transaction)}
                      className="p-2.5 hover:bg-slate-600 rounded-lg transition-colors group min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Flag for investigation"
                      aria-label="Flag transaction for investigation"
                    >
                      <Flag className="w-5 h-5 text-slate-400 group-hover:text-yellow-400" />
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
