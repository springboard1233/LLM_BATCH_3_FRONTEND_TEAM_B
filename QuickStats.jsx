import { useMemo } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Shield, AlertTriangle } from 'lucide-react'
import { useTranslation } from './src/hooks/useTranslation'

export default function QuickStats({ transactions = [], totalTransactions = 0, overviewStats = null }) {
  const { t } = useTranslation()
  const stats = useMemo(() => {
    // Use backend stats if available
    const total = totalTransactions > 0 ? totalTransactions : transactions.length
    const fraudCount = overviewStats?.fraud_cases || transactions.filter(t => t.status === 'Fraud').length
    const legitimateCount = overviewStats?.non_fraud_cases || transactions.filter(t => t.status === 'Legitimate' || t.status === 'Safe').length
    const totalAmount = overviewStats?.total_amount || transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
    const fraudAmount = transactions.filter(t => t.status === 'Fraud').reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
    const uniqueCustomers = new Set(transactions.map(t => t.customerId || t.customer_id)).size
    
    const fraudRate = overviewStats?.fraud_percentage || (total > 0 ? (fraudCount / total * 100) : 0)
    const avgTransactionAmount = overviewStats?.avg_transaction_amount || (total > 0 ? (totalAmount / total) : 0)
    const fraudLossRate = totalAmount > 0 ? (fraudAmount / totalAmount * 100) : 0

    return {
      totalTransactions: total,
      fraudCount,
      legitimateCount,
      fraudRate: fraudRate.toFixed(1),
      totalAmount: totalAmount.toLocaleString(),
      fraudAmount: fraudAmount.toLocaleString(),
      avgTransactionAmount: avgTransactionAmount.toFixed(2),
      uniqueCustomers,
      fraudLossRate: fraudLossRate.toFixed(1)
    }
  }, [transactions, totalTransactions, overviewStats])

  const quickStatsItems = [
    {
      label: t('dashboard.fraudRate', 'Fraud Rate'),
      value: `${stats.fraudRate}%`,
      icon: AlertTriangle,
      color: parseFloat(stats.fraudRate) > 20 ? 'text-red-600' : parseFloat(stats.fraudRate) > 10 ? 'text-yellow-600' : 'text-green-600',
      bgColor: parseFloat(stats.fraudRate) > 20 ? 'bg-red-50' : parseFloat(stats.fraudRate) > 10 ? 'bg-yellow-50' : 'bg-green-50'
    },
    {
      label: t('dashboard.totalVolume', 'Total Volume'),
      value: `$${stats.totalAmount}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: t('dashboard.uniqueCustomers', 'Unique Customers'),
      value: stats.uniqueCustomers.toLocaleString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: t('dashboard.protectedAmount', 'Protected Amount'),
      value: `$${(parseFloat(stats.totalAmount.replace(/,/g, '')) - parseFloat(stats.fraudAmount.replace(/,/g, ''))).toLocaleString()}`,
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3">{t('dashboard.quickStats', 'Quick Stats')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickStatsItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className={`${item.bgColor} rounded-lg p-3`}>
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </div>
              <div className={`text-base md:text-lg font-bold ${item.color} mt-1`}>
                {item.value}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Additional Insights */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 text-xs text-gray-600">
          <span>{t('dashboard.avgTransaction', 'Avg Transaction')}: ${stats.avgTransactionAmount}</span>
          <span>{t('dashboard.lossRate', 'Loss Rate')}: {stats.fraudLossRate}%</span>
        </div>
      </div>
    </div>
  )
}