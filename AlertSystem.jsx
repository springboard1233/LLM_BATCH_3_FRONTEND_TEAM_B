import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Info, X, Bell } from 'lucide-react'

export default function AlertSystem({ transactions = [] }) {
  const [alerts, setAlerts] = useState([])
  const [showAlerts, setShowAlerts] = useState(true)

  useEffect(() => {
    // Generate alerts based on transaction data
    const newAlerts = []
    
    // High-value fraud alert
    const highValueFraud = transactions.filter(t => 
      t.status === 'Fraud' && Number(t.amount) > 10000
    )
    
    if (highValueFraud.length > 0) {
      newAlerts.push({
        id: 'high-value-fraud',
        type: 'error',
        title: 'High-Value Fraud Detected',
        message: `${highValueFraud.length} high-value fraudulent transactions detected`,
        timestamp: new Date(),
        count: highValueFraud.length
      })
    }

    // Fraud rate alert
    const fraudRate = transactions.length > 0 ? 
      (transactions.filter(t => t.status === 'Fraud').length / transactions.length) * 100 : 0
    
    if (fraudRate > 25) {
      newAlerts.push({
        id: 'fraud-rate-high',
        type: 'warning',
        title: 'Elevated Fraud Rate',
        message: `Current fraud rate is ${fraudRate.toFixed(1)}% - above normal threshold`,
        timestamp: new Date()
      })
    }

    // System health alert
    newAlerts.push({
      id: 'system-healthy',
      type: 'success',
      title: 'System Operating Normally',
      message: 'All fraud detection systems are functioning properly',
      timestamp: new Date()
    })

    setAlerts(newAlerts)
  }, [transactions])

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getAlertStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
  }

  if (!showAlerts || alerts.length === 0) {
    return (
      <button
        onClick={() => setShowAlerts(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {alerts.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 space-y-2 z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">System Alerts</h3>
        <button
          onClick={() => setShowAlerts(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-lg p-4 shadow-sm ${getAlertStyles(alert.type)}`}
        >
          <div className="flex items-start space-x-3">
            {getAlertIcon(alert.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{alert.title}</h4>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm mt-1">{alert.message}</p>
              <p className="text-xs mt-2 opacity-75">
                {alert.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}