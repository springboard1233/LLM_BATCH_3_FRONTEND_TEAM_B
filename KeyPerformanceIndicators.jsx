import { useMemo } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Shield, DollarSign, Users, Activity, Target } from 'lucide-react'
import { useTranslation } from './src/hooks/useTranslation'

export default function KeyPerformanceIndicators({ transactions = [] }) {
  const { t } = useTranslation()
  
  const kpiMetrics = useMemo(() => {
    const total = transactions.length
    const fraudCount = transactions.filter(t => t.status === 'Fraud').length
    const safeCount = transactions.filter(t => t.status === 'Legitimate' || t.status === 'Safe').length
    const totalAmount = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
    const fraudAmount = transactions.filter(t => t.status === 'Fraud').reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
    const uniqueCustomers = new Set(transactions.map(t => t.customerId || t.customer_id)).size
    
    const fraudRate = total > 0 ? (fraudCount / total * 100) : 0
    const avgTransactionAmount = total > 0 ? (totalAmount / total) : 0
    const safeRate = total > 0 ? (safeCount / total * 100) : 0
    
    // Calculate trends (simulated for demo)
    const trends = {
      totalTransactions: Math.random() > 0.5 ? 'up' : 'down',
      fraudRate: Math.random() > 0.6 ? 'down' : 'up', // Lower fraud rate is better
      safeTransactions: Math.random() > 0.4 ? 'up' : 'down',
      avgAmount: Math.random() > 0.5 ? 'up' : 'down',
      uniqueCustomers: Math.random() > 0.3 ? 'up' : 'down',
      totalVolume: Math.random() > 0.5 ? 'up' : 'down'
    }
    
    const trendValues = {
      totalTransactions: (Math.random() * 10 + 1).toFixed(1),
      fraudRate: (Math.random() * 5 + 0.5).toFixed(1),
      safeTransactions: (Math.random() * 15 + 5).toFixed(1),
      avgAmount: (Math.random() * 8 + 2).toFixed(1),
      uniqueCustomers: (Math.random() * 12 + 3).toFixed(1),
      totalVolume: (Math.random() * 20 + 5).toFixed(1)
    }

    return {
      totalTransactions: total,
      fraudCount,
      safeCount,
      fraudRate: fraudRate.toFixed(1),
      safeRate: safeRate.toFixed(1),
      totalAmount: totalAmount.toLocaleString(),
      avgTransactionAmount: avgTransactionAmount.toFixed(2),
      uniqueCustomers,
      trends,
      trendValues
    }
  }, [transactions])

  const kpiItems = [
    {
      id: 'total-transactions',
      label: t('kpi.totalTransactions', 'Total Transactions'),
      value: kpiMetrics.totalTransactions,
      icon: Activity,
      trend: kpiMetrics.trends.totalTransactions,
      trendValue: kpiMetrics.trendValues.totalTransactions,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'fraud-rate',
      label: t('kpi.fraudRate', 'Fraud Rate'),
      value: `${kpiMetrics.fraudRate}%`,
      icon: AlertTriangle,
      trend: kpiMetrics.trends.fraudRate,
      trendValue: kpiMetrics.trendValues.fraudRate,
      color: parseFloat(kpiMetrics.fraudRate) > 20 ? 'red' : parseFloat(kpiMetrics.fraudRate) > 10 ? 'yellow' : 'green',
      bgColor: parseFloat(kpiMetrics.fraudRate) > 20 ? 'bg-red-50' : parseFloat(kpiMetrics.fraudRate) > 10 ? 'bg-yellow-50' : 'bg-green-50',
      iconColor: parseFloat(kpiMetrics.fraudRate) > 20 ? 'text-red-600' : parseFloat(kpiMetrics.fraudRate) > 10 ? 'text-yellow-600' : 'text-green-600',
      borderColor: parseFloat(kpiMetrics.fraudRate) > 20 ? 'border-red-200' : parseFloat(kpiMetrics.fraudRate) > 10 ? 'border-yellow-200' : 'border-green-200'
    },
    {
      id: 'safe-transactions',
      label: t('kpi.safeTransactions', 'Safe Transactions'),
      value: kpiMetrics.safeCount,
      icon: Shield,
      trend: kpiMetrics.trends.safeTransactions,
      trendValue: kpiMetrics.trendValues.safeTransactions,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      id: 'avg-amount',
      label: t('kpi.avgTransactionAmount', 'Avg Transaction Amount'),
      value: `$${kpiMetrics.avgTransactionAmount}`,
      icon: DollarSign,
      trend: kpiMetrics.trends.avgAmount,
      trendValue: kpiMetrics.trendValues.avgAmount,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      id: 'unique-customers',
      label: t('kpi.uniqueCustomers', 'Unique Customers'),
      value: kpiMetrics.uniqueCustomers,
      icon: Users,
      trend: kpiMetrics.trends.uniqueCustomers,
      trendValue: kpiMetrics.trendValues.uniqueCustomers,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200'
    },
    {
      id: 'total-volume',
      label: t('kpi.totalVolume', 'Total Volume'),
      value: `$${kpiMetrics.totalAmount}`,
      icon: Target,
      trend: kpiMetrics.trends.totalVolume,
      trendValue: kpiMetrics.trendValues.totalVolume,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    }
  ]

  const getTrendIcon = (trend) => {
    return trend === 'up' ? TrendingUp : TrendingDown
  }

  const getTrendColor = (trend, isGoodWhenUp = true) => {
    const isPositive = isGoodWhenUp ? trend === 'up' : trend === 'down'
    return isPositive ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{t('kpi.title', 'Key Performance Indicators')}</h3>
        <div className="text-xs text-gray-500">
          {t('kpi.lastUpdated', 'Last updated')}: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiItems.map((item) => {
          const Icon = item.icon
          const TrendIcon = getTrendIcon(item.trend)
          const isGoodWhenUp = item.id !== 'fraud-rate' // Fraud rate is good when it goes down
          
          return (
            <div 
              key={item.id} 
              className={`${item.bgColor} ${item.borderColor} border rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div className="flex items-center space-x-1">
                  <TrendIcon className={`w-4 h-4 ${getTrendColor(item.trend, isGoodWhenUp)}`} />
                  <span className={`text-xs font-medium ${getTrendColor(item.trend, isGoodWhenUp)}`}>
                    {item.trendValue}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${item.iconColor}`}>
                  {item.value}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {item.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Row */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{kpiMetrics.totalTransactions}</div>
            <div className="text-xs text-gray-500">{t('kpi.totalProcessed', 'Total Processed')}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{kpiMetrics.safeRate}%</div>
            <div className="text-xs text-gray-500">{t('kpi.successRate', 'Success Rate')}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">${kpiMetrics.avgTransactionAmount}</div>
            <div className="text-xs text-gray-500">{t('kpi.avgValue', 'Avg Value')}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-600">{kpiMetrics.uniqueCustomers}</div>
            <div className="text-xs text-gray-500">{t('kpi.activeUsers', 'Active Users')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}