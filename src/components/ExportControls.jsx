import { useState } from 'react'

function ExportControls({
  exportFormat,
  setExportFormat,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  exportData,
  setExportData,
  isExporting,
  setIsExporting,
  setToast,
  transactions
}) {
  const generatePreviewData = () => {
    // Filter transactions based on date range
    const filteredData = transactions.filter(tx => {
      const txDate = new Date(tx.date)
      return txDate >= startDate && txDate <= endDate
    })

    // Take first 5 transactions for preview
    setExportData(filteredData.slice(0, 5))
    
    setToast({
      type: 'info',
      message: 'Preview data generated successfully'
    })
  }

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500))

      let exportContent = ''
      
      switch (exportFormat) {
        case 'CSV':
          exportContent = convertToCSV(exportData)
          downloadFile(exportContent, 'export.csv', 'text/csv')
          break
        case 'JSON':
          exportContent = JSON.stringify(exportData, null, 2)
          downloadFile(exportContent, 'export.json', 'application/json')
          break
        case 'Report':
          exportContent = generateReport(exportData)
          downloadFile(exportContent, 'report.txt', 'text/plain')
          break
      }

      setToast({
        type: 'success',
        message: `Export completed successfully as ${exportFormat}`
      })
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Export failed. Please try again.'
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Export Format</label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="CSV">CSV</option>
            <option value="JSON">JSON</option>
            <option value="Report">Report</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            value={startDate.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button
            onClick={generatePreviewData}
            className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Preview
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || !exportData.length}
            className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function convertToCSV(data) {
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row => Object.values(row).join(','))
  return [headers, ...rows].join('\n')
}

function generateReport(data) {
  return data.map(row => 
    Object.entries(row)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  ).join('\n\n')
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default ExportControls