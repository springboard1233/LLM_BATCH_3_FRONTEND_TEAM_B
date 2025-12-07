import { useState, useEffect } from 'react'
import { Search, Filter, X, Calendar, DollarSign } from 'lucide-react'
import { useSettings } from './src/contexts/SettingsContext'

export default function SearchFilterBar({ onFilterChange, transactions = [] }) {
  const { effectiveTheme } = useSettings();
  const isDarkTheme = effectiveTheme === 'dark';
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: [],
    channels: [],
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' },
    kycStatus: []
  })

  // Get unique values for filter options
  const filterOptions = {
    statuses: [...new Set(transactions.map(t => t.status).filter(Boolean))],
    channels: [...new Set(transactions.map(t => t.channel).filter(Boolean))],
    kycStatuses: ['Verified', 'Pending']
  }

  // Apply filters whenever they change
  useEffect(() => {
    const appliedFilters = {
      ...filters,
      searchTerm: searchTerm.trim()
    }
    onFilterChange(appliedFilters)
  }, [filters, searchTerm, onFilterChange])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleMultiSelectChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      channels: [],
      dateRange: { start: '', end: '' },
      amountRange: { min: '', max: '' },
      kycStatus: []
    })
    setSearchTerm('')
  }

  const hasActiveFilters =
    searchTerm ||
    filters.status.length > 0 ||
    filters.channels.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.amountRange.min ||
    filters.amountRange.max ||
    filters.kycStatus.length > 0

  return (
    <div className={`rounded-xl shadow-sm border p-4 md:p-6 ${
      isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Search & Filter</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 transition-colors rounded-lg hover:bg-red-50 min-h-[44px]"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Transaction ID, Customer ID, Channel, or Status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isDarkTheme 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
            showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Advanced Filters</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>Status:</span>
          <select
            value={filters.status.length === 1 ? filters.status[0] : ''}
            onChange={(e) => handleFilterChange('status', e.target.value ? [e.target.value] : [])}
            className={`text-sm border rounded px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkTheme 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">All Status</option>
            {filterOptions.statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>Channel:</span>
          <select
            value={filters.channels.length === 1 ? filters.channels[0] : ''}
            onChange={(e) => handleFilterChange('channels', e.target.value ? [e.target.value] : [])}
            className={`text-sm border rounded px-3 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkTheme 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">All Channels</option>
            {filterOptions.channels.map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
        </div>
      </div>

      {showFilters && (
        <div className={`border-t pt-4 space-y-4 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
              <div className="space-y-3">
                {filterOptions.statuses.map(status => (
                  <label key={status} className="flex items-center min-h-[44px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => handleMultiSelectChange('status', status)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5 cursor-pointer"
                    />
                    <span className={`ml-3 text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Channels</label>
              <div className="space-y-3">
                {filterOptions.channels.map(channel => (
                  <label key={channel} className="flex items-center min-h-[44px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.channels.includes(channel)}
                      onChange={() => handleMultiSelectChange('channels', channel)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5 cursor-pointer"
                    />
                    <span className={`ml-3 text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{channel}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                <Calendar className="w-4 h-4 inline mr-1" />
                Date Range
              </label>
              <div className="space-y-3">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className={`w-full text-sm border rounded px-3 py-3 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkTheme 
                      ? 'bg-gray-700 border-gray-600 text-white [color-scheme:dark]' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className={`w-full text-sm border rounded px-3 py-3 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkTheme 
                      ? 'bg-gray-700 border-gray-600 text-white [color-scheme:dark]' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="End Date"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                <DollarSign className="w-4 h-4 inline mr-1" />
                Amount Range
              </label>
              <div className="space-y-3">
                <input
                  type="number"
                  value={filters.amountRange.min}
                  onChange={(e) => handleFilterChange('amountRange', { ...filters.amountRange, min: e.target.value })}
                  className={`w-full text-sm border rounded px-3 py-3 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkTheme 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Min Amount"
                />
                <input
                  type="number"
                  value={filters.amountRange.max}
                  onChange={(e) => handleFilterChange('amountRange', { ...filters.amountRange, max: e.target.value })}
                  className={`w-full text-sm border rounded px-3 py-3 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkTheme 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Max Amount"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>KYC Status</label>
            <div className="flex items-center gap-6">
              {filterOptions.kycStatuses.map(status => (
                <label key={status} className="flex items-center min-h-[44px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.kycStatus.includes(status)}
                    onChange={() => handleMultiSelectChange('kycStatus', status)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5 cursor-pointer"
                  />
                  <span className={`ml-3 text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className={`mt-4 pt-4 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2 flex-wrap">
            <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>Active filters:</span>

            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
              </span>
            )}

            {filters.status.map(status => (
              <span key={status} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Status: {status}
              </span>
            ))}

            {filters.channels.map(channel => (
              <span key={channel} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Channel: {channel}
              </span>
            ))}

            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Date: {filters.dateRange.start || '...'} - {filters.dateRange.end || '...'}
              </span>
            )}

            {(filters.amountRange.min || filters.amountRange.max) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Amount: ${filters.amountRange.min || '0'} - ${filters.amountRange.max || '∞'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}