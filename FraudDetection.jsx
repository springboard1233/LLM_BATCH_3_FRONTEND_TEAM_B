import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Send } from 'lucide-react';
import { apiService } from './src/services/api';
import { useSettings } from './src/contexts/SettingsContext';
import useResponsive from './src/hooks/useResponsive';

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
  const { effectiveTheme } = useSettings();
  const isDarkTheme = effectiveTheme === 'dark';
  const { isMobile } = useResponsive();
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
    <div className="space-y-4 md:space-y-6">
      <div className={`rounded-2xl p-4 md:p-6 border ${
        isDarkTheme 
          ? 'bg-black/30 border-white/10 backdrop-blur-lg' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className={`text-xl md:text-2xl font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Fraud Detection Simulator</h3>
            <p className={`mt-1 text-sm md:text-base ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              Submit a single transaction payload to evaluate its fraud risk score using the hybrid ML + rules engine.
            </p>
          </div>
          <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 flex-shrink-0" />
        </div>
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className={`text-sm block mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Customer ID</label>
              <input
                type="text"
                value={formData.customer_id}
                onChange={(e) => handleChange('customer_id', e.target.value)}
                className={`w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  isDarkTheme 
                    ? 'bg-black/20 border-white/10 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
            <div>
              <label className={`text-sm block mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>KYC Verified</label>
              <select
                value={Number(formData.kyc_verified)}
                onChange={(e) => handleChange('kyc_verified', Number(e.target.value))}
                className={`w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  isDarkTheme 
                    ? 'bg-black/20 border-white/10 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value={1}>Yes (1)</option>
                <option value={0}>No (0)</option>
              </select>
            </div>
            <div>
              <label className={`text-sm block mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Account Age (days)</label>
              <input
                type="number"
                min="0"
                value={formData.account_age_days}
                onChange={(e) => handleChange('account_age_days', e.target.value)}
                className={`w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  isDarkTheme 
                    ? 'bg-black/20 border-white/10 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
            <div>
              <label className={`text-sm block mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Transaction Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.transaction_amount}
                onChange={(e) => handleChange('transaction_amount', e.target.value)}
                className={`w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  isDarkTheme 
                    ? 'bg-black/20 border-white/10 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`text-sm block mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Channel</label>
              <select
                value={formData.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                className={`w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  isDarkTheme 
                    ? 'bg-black/20 border-white/10 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {channels.map((channel) => (
                  <option key={channel.value} value={channel.value}>
                    {channel.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`text-sm block mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Timestamp</label>
              <input
                type="datetime-local"
                value={formData.timestamp.replace(' ', 'T')}
                onChange={(e) => {
                  const rawValue = e.target.value.replace('T', ' ');
                  const normalized = rawValue.length === 16 ? `${rawValue}:00` : rawValue;
                  handleChange('timestamp', normalized);
                }}
                className={`w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  isDarkTheme 
                    ? 'bg-black/20 border-white/10 text-white [color-scheme:dark]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
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
                className={`inline-flex items-center space-x-2 border px-4 py-2 rounded-lg transition ${
                  isDarkTheme 
                    ? 'border-white/20 text-white hover:bg-white/10' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Sample</span>
              </button>
            </div>
          </div>
        </form>

        <div className={`mt-4 md:mt-6 text-xs md:text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            Expected payload format:
            <span className={`block font-mono text-xs mt-2 p-2 md:p-3 rounded-lg border overflow-x-auto ${
              isDarkTheme 
                ? 'text-gray-300 bg-black/20 border-white/5' 
                : 'text-gray-700 bg-gray-50 border-gray-200'
            }`}>
              {JSON.stringify(DEFAULT_PAYLOAD, null, 2)}
            </span>
          </p>
        </div>
      </div>

      <div className={`rounded-2xl p-4 md:p-6 border ${
        isDarkTheme 
          ? 'bg-black/30 border-white/10 backdrop-blur-lg' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h4 className={`text-lg md:text-xl font-semibold mb-3 md:mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Prediction Result</h4>
        {error && (
          <div className="text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            {error}
          </div>
        )}
        {result ? (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <div className={`rounded-xl p-4 border ${
                isDarkTheme ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Final Verdict</p>
                <p
                  className={`text-2xl font-semibold mt-2 ${
                    result.is_fraud ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {result.is_fraud ? 'Fraudulent' : 'Legitimate'}
                </p>
              </div>
              <div className={`rounded-xl p-4 border ${
                isDarkTheme ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Risk Score</p>
                <p className={`text-2xl font-semibold mt-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {(Number(result.risk_score || 0) * 100).toFixed(2)}%
                </p>
                <div className={`w-full h-2 rounded-full mt-3 ${isDarkTheme ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div
                    className={`h-full rounded-full ${
                      result.is_fraud ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(Number(result.risk_score || 0) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className={`rounded-xl p-4 border ${
                isDarkTheme ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>ML Reason</p>
                <p className={`text-base mt-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {result.ml_reason || 'No ML alerts triggered.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className={`rounded-xl p-4 border ${
                isDarkTheme ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-sm mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Rule Reasons</p>
                {result.rule_reasons && result.rule_reasons.length > 0 ? (
                  <ul className={`space-y-2 text-sm list-disc list-inside ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                    {result.rule_reasons.map((reason, idx) => (
                      <li key={`rule-${idx}`}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>No rules were triggered.</p>
                )}
              </div>
              <div className={`rounded-xl p-4 border ${
                isDarkTheme ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-sm mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Combined Reasons</p>
                {result.combined_reasons && result.combined_reasons.length > 0 ? (
                  <ul className={`space-y-2 text-sm list-disc list-inside ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                    {result.combined_reasons.map((reason, idx) => (
                      <li key={`combined-${idx}`}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>No combined reasons available.</p>
                )}
              </div>
            </div>

            <div className={`rounded-xl p-4 border ${
              isDarkTheme ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <p className={`text-sm mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Explanation</p>
              <div className={`text-sm space-y-1 whitespace-pre-line ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                {result.explanation || 'No explanation provided.'}
              </div>
            </div>
          </div>
        ) : (
          <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>
            Submit a payload to see the fraud decision, risk score, and explanation from the backend hybrid engine.
          </p>
        )}
      </div>
    </div>
  );
};

export default FraudDetection;

