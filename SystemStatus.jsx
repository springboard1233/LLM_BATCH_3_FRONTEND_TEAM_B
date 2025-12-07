import { useMemo } from 'react'
import { CheckCircle, AlertCircle, XCircle, Clock, Database, Shield, Zap } from 'lucide-react'
import { useTranslation } from './src/hooks/useTranslation'

export default function SystemStatus({ transactions = [], totalTransactions = 0 }) {
  const { t } = useTranslation()
  const systemMetrics = useMemo(() => {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    // Recent transactions (last hour simulation)
    const recentTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= oneHourAgo
    })

    // System health indicators
    const fraudDetectionAccuracy = 94.7 // Simulated
    const systemUptime = 99.8 // Simulated
    const processingSpeed = 1.2 // Simulated seconds
    const databaseHealth = 'Healthy'

    // Use totalTransactions from backend if available
    const total = totalTransactions > 0 ? totalTransactions : transactions.length

    return {
      fraudDetectionAccuracy,
      systemUptime,
      processingSpeed,
      databaseHealth,
      recentTransactions: recentTransactions.length,
      totalProcessed: total
    }
  }, [transactions, totalTransactions])

  const getStatusIcon = (status, threshold = 95) => {
    if (status >= threshold) return <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
    if (status >= threshold - 10) return <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
    return <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
  }

  const getStatusColor = (status, threshold = 95) => {
    if (status >= threshold) return 'text-green-600'
    if (status >= threshold - 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <h3 className="text-base md:text-lg font-semibold text-gray-900">{t('dashboard.systemStatus', 'System Status')}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs md:text-sm text-green-600 font-medium">{t('dashboard.allSystemsOperational', 'All Systems Operational')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fraud Detection Accuracy */}
        <div className="flex items-center space-x-3 p-4 bg-theme-secondary rounded-lg">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemMetrics.fraudDetectionAccuracy)}
              <span className={`text-sm font-medium ${getStatusColor(systemMetrics.fraudDetectionAccuracy)}`}>
                {systemMetrics.fraudDetectionAccuracy}%
              </span>
            </div>
            <p className="text-xs text-theme-tertiary">{t('dashboard.detectionAccuracy', 'Detection Accuracy')}</p>
          </div>
        </div>

        {/* System Uptime */}
        <div className="flex items-center space-x-3 p-4 bg-theme-secondary rounded-lg">
          <div className="p-2 bg-green-100 rounded-lg">
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemMetrics.systemUptime)}
              <span className={`text-sm font-medium ${getStatusColor(systemMetrics.systemUptime)}`}>
                {systemMetrics.systemUptime}%
              </span>
            </div>
            <p className="text-xs text-theme-tertiary">{t('dashboard.systemUptime', 'System Uptime')}</p>
          </div>
        </div>

        {/* Processing Speed */}
        <div className="flex items-center space-x-3 p-4 bg-theme-secondary rounded-lg">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                {systemMetrics.processingSpeed}s
              </span>
            </div>
            <p className="text-xs text-theme-tertiary">{t('dashboard.avgProcessing', 'Avg Processing')}</p>
          </div>
        </div>

        {/* Database Health */}
        <div className="flex items-center space-x-3 p-4 bg-theme-secondary rounded-lg">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Database className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                {systemMetrics.databaseHealth}
              </span>
            </div>
            <p className="text-xs text-theme-tertiary">{t('dashboard.databaseStatus', 'Database Status')}</p>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-4 pt-4 border-t border-theme-primary">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>{systemMetrics.recentTransactions}</div>
            <div className="text-xs md:text-sm text-theme-tertiary">{t('dashboard.processedLastHour', 'Processed Last Hour')}</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--success)' }}>{systemMetrics.totalProcessed}</div>
            <div className="text-xs md:text-sm text-theme-tertiary">{t('dashboard.totalProcessedToday', 'Total Processed Today')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}