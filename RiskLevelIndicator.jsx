import { useMemo } from 'react'
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react'
import { useSettings } from './src/contexts/SettingsContext'

export default function RiskLevelIndicator({ transactions = [], totalTransactions = 0, overviewStats = null }) {
  const { effectiveTheme } = useSettings();
  const isDarkTheme = effectiveTheme === 'dark';
  const riskAnalysis = useMemo(() => {
    // Use backend totals if available
    const total = totalTransactions > 0 ? totalTransactions : transactions.length
    const fraudCount = overviewStats?.fraud_cases || transactions.filter(t => t.status === 'Fraud').length
    const fraudRate = overviewStats?.fraud_percentage || (total > 0 ? (fraudCount / total * 100) : 0)

    // Calculate high-value transactions (above $1000)
    const highValueTransactions = transactions.filter(t => Number(t.amount) > 1000).length
    const highValueFraud = transactions.filter(t => t.status === 'Fraud' && Number(t.amount) > 1000).length

    // Determine risk level based on fraud rate and high-value fraud
    let riskLevel = 'Low'
    let riskColor = 'green'
    let riskIcon = Shield

    if (fraudRate > 15 || (highValueFraud > 5 && fraudRate > 10)) {
      riskLevel = 'High'
      riskColor = 'red'
      riskIcon = AlertCircle
    } else if (fraudRate > 8 || (highValueFraud > 2 && fraudRate > 5)) {
      riskLevel = 'Medium'
      riskColor = 'yellow'
      riskIcon = AlertTriangle
    }

    return {
      level: riskLevel,
      color: riskColor,
      icon: riskIcon,
      fraudRate: fraudRate.toFixed(1),
      fraudCount,
      highValueFraud,
      total,
      recommendation: getRiskRecommendation(riskLevel, fraudRate, highValueFraud)
    }
  }, [transactions, totalTransactions, overviewStats])

  function getRiskRecommendation(level, fraudRate, highValueFraud) {
    switch (level) {
      case 'High':
        return 'Immediate action required. Review fraud detection rules and implement additional security measures.'
      case 'Medium':
        return 'Monitor closely. Consider implementing enhanced verification for high-value transactions.'
      case 'Low':
        return 'System operating normally. Continue regular monitoring.'
      default:
        return 'Insufficient data for risk assessment.'
    }
  }

  const colorClasses = {
    green: {
      bg: isDarkTheme ? 'bg-green-900/20' : 'bg-green-50',
      border: isDarkTheme ? 'border-green-700' : 'border-green-200',
      text: isDarkTheme ? 'text-green-300' : 'text-green-800',
      icon: isDarkTheme ? 'text-green-400' : 'text-green-600',
      badge: isDarkTheme ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
    },
    yellow: {
      bg: isDarkTheme ? 'bg-yellow-900/20' : 'bg-yellow-50',
      border: isDarkTheme ? 'border-yellow-700' : 'border-yellow-200',
      text: isDarkTheme ? 'text-yellow-300' : 'text-yellow-800',
      icon: isDarkTheme ? 'text-yellow-400' : 'text-yellow-600',
      badge: isDarkTheme ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
    },
    red: {
      bg: isDarkTheme ? 'bg-red-900/20' : 'bg-red-50',
      border: isDarkTheme ? 'border-red-700' : 'border-red-200',
      text: isDarkTheme ? 'text-red-300' : 'text-red-800',
      icon: isDarkTheme ? 'text-red-400' : 'text-red-600',
      badge: isDarkTheme ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'
    }
  }

  const colors = colorClasses[riskAnalysis.color]
  const RiskIcon = riskAnalysis.icon

  return (
    <div className={`rounded-xl shadow-sm border p-4 ${
      isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-sm font-semibold mb-3 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Transaction Risk Level</h3>
      
      {/* Risk Level Badge */}
      <div className="flex items-center space-x-2 mb-4">
        <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
          <RiskIcon className={`w-4 h-4 ${colors.icon}`} />
        </div>
        <div>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors.badge}`}>
            {riskAnalysis.level} Risk
          </span>
          <div className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
            {riskAnalysis.fraudRate}% fraud rate
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`rounded-lg p-3 ${isDarkTheme ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <div className="flex items-center space-x-2">
            <div className={`text-xs font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Total Transactions</div>
          </div>
          <div className={`text-lg font-bold mt-1 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}>
            {riskAnalysis.total}
          </div>
        </div>
        
        <div className={`rounded-lg p-3 ${isDarkTheme ? 'bg-red-900/20' : 'bg-red-50'}`}>
          <div className="flex items-center space-x-2">
            <div className={`text-xs font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Fraud Cases</div>
          </div>
          <div className={`text-lg font-bold mt-1 ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>
            {riskAnalysis.fraudCount}
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className={`${colors.bg} rounded-lg p-3 mb-4`}>
        <h4 className={`text-xs font-medium mb-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Risk Assessment</h4>
        <p className={`text-xs ${colors.text}`}>
          {riskAnalysis.recommendation}
        </p>
      </div>

      {/* Additional Insights */}
      <div className={`pt-3 border-t ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
        <div className={`flex items-center justify-between text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
          <span>High Value Fraud: {riskAnalysis.highValueFraud}</span>
          <span>Risk Level: {riskAnalysis.level}</span>
        </div>
      </div>
    </div>
  )
}