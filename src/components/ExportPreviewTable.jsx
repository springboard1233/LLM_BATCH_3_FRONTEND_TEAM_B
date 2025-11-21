function ExportPreviewTable({ exportData, exportFormat }) {
  if (!exportData.length) {
    return (
      <div className="text-center text-gray-400 py-8 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
        No preview data yet. Click Preview to generate sample data.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-4 text-left font-medium">Transaction ID</th>
            <th className="p-4 text-left font-medium">Date</th>
            <th className="p-4 text-left font-medium">Amount</th>
            <th className="p-4 text-left font-medium">Status</th>
            <th className="p-4 text-left font-medium">Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {exportData.map((row) => (
            <tr 
              key={row.id} 
              className="border-b border-white/10 hover:bg-white/5"
            >
              <td className="p-4">{row.id}</td>
              <td className="p-4">{new Date(row.date).toLocaleDateString()}</td>
              <td className="p-4">${row.amount.toFixed(2)}</td>
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