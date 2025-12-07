import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search, Download, Eye } from 'lucide-react'
import { useSettings } from './src/contexts/SettingsContext'

export default function TransactionTable({ transactions = [], isLoading = false, error = null, totalCount = null }) {
  const { effectiveTheme } = useSettings();
  const isDarkTheme = effectiveTheme === 'dark';
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const processedTransactions = useMemo(() => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.channel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'amount') {
        aVal = Number(aVal) || 0
        bVal = Number(bVal) || 0
      } else if (sortField === 'date') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      } else {
        aVal = String(aVal || '').toLowerCase()
        bVal = String(bVal || '').toLowerCase()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [transactions, sortField, sortDirection, searchTerm])

  // Use totalCount if provided (for server-side pagination), otherwise calculate from processed transactions
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : Math.ceil(processedTransactions.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedTransactions = processedTransactions.slice(startIndex, startIndex + pageSize)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
    return sortDirection === 'asc' ?
      <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600" /> :
      <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Fraud': 'bg-red-100 text-red-800 border-red-200',
      'Legitimate': 'bg-green-100 text-green-800 border-green-200',
      'Safe': 'bg-green-100 text-green-800 border-green-200'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status}
      </span>
    )
  }

  const getChannelBadge = (channel) => {
    const channelClasses = {
      'Mobile': 'bg-blue-100 text-blue-800',
      'ATM': 'bg-purple-100 text-purple-800',
      'POS': 'bg-orange-100 text-orange-800',
      'Web': 'bg-indigo-100 text-indigo-800',
      'online': 'bg-indigo-100 text-indigo-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${channelClasses[channel] || 'bg-gray-100 text-gray-800'}`}>
        {channel}
      </span>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading transactions: {error}</p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl shadow-sm border ${
      isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className={`px-6 py-4 border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Transaction Details</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkTheme 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <button className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isDarkTheme 
                ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}>
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                  isDarkTheme 
                    ? 'text-gray-300 hover:bg-gray-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>Transaction ID</span>
                  <SortIcon field="id" />
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                  isDarkTheme 
                    ? 'text-gray-300 hover:bg-gray-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => handleSort('customerId')}
              >
                <div className="flex items-center space-x-1">
                  <span>Customer ID</span>
                  <SortIcon field="customerId" />
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                  isDarkTheme 
                    ? 'text-gray-300 hover:bg-gray-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <SortIcon field="date" />
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                  isDarkTheme 
                    ? 'text-gray-300 hover:bg-gray-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => handleSort('channel')}
              >
                <div className="flex items-center space-x-1">
                  <span>Channel</span>
                  <SortIcon field="channel" />
                </div>
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                  isDarkTheme 
                    ? 'text-gray-300 hover:bg-gray-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <SortIcon field="amount" />
                </div>
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkTheme ? 'text-gray-300' : 'text-gray-500'
              }`}>
                KYC Status
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                  isDarkTheme 
                    ? 'text-gray-300 hover:bg-gray-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkTheme ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDarkTheme 
              ? 'bg-gray-800 divide-gray-700' 
              : 'bg-white divide-gray-200'
          }`}>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className={`ml-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>Loading transactions...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="8" className={`px-6 py-12 text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                  No transactions found
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction, index) => (
                <tr key={transaction.id || index} className={isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    {transaction.id || 'N/A'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                    {transaction.customerId || transaction.customer_id || 'N/A'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                    {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getChannelBadge(transaction.channel)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    ${Number(transaction.amount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.kycStatus || transaction.kyc ?
                      'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                      }`}>
                      {transaction.kycStatus || transaction.kyc ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {processedTransactions.length > 0 && (
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDarkTheme ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className={`border rounded px-2 py-1 text-sm ${
                isDarkTheme 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              of {totalCount !== null ? totalCount : processedTransactions.length} transactions
              {totalCount !== null && totalCount > processedTransactions.length && (
                <span className="ml-1 text-xs text-blue-500">
                  (showing {processedTransactions.length})
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkTheme 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkTheme 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}