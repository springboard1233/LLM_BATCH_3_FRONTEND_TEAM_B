import { X, MapPin, Smartphone, CreditCard, Calendar, User, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { transactionAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { Transaction } from '../lib/types';

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onClose: () => void;
  onUpdate: () => void;
}

export const TransactionDetailsModal = ({
  transaction,
  onClose,
  onUpdate,
}: TransactionDetailsModalProps) => {
  const { profile } = useAuth();
  const [feedbackVerdict, setFeedbackVerdict] = useState<string>('');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !feedbackVerdict) return;

    setSubmitting(true);
    try {
      const newStatus = feedbackVerdict === 'fraud' ? 'flagged' : feedbackVerdict === 'legitimate' ? 'completed' : transaction.status;
      
      await transactionAPI.update(transaction._id, { status: newStatus });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
            <p className="text-slate-400 text-sm font-mono">{transaction.transaction_id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Amount</label>
                <div className="text-2xl font-bold text-white">
                  {formatAmount(transaction.amount, 'INR')}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1 block">Status</label>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium border ${
                      transaction.status === 'flagged' || transaction.status === 'rejected'
                        ? 'bg-red-900/50 text-red-200 border-red-700'
                        : transaction.status === 'completed'
                        ? 'bg-green-900/50 text-green-200 border-green-700'
                        : 'bg-yellow-900/50 text-yellow-200 border-yellow-700'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1 block">Risk Score</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
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
                  <span className="text-xl font-bold text-white">{transaction.risk_score}/100</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <label className="text-sm text-slate-400 block">Timestamp</label>
                  <div className="text-white">{formatDate(transaction.timestamp)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <label className="text-sm text-slate-400 block">Channel</label>
                  <div className="text-white">{transaction.channel}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <label className="text-sm text-slate-400 block">Account ID</label>
                  <div className="text-white font-mono text-sm">{transaction.account_id}</div>
                </div>
              </div>

              {transaction.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <label className="text-sm text-slate-400 block">Location</label>
                    <div className="text-white">{transaction.location}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {transaction.metadata && typeof transaction.metadata === 'object' && Object.keys(transaction.metadata).length > 0 && (
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-300">Device Information</h3>
              </div>
              <pre className="text-xs text-slate-400 overflow-x-auto">
                {JSON.stringify(transaction.metadata, null, 2)}
              </pre>
            </div>
          )}



          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Submit Feedback</h3>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Verdict</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFeedbackVerdict('fraud')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      feedbackVerdict === 'fraud'
                        ? 'bg-red-600 text-white border-2 border-red-400'
                        : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    Confirm Fraud
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackVerdict('legitimate')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      feedbackVerdict === 'legitimate'
                        ? 'bg-green-600 text-white border-2 border-green-400'
                        : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    Legitimate
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackVerdict('false_positive')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      feedbackVerdict === 'false_positive'
                        ? 'bg-yellow-600 text-white border-2 border-yellow-400'
                        : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    False Positive
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="note" className="text-sm text-slate-300 mb-2 block">
                  Notes (optional)
                </label>
                <textarea
                  id="note"
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any additional notes about this transaction..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!feedbackVerdict || submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
