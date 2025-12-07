import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle, XCircle, AlertTriangle, Clock, 
  User, Filter, Search, ArrowUp, Eye, MessageSquare
} from 'lucide-react';

const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const STATUS_COLORS = {
  active: 'bg-red-100 text-red-800',
  acknowledged: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  suppressed: 'bg-gray-100 text-gray-800'
};

const AlertManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    severity: '',
    status: '',
    assigned_to: '',
    start_date: '',
    end_date: ''
  });
  const [sortBy, setSortBy] = useState('triggered_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(50);

  useEffect(() => {
    fetchAlerts();
  }, [filters, sortBy, sortOrder, currentPage]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: (currentPage * pageSize).toString(),
        sort_by: sortBy,
        sort_order: sortOrder
      });

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key === 'severity' || key === 'status') {
            params.append(`${key}s`, value); // API expects plural form
          } else {
            params.append(key, value);
          }
        }
      });

      const response = await fetch(`/api/alerts/?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      } else {
        setError('Failed to fetch alerts');
      }
    } catch (err) {
      setError('Network error while fetching alerts');
    } finally {
      setLoading(false);
    }
  };

  const updateAlert = async (alertId, updates) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        // Update local state
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, ...updates } : alert
        ));
        return true;
      } else {
        setError('Failed to update alert');
        return false;
      }
    } catch (err) {
      setError('Network error while updating alert');
      return false;
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { 
                ...alert, 
                status: 'acknowledged',
                acknowledged_at: new Date().toISOString()
              } 
            : alert
        ));
      } else {
        setError('Failed to acknowledge alert');
      }
    } catch (err) {
      setError('Network error while acknowledging alert');
    }
  };

  const resolveAlert = async (alertId, notes = '') => {
    try {
      const response = await fetch(`/api/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notes })
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { 
                ...alert, 
                status: 'resolved',
                resolved_at: new Date().toISOString()
              } 
            : alert
        ));
      } else {
        setError('Failed to resolve alert');
      }
    } catch (err) {
      setError('Network error while resolving alert');
    }
  };

  const escalateAlert = async (alertId) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}/escalate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { 
                ...alert, 
                escalated: true,
                escalated_at: new Date().toISOString()
              } 
            : alert
        ));
      } else {
        setError('Failed to escalate alert');
      }
    } catch (err) {
      setError('Network error while escalating alert');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedAlerts.length === 0) return;

    try {
      const endpoint = action === 'acknowledge' ? 'bulk/acknowledge' : 'bulk/resolve';
      const response = await fetch(`/api/alerts/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ alert_ids: selectedAlerts })
      });

      if (response.ok) {
        await fetchAlerts(); // Refresh the list
        setSelectedAlerts([]);
      } else {
        setError(`Failed to ${action} selected alerts`);
      }
    } catch (err) {
      setError(`Network error while performing bulk ${action}`);
    }
  };

  const handleSelectAlert = (alertId) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlerts.length === alerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(alerts.map(alert => alert.id));
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Bell className="h-4 w-4" />;
      case 'low':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Alert Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Monitor and manage fraud detection alerts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filters.severity}
            onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
            <option value="suppressed">Suppressed</option>
          </select>

          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => setFilters(prev => ({ ...prev, start_date: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters(prev => ({ ...prev, end_date: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bulk Actions */}
        {selectedAlerts.length > 0 && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedAlerts.length} alert{selectedAlerts.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => handleBulkAction('acknowledge')}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Acknowledge
            </button>
            <button
              onClick={() => handleBulkAction('resolve')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Resolve
            </button>
            <button
              onClick={() => setSelectedAlerts([])}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="divide-y divide-gray-200">
        {alerts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No alerts match your current filters
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedAlerts.includes(alert.id)}
                  onChange={() => handleSelectAlert(alert.id)}
                  className="mt-1 rounded border-gray-300"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${SEVERITY_COLORS[alert.severity]}`}>
                        {getSeverityIcon(alert.severity)}
                        <span className="ml-1">{alert.severity.toUpperCase()}</span>
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[alert.status]}`}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                      {alert.escalated && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Escalated
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTimeAgo(alert.triggered_at)}
                    </div>
                  </div>

                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {alert.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.message}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {alert.transaction_id && (
                        <span>Transaction: {alert.transaction_id}</span>
                      )}
                      {alert.customer_id && (
                        <span>Customer: {alert.customer_id}</span>
                      )}
                      {alert.risk_score && (
                        <span>Risk Score: {alert.risk_score.toFixed(2)}</span>
                      )}
                      {alert.assigned_to && (
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {alert.assigned_to}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {alert.status === 'active' && (
                        <>
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Resolve
                          </button>
                          {!alert.escalated && (
                            <button
                              onClick={() => escalateAlert(alert.id)}
                              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Escalate
                            </button>
                          )}
                        </>
                      )}
                      {alert.status === 'acknowledged' && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {alerts.length === pageSize && (
        <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage + 1}
          </span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-3 py-1 text-sm border border-gray-300 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertManagement;