import React, { useState, useEffect } from 'react';
import {
  Bell, AlertTriangle, TrendingUp, Users, Clock, 
  ArrowUp, CheckCircle, XCircle, User, Zap
} from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';

const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const RealtimeAlertDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [workload, setWorkload] = useState(null);
  const [escalationQueue, setEscalationQueue] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unassigned: 0,
    escalated: 0,
    avgAge: 0
  });

  const { isConnected, subscribe, on, off } = useWebSocket();

  useEffect(() => {
    // Subscribe to alerts channel
    if (isConnected) {
      subscribe('alerts');
    }

    // Listen for real-time alert events
    const handleAlertCreated = (event) => {
      if (event.type === 'alert_created') {
        setAlerts(prev => [event.data, ...prev].slice(0, 50));
        updateStats();
      }
    };

    const handleAlertUpdated = (event) => {
      if (event.type === 'alert_updated') {
        setAlerts(prev => prev.map(alert => 
          alert.alert_id === event.data.alert_id 
            ? { ...alert, ...event.data }
            : alert
        ));
        updateStats();
      }
    };

    const handleAlertEscalated = (event) => {
      if (event.type === 'alert_escalated') {
        setAlerts(prev => prev.map(alert =>
          alert.alert_id === event.data.alert_id
            ? { ...alert, escalated: true, escalation_level: event.data.escalation_level }
            : alert
        ));
        updateStats();
      }
    };

    on('realtime_event', handleAlertCreated);
    on('realtime_event', handleAlertUpdated);
    on('realtime_event', handleAlertEscalated);

    // Fetch initial data
    fetchWorkload();
    fetchEscalationQueue();
    fetchRecentAlerts();

    // Set up polling for workload and escalation queue
    const workloadInterval = setInterval(fetchWorkload, 30000); // Every 30 seconds
    const queueInterval = setInterval(fetchEscalationQueue, 60000); // Every minute

    return () => {
      off('realtime_event', handleAlertCreated);
      off('realtime_event', handleAlertUpdated);
      off('realtime_event', handleAlertEscalated);
      clearInterval(workloadInterval);
      clearInterval(queueInterval);
    };
  }, [isConnected]);

  const fetchWorkload = async () => {
    try {
      const response = await fetch('/api/alert-escalation/workload', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkload(data);
        setStats({
          total: data.total_active || 0,
          unassigned: data.unassigned || 0,
          escalated: data.escalated || 0,
          avgAge: Math.round(data.average_age_minutes || 0)
        });
      }
    } catch (error) {
      console.error('Error fetching workload:', error);
    }
  };

  const fetchEscalationQueue = async () => {
    try {
      const response = await fetch('/api/alert-escalation/escalation-queue', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEscalationQueue(data);
      }
    } catch (error) {
      console.error('Error fetching escalation queue:', error);
    }
  };

  const fetchRecentAlerts = async () => {
    try {
      const response = await fetch('/api/alerts/?limit=50&sort_order=desc', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
    }
  };

  const updateStats = () => {
    // Recalculate stats from current alerts
    const activeAlerts = alerts.filter(a => a.status === 'active');
    setStats({
      total: activeAlerts.length,
      unassigned: activeAlerts.filter(a => !a.assigned_to).length,
      escalated: activeAlerts.filter(a => a.escalated).length,
      avgAge: activeAlerts.length > 0
        ? Math.round(activeAlerts.reduce((sum, a) => {
            const age = (new Date() - new Date(a.triggered_at)) / 1000 / 60;
            return sum + age;
          }, 0) / activeAlerts.length)
        : 0
    });
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

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Real-time Alert Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unassigned</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.unassigned}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Escalated</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.escalated}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ArrowUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Age</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgAge}m</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Workload Distribution */}
      {workload && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workload Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* By Severity */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">By Severity</h4>
              <div className="space-y-2">
                {Object.entries(workload.by_severity || {}).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[severity]}`}>
                      {severity.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By Analyst */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">By Analyst</h4>
              <div className="space-y-2">
                {Object.entries(workload.by_analyst || {}).slice(0, 5).map(([analyst, count]) => (
                  <div key={analyst} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{analyst}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Escalation Queue */}
      {escalationQueue.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Escalations</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {escalationQueue.length} pending
            </span>
          </div>
          <div className="space-y-3">
            {escalationQueue.slice(0, 5).map((item) => (
              <div key={item.alert_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Triggered {formatTimeAgo(item.triggered_at)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${SEVERITY_COLORS[item.severity]}`}>
                    {item.severity.toUpperCase()}
                  </span>
                  <ArrowUp className="h-4 w-4 text-red-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Alerts Stream */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Alert Stream</h3>
          <Zap className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {alerts.slice(0, 20).map((alert, index) => (
            <div
              key={alert.alert_id || alert.id || index}
              className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${SEVERITY_COLORS[alert.severity]}`}>
                    {alert.severity?.toUpperCase()}
                  </span>
                  {alert.escalated && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Escalated
                    </span>
                  )}
                  {alert.assigned_to && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <User className="h-3 w-3 mr-1" />
                      {alert.assigned_to}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {alert.title || alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(alert.triggered_at)}
                  {alert.transaction_id && ` • TX: ${alert.transaction_id}`}
                </p>
              </div>
              <div className="ml-4">
                {alert.status === 'resolved' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : alert.status === 'acknowledged' ? (
                  <Clock className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealtimeAlertDashboard;