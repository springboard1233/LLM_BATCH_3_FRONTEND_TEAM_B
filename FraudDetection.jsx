import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Send } from 'lucide-react';
import { apiService } from './src/services/api';

const DEFAULT_PAYLOAD = {
  customer_id: 'LLM1',
  kyc_verified: 1,
  account_age_days: 20,
  transaction_amount: 5,
  channel: 'web',
  timestamp: '2023-10-27 14:30:00',
};

const channels = [
  { label: 'ATM', value: 'atm' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'POS', value: 'pos' },
  { label: 'Web', value: 'web' },
];

const FraudDetection = () => {
  const [formData, setFormData] = useState(DEFAULT_PAYLOAD);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      customer_id: formData.customer_id.trim(),
      kyc_verified: Number(formData.kyc_verified) || 0,
      account_age_days: Number(formData.account_age_days) || 0,
      transaction_amount: Number(formData.transaction_amount) || 0,
      channel: formData.channel,
      timestamp: formData.timestamp,
    };

    try {
      const response = await apiService.predictFraud(payload);
      setResult(response);
    } catch (err) {
      setError(err?.message || 'Failed to fetch prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_PAYLOAD);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-white">Fraud Detection Simulator</h3>
            <p className="text-gray-300 mt-1">
              Submit a single transaction payload to evaluate its fraud risk score using the hybrid ML + rules engine.
            </p>
          </div>
          <ShieldCheck className="w-10 h-10 text-emerald-400" />
        </div>
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Customer ID</label>
              <input
                type="text"
                value={formData.customer_id}
                onChange={(e) => handleChange('customer_id', e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">KYC Verified</label>
              <select
                value={Number(formData.kyc_verified)}
                onChange={(e) => handleChange('kyc_verified', Number(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value={1}>Yes (1)</option>
                <option value={0}>No (0)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Account Age (days)</label>
              <input
                type="number"
                min="0"
                value={formData.account_age_days}
                onChange={(e) => handleChange('account_age_days', e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Transaction Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.transaction_amount}
                onChange={(e) => handleChange('transaction_amount', e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Channel</label>
              <select
                value={formData.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {channels.map((channel) => (
                  <option key={channel.value} value={channel.value}>
                    {channel.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Timestamp</label>
              <input
                type="datetime-local"
                value={formData.timestamp.replace(' ', 'T')}
                onChange={(e) => {
                  const rawValue = e.target.value.replace('T', ' ');
                  const normalized = rawValue.length === 16 ? `${rawValue}:00` : rawValue;
                  handleChange('timestamp', normalized);
                }}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Computing...' : 'Run Prediction'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center space-x-2 border border-white/20 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Sample</span>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-sm text-gray-400">
          <p>
            Expected payload format:
            <span className="block font-mono text-xs text-gray-300 mt-2 bg-black/20 p-3 rounded-lg border border-white/5">
              {JSON.stringify(DEFAULT_PAYLOAD, null, 2)}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <h4 className="text-xl text-white font-semibold mb-4">Prediction Result</h4>
        {error && (
          <div className="text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            {error}
          </div>
        )}
        {result ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-gray-400">Final Verdict</p>
                <p
                  className={`text-2xl font-semibold mt-2 ${
                    result.is_fraud ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {result.is_fraud ? 'Fraudulent' : 'Legitimate'}
                </p>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-gray-400">Risk Score</p>
                <p className="text-2xl font-semibold mt-2 text-white">
                  {(Number(result.risk_score || 0) * 100).toFixed(2)}%
                </p>
                <div className="w-full h-2 bg-white/10 rounded-full mt-3">
                  <div
                    className={`h-full rounded-full ${
                      result.is_fraud ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(Number(result.risk_score || 0) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-gray-400">ML Reason</p>
                <p className="text-base text-white mt-2">
                  {result.ml_reason || 'No ML alerts triggered.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">Rule Reasons</p>
                {result.rule_reasons && result.rule_reasons.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-200 list-disc list-inside">
                    {result.rule_reasons.map((reason, idx) => (
                      <li key={`rule-${idx}`}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No rules were triggered.</p>
                )}
              </div>
              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-gray-400 mb-2">Combined Reasons</p>
                {result.combined_reasons && result.combined_reasons.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-200 list-disc list-inside">
                    {result.combined_reasons.map((reason, idx) => (
                      <li key={`combined-${idx}`}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No combined reasons available.</p>
                )}
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-2">Explanation</p>
              <div className="text-gray-200 text-sm space-y-1 whitespace-pre-line">
                {result.explanation || 'No explanation provided.'}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">
            Submit a payload to see the fraud decision, risk score, and explanation from the backend hybrid engine.
          </p>
        )}
      </div>
    </div>
  );
};

export default FraudDetection;

