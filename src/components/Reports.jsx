import { useState, useEffect } from 'react'

const REPORT_TYPES = {
  TRANSACTION_SUMMARY: {
    id: 'transaction-summary',
    label: 'Transaction Summary',
    description: 'Overview of all transactions with fraud detection statistics'
  },
  RISK_ANALYSIS: {
    id: 'risk-analysis',
    label: 'Risk Analysis',
    description: 'Detailed analysis of transaction risk levels and patterns'
  },
  FRAUD_DETECTION: {
    id: 'fraud-detection',
    label: 'Fraud Detection',
    description: 'Summary of detected fraudulent activities and prevention metrics'
  },
  KYC_COMPLIANCE: {
    id: 'kyc-compliance',
    label: 'KYC Compliance',
    description: 'Customer verification and compliance status report'
  }
}

function Reports() {
  const [transactions, setTransactions] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })

  useEffect(() => {
    // Generate last 30 days range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 30)

    setDateRange({
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    })

    // Generate dummy transactions with random recent dates
    const dummyData = Array.from({ length: 50 }, (_, i) => {
      const randomDate = new Date()
      randomDate.setDate(endDate.getDate() - Math.floor(Math.random() * 30))
      return {
        id: i + 1,
        date: randomDate.toISOString(),
        amount: parseFloat((Math.random() * 2000).toFixed(2)),
        status: ['Completed', 'Pending', 'Failed', 'Fraud'][Math.floor(Math.random() * 4)],
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        channel: ['Online', 'POS', 'ATM'][Math.floor(Math.random() * 3)],
        customerId: `CUST${Math.floor(Math.random() * 10) + 1}`,
        kycStatus: Math.random() > 0.3
      }
    })
    setTransactions(dummyData)
  }, [])

  const generateReport = async (reportType) => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const reportData = generateReportData(reportType, transactions, dateRange)
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType.id}-report.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-6">Reports Generation</h2>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full p-2 bg-black/20 border border-white/10 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full p-2 bg-black/20 border border-white/10 rounded-lg"
            />
          </div>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(REPORT_TYPES).map((report) => (
            <div
              key={report.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer
                ${selectedReport?.id === report.id 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-white/10 hover:border-white/30'}`}
              onClick={() => setSelectedReport(report)}
            >
              <h3 className="font-semibold mb-2">{report.label}</h3>
              <p className="text-sm text-gray-400">{report.description}</p>
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={() => selectedReport && generateReport(selectedReport)}
            disabled={!selectedReport || isGenerating}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 
              disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isGenerating ? 'Generating Report...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Preview */}
      {selectedReport && (
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold mb-4">Report Preview</h3>
          <ReportPreview type={selectedReport} transactions={transactions} dateRange={dateRange} />
        </div>
      )}
    </div>
  )
}

function ReportPreview({ type, transactions, dateRange }) {
  const data = generateReportData(type, transactions, dateRange)
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <span className="text-sm text-gray-400">{key}</span>
          <span className="font-mono text-sm">{JSON.stringify(value, null, 2)}</span>
        </div>
      ))}
    </div>
  )
}

function generateReportData(reportType, transactions, dateRange) {
  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date)
    return txDate >= new Date(dateRange.start) && txDate <= new Date(dateRange.end)
  })

  if (filteredTransactions.length === 0) {
    return { message: 'No transactions found for selected date range.' }
  }

  switch (reportType.id) {
    case 'transaction-summary':
      return {
        totalTransactions: filteredTransactions.length,
        totalAmount: filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2),
        averageAmount: (
          filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0) /
          filteredTransactions.length
        ).toFixed(2),
        transactionsByStatus: filteredTransactions.reduce((acc, tx) => {
          acc[tx.status] = (acc[tx.status] || 0) + 1
          return acc
        }, {})
      }

    case 'risk-analysis':
      return {
        riskLevels: filteredTransactions.reduce((acc, tx) => {
          acc[tx.riskLevel] = (acc[tx.riskLevel] || 0) + 1
          return acc
        }, {}),
        highRiskAmount: filteredTransactions
          .filter(tx => tx.riskLevel === 'High')
          .reduce((sum, tx) => sum + tx.amount, 0).toFixed(2),
        riskByChannel: filteredTransactions.reduce((acc, tx) => {
          if (!acc[tx.channel]) acc[tx.channel] = {}
          acc[tx.channel][tx.riskLevel] = (acc[tx.channel][tx.riskLevel] || 0) + 1
          return acc
        }, {})
      }

    case 'fraud-detection':
      return {
        fraudulentTransactions: filteredTransactions.filter(tx => tx.status === 'Fraud').length,
        fraudAmount: filteredTransactions
          .filter(tx => tx.status === 'Fraud')
          .reduce((sum, tx) => sum + tx.amount, 0).toFixed(2),
        fraudByChannel: filteredTransactions
          .filter(tx => tx.status === 'Fraud')
          .reduce((acc, tx) => {
            acc[tx.channel] = (acc[tx.channel] || 0) + 1
            return acc
          }, {})
      }

    case 'kyc-compliance':
      return {
        totalCustomers: new Set(filteredTransactions.map(tx => tx.customerId)).size,
        kycCompliant: filteredTransactions.filter(tx => tx.kycStatus).length,
        kycPending: filteredTransactions.filter(tx => !tx.kycStatus).length,
        complianceRate: (
          (filteredTransactions.filter(tx => tx.kycStatus).length / filteredTransactions.length) * 100
        ).toFixed(2) + '%'
      }

    default:
      return {}
  }
}

export default Reports
