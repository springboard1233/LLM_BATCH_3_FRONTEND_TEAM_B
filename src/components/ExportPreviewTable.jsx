import useResponsive from '../hooks/useResponsive'

function ExportPreviewTable({ exportData, exportFormat }) {
  const { isMobile } = useResponsive()

  if (!exportData.length) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        No preview data yet. Click Preview to generate sample data.
      </div>
    )
  }

  // Mobile: Card-based layout
  if (isMobile) {
    return (
      <div className="space-y-4">
        {exportData.map((row) => (
          <div 
            key={row.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{row.id}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${row.status === 'Legitimate' ? 'bg-green-900 text-green-300' :
                  row.status === 'Fraud' ? 'bg-red-900 text-red-300' :
                  'bg-yellow-900 text-yellow-300'}`}>
                {row.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Date(row.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${row.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Risk Level:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${row.riskLevel === 'Low' ? 'bg-green-900 text-green-300' :
                    row.riskLevel === 'High' ? 'bg-red-900 text-red-300' :
                    'bg-yellow-900 text-yellow-300'}`}>
                  {row.riskLevel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Desktop: Table layout
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Transaction ID</th>
            <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Date</th>
            <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Amount</th>
            <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Status</th>
            <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {exportData.map((row) => (
            <tr 
              key={row.id} 
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="p-4 text-gray-900 dark:text-gray-100">{row.id}</td>
              <td className="p-4 text-gray-900 dark:text-gray-100">{new Date(row.date).toLocaleDateString()}</td>
              <td className="p-4 text-gray-900 dark:text-gray-100">${row.amount.toFixed(2)}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-sm
                  ${row.status === 'Legitimate' ? 'bg-green-900 text-green-300' :
                    row.status === 'Fraud' ? 'bg-red-900 text-red-300' :
                    'bg-yellow-900 text-yellow-300'}`}>
                  {row.status}
                </span>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-sm
                  ${row.riskLevel === 'Low' ? 'bg-green-900 text-green-300' :
                    row.riskLevel === 'High' ? 'bg-red-900 text-red-300' :
                    'bg-yellow-900 text-yellow-300'}`}>
                  {row.riskLevel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExportPreviewTable