import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Play, Pause, AlertTriangle, 
  CheckCircle, XCircle, Filter, Search, Tag
} from 'lucide-react';

const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const AlertRulesList = ({ onCreateRule, onEditRule, onDeleteRule }) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRules, setSelectedRules] = useState([]);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/alert-rules/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRules(data);
      } else {
        setError('Failed to fetch alert rules');
      }
    } catch (err) {
      setError('Network error while fetching rules');
    } finally {
      setLoading(false);
    }
  };

  const toggleRuleStatus = async (ruleId, isActive) => {
    try {
      const endpoint = isActive ? 'deactivate' : 'activate';
      const response = await fetch(`/api/alert-rules/${ruleId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Update local state
        setRules(prev => prev.map(rule => 
          rule.id === ruleId ? { ...rule, is_active: !isActive } : rule
        ));
      } else {
        setError(`Failed to ${endpoint} rule`);
      }
    } catch (err) {
      setError('Network error while updating rule status');
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/alert-rules/${ruleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setRules(prev => prev.filter(rule => rule.id !== ruleId));
          if (onDeleteRule) {
            onDeleteRule(ruleId);
          }
        } else {
          setError('Failed to delete rule');
        }
      } catch (err) {
        setError('Network error while deleting rule');
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRules.length === 0) return;

    try {
      const promises = selectedRules.map(ruleId => {
        if (action === 'activate') {
          return fetch(`/api/alert-rules/${ruleId}/activate`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
        } else if (action === 'deactivate') {
          return fetch(`/api/alert-rules/${ruleId}/deactivate`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
        }
      });

      await Promise.all(promises);
      
      // Refresh rules list
      await fetchRules();
      setSelectedRules([]);
    } catch (err) {
      setError(`Failed to ${action} selected rules`);
    }
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !severityFilter || rule.severity === severityFilter;
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'active' && rule.is_active) ||
                         (statusFilter === 'inactive' && !rule.is_active);
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleSelectRule = (ruleId) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRules.length === filteredRules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(filteredRules.map(rule => rule.id));
    }
  };

  if (loading) {
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
            <h2 className="text-xl font-semibold text-gray-900">Alert Rules</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage fraud detection alert rules and conditions
            </p>
          </div>
          <button
            onClick={onCreateRule}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedRules.length > 0 && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedRules.length} rule{selectedRules.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Deactivate
            </button>
            <button
              onClick={() => setSelectedRules([])}
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

      {/* Rules Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRules.length === filteredRules.length && filteredRules.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conditions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRules.includes(rule.id)}
                    onChange={() => handleSelectRule(rule.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {rule.name}
                    </div>
                    {rule.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {rule.description}
                      </div>
                    )}
                    {rule.tags && rule.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[rule.severity]}`}>
                    {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {rule.conditions.length} condition{rule.conditions.length > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-500">
                    {rule.condition_logic} logic
                  </div>
                  <div className="text-xs text-gray-400">
                    Threshold: {rule.threshold_count} in {rule.time_window_minutes}min
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {rule.is_active ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <span className={`text-sm ${rule.is_active ? 'text-green-700' : 'text-gray-500'}`}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>{new Date(rule.created_at).toLocaleDateString()}</div>
                  <div className="text-xs">by {rule.created_by}</div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => toggleRuleStatus(rule.id, rule.is_active)}
                      className={`p-1 rounded hover:bg-gray-100 ${
                        rule.is_active ? 'text-yellow-600' : 'text-green-600'
                      }`}
                      title={rule.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => onEditRule(rule)}
                      className="p-1 text-blue-600 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1 text-red-600 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRules.length === 0 && !loading && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alert rules found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || severityFilter || statusFilter
                ? 'Try adjusting your filters'
                : 'Get started by creating your first alert rule'
              }
            </p>
            {!searchTerm && !severityFilter && !statusFilter && (
              <div className="mt-6">
                <button
                  onClick={onCreateRule}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert Rule
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertRulesList;