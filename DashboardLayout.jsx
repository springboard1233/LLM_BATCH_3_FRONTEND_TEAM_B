import { useState, useEffect } from 'react'

import RiskLevelIndicator from './RiskLevelIndicator.jsx'
import TransactionTable from './TransactionTable.jsx'
import SearchFilterBar from './SearchFilterBar.jsx'
import { useTranslation } from './src/hooks/useTranslation'
import { useSettings } from './src/contexts/SettingsContext'

export default function DashboardLayout({ transactions = [], totalTransactions = 0, overviewStats = null, isLoading = false, error = null }) {
  const { t } = useTranslation()
  const { effectiveTheme } = useSettings();
  const isDarkTheme = effectiveTheme === 'dark';
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)

  // Handle filter changes from SearchFilterBar
  const handleFilterChange = (filters) => {
    let filtered = transactions

    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(t =>
        t.id?.toLowerCase().includes(searchLower) ||
        t.customerId?.toLowerCase().includes(searchLower) ||
        t.customer_id?.toLowerCase().includes(searchLower) ||
        t.channel?.toLowerCase().includes(searchLower) ||
        t.status?.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (filters.status?.length > 0) {
      filtered = filtered.filter(t => filters.status.includes(t.status))
    }

    // Apply channel filter
    if (filters.channels?.length > 0) {
      filtered = filtered.filter(t => filters.channels.includes(t.channel))
    }

    // Apply date range filter
    if (filters.dateRange?.start || filters.dateRange?.end) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date)
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null

        if (startDate && transactionDate < startDate) return false
        if (endDate && transactionDate > endDate) return false
        return true
      })
    }

    // Apply amount range filter
    if (filters.amountRange?.min || filters.amountRange?.max) {
      filtered = filtered.filter(t => {
        const amount = Number(t.amount) || 0
        const min = filters.amountRange.min ? Number(filters.amountRange.min) : 0
        const max = filters.amountRange.max ? Number(filters.amountRange.max) : Infinity
        return amount >= min && amount <= max
      })
    }

    // Apply KYC status filter
    if (filters.kycStatus?.length > 0) {
      filtered = filtered.filter(t => {
        const kycVerified = t.kycStatus || t.kyc
        if (filters.kycStatus.includes('Verified') && kycVerified) return true
        if (filters.kycStatus.includes('Pending') && !kycVerified) return true
        return false
      })
    }

    setFilteredTransactions(filtered)
  }

  // Update filtered transactions when transactions prop changes
  useEffect(() => {
    setFilteredTransactions(transactions)
  }, [transactions])

  return (
    <div className="space-y-6">


      {/* Risk Level Indicator */}
      <RiskLevelIndicator 
        transactions={filteredTransactions} 
        totalTransactions={totalTransactions}
        overviewStats={overviewStats}
      />

      {/* Search and Filter Controls */}
      <SearchFilterBar
        onFilterChange={handleFilterChange}
        transactions={transactions}
      />

      {/* Main Transaction Table */}
      <TransactionTable
        transactions={filteredTransactions}
        isLoading={isLoading}
        error={error}
        totalCount={totalTransactions}
      />

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className={`rounded-xl border p-4 md:p-6 hover:shadow-lg transition-shadow duration-200 ${
          isDarkTheme ? 'bg-black/20 backdrop-blur-sm border-white/10' : 'bg-white border-gray-200 shadow-md'
        }`}>
          <h4 className={`text-base md:text-lg font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.filteredResults', 'Filtered Results')}</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{t('dashboard.totalTransactions', 'Total Transactions')}:</span>
              <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{totalTransactions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{t('dashboard.currentPage', 'Current Page')}:</span>
              <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{transactions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{t('dashboard.filteredResults', 'Filtered Results')}:</span>
              <span className="text-sm font-medium text-emerald-400">
                {filteredTransactions.length}
              </span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-4 md:p-6 hover:shadow-lg transition-shadow duration-200 ${
          isDarkTheme ? 'bg-black/20 backdrop-blur-sm border-white/10' : 'bg-white border-gray-200 shadow-md'
        }`}>
          <h4 className={`text-base md:text-lg font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.quickStats', 'Quick Stats')}</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{t('dashboard.fraudCases', 'Fraud Cases')}:</span>
              <span className="text-sm font-medium text-red-400">
                {overviewStats?.fraud_cases || filteredTransactions.filter(t => t.status === 'Fraud').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{t('dashboard.safeTransactions', 'Safe Transactions')}:</span>
              <span className="text-sm font-medium text-emerald-400">
                {overviewStats?.non_fraud_cases || filteredTransactions.filter(t => t.status === 'Legitimate' || t.status === 'Safe').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{t('dashboard.totalValue', 'Total Value')}:</span>
              <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                ₹{(overviewStats?.total_amount || filteredTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-4 md:p-6 hover:shadow-lg transition-shadow duration-200 ${
          isDarkTheme ? 'bg-black/20 backdrop-blur-sm border-white/10' : 'bg-white border-gray-200 shadow-md'
        }`}>
          <h4 className={`text-base md:text-lg font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{t('dashboard.dataQuality', 'Data Quality')}</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{t('dashboard.completeRecords', 'Complete Records')}:</span>
              <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {totalTransactions}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{t('dashboard.kycVerified', 'KYC Verified')}:</span>
              <span className="text-sm font-medium text-blue-400">
                {filteredTransactions.filter(t => t.kycStatus || t.kyc).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{t('dashboard.dataCompleteness', 'Data Completeness')}:</span>
              <span className="text-sm font-medium text-purple-400">
                100.0%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}