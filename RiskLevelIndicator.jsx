import { useMemo } from 'react'
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react'

export default function RiskLevelIndicator({ transactions = [] }) {
  const riskAnalysis = useMemo(() => {
    const total = transactions.length
    const fraudCount = transactions.filter(t => t.status === 'Fraud').length
    const fraudRate = total > 0 ? (fraudCount / total * 100) : 0

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
  }, [transactions])

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
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      text: 'text-green-800 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: 'text-yellow-600 dark:text-yellow-400',
      badge: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      text: 'text-red-800 dark:text-red-300',
      icon: 'text-red-600 dark:text-red-400',
      badge: 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
    }
  }

  const colors = colorClasses[riskAnalysis.color]
  const RiskIcon = riskAnalysis.icon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Transaction Risk Level</h3>
      
      {/* Risk Level Badge */}
      <div className="flex items-center space-x-2 mb-4">
        <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
          <RiskIcon className={`w-4 h-4 ${colors.icon}`} />
        </div>
        <div>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors.badge}`}>
            {riskAnalysis.level} Risk
          </span>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {riskAnalysis.fraudRate}% fraud rate
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Transactions</div>
          </div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
            {riskAnalysis.total}
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Fraud Cases</div>
          </div>
          <div className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">
            {riskAnalysis.fraudCount}
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className={`${colors.bg} dark:bg-gray-700/50 rounded-lg p-3 mb-4`}>
        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Risk Assessment</h4>
        <p className={`text-xs ${colors.text} dark:text-gray-300`}>
          {riskAnalysis.recommendation}
        </p>
      </div>

      {/* Additional Insights */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>High Value Fraud: {riskAnalysis.highValueFraud}</span>
          <span>Risk Level: {riskAnalysis.level}</span>
        </div>
      </div>
    </div>
  )
}