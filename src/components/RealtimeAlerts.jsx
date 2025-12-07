/**
 * Real-time alerts component
 */
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useRealtimeAlerts } from '../hooks/useWebSocket';

const AlertIcon = ({ alertType, severity }) => {
  const iconProps = { className: "w-5 h-5" };

  if (severity === 'critical') {
    return <AlertTriangle {...iconProps} className="w-5 h-5 text-red-500" />;
  }

  switch (alertType) {
    case 'fraud':
      return <Shield {...iconProps} className="w-5 h-5 text-red-500" />;
    case 'system':
      return <AlertCircle {...iconProps} className="w-5 h-5 text-yellow-500" />;
    case 'performance':
      return <TrendingUp {...iconProps} className="w-5 h-5 text-blue-500" />;
    default:
      return <Bell {...iconProps} className="w-5 h-5 text-gray-500" />;
  }
};

const AlertItem = ({ alert, onMarkAsRead, onDismiss }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`
      border-l-4 p-4 mb-3 rounded-r-lg shadow-sm transition-all duration-200
      ${getSeverityColor(alert.severity)}
      ${alert.read ? 'opacity-75' : ''}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <AlertIcon alertType={alert.alert_type} severity={alert.severity} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {alert.alert_type?.toUpperCase()} Alert
              </h4>
              <span className={`
                px-2 py-1 text-xs font-medium rounded-full
                ${alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'}
              `}>
                {alert.severity}
              </span>
              {!alert.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            
            <p className="text-sm text-gray-700 mb-2">
              {alert.message}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatTime(alert.timestamp)}</span>
              </div>
              
              {alert.transaction_id && (
                <span>TX: {alert.transaction_id.slice(-8)}</span>
              )}
              
              {alert.customer_id && (
                <span>Customer: {alert.customer_id.slice(-6)}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          {!alert.read && (
            <button
              onClick={() => onMarkAsRead(alert.id)}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
              title="Mark as read"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => onDismiss(alert.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const RealtimeAlerts = ({ className = '', maxVisible = 5 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  
  const { 
    alerts, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAlerts 
  } = useRealtimeAlerts((newAlert) => {
    // Auto-open panel for critical alerts
    if (newAlert.severity === 'critical') {
      setIsOpen(true);
    }
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${newAlert.alert_type?.toUpperCase()} Alert`, {
        body: newAlert.message,
        icon: '/favicon.ico',
        tag: newAlert.id,
      });
    }
  });

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const visibleAlerts = alerts
    .filter(alert => !dismissedAlerts.has(alert.id))
    .slice(0, maxVisible);

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleClearAll = () => {
    clearAlerts();
    setDismissedAlerts(new Set());
  };

  return (
    <div className={`relative ${className}`}>
      {/* Alert Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Alerts Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Real-time Alerts
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="max-h-96 overflow-y-auto">
            {visibleAlerts.length > 0 ? (
              <div className="p-4">
                {visibleAlerts.map((alert) => (
                  <AlertItem
                    key={alert.id}
                    alert={alert}
                    onMarkAsRead={markAsRead}
                    onDismiss={handleDismiss}
                  />
                ))}
                
                {alerts.length > maxVisible && (
                  <div className="text-center py-2">
                    <span className="text-sm text-gray-500">
                      {alerts.length - maxVisible} more alerts...
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No alerts at the moment</p>
                <p className="text-xs text-gray-400 mt-1">
                  You'll be notified of any fraud or system alerts here
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default RealtimeAlerts;