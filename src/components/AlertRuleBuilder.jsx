import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, TestTube, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import NotificationSettings from './NotificationSettings';

const OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'greater_equal', label: 'Greater or Equal' },
  { value: 'less_equal', label: 'Less or Equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
  { value: 'in', label: 'In List' },
  { value: 'not_in', label: 'Not In List' },
  { value: 'regex', label: 'Regex Match' },
  { value: 'between', label: 'Between' }
];

const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
];

const TRANSACTION_FIELDS = [
  { value: 'amount', label: 'Amount', type: 'number' },
  { value: 'risk_score', label: 'Risk Score', type: 'number' },
  { value: 'fraud_probability', label: 'Fraud Probability', type: 'number' },
  { value: 'customer_id', label: 'Customer ID', type: 'string' },
  { value: 'channel', label: 'Channel', type: 'string' },
  { value: 'country', label: 'Country', type: 'string' },
  { value: 'currency', label: 'Currency', type: 'string' },
  { value: 'merchant_id', label: 'Merchant ID', type: 'string' },
  { value: 'payment_method', label: 'Payment Method', type: 'string' },
  { value: 'device_fingerprint.risk_score', label: 'Device Risk Score', type: 'number' },
  { value: 'geolocation.country', label: 'Geo Country', type: 'string' }
];

const AlertRuleBuilder = ({ rule = null, onSave, onCancel, onTest }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    conditions: [{ field: 'amount', operator: 'greater_than', value: '', case_sensitive: true }],
    condition_logic: 'AND',
    severity: 'medium',
    threshold_count: 1,
    time_window_minutes: 5,
    cooldown_minutes: 15,
    escalation_delay_minutes: 30,
    notification_channels: [],
    tags: []
  });

  const [validation, setValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || '',
        description: rule.description || '',
        conditions: rule.conditions || [{ field: 'amount', operator: 'greater_than', value: '', case_sensitive: true }],
        condition_logic: rule.condition_logic || 'AND',
        severity: rule.severity || 'medium',
        threshold_count: rule.threshold_count || 1,
        time_window_minutes: rule.time_window_minutes || 5,
        cooldown_minutes: rule.cooldown_minutes || 15,
        escalation_delay_minutes: rule.escalation_delay_minutes || 30,
        notification_channels: rule.notification_channels || [],
        tags: rule.tags || []
      });
    }
  }, [rule]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation when form changes
    if (validation) {
      setValidation(null);
    }
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      conditions: newConditions
    }));
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { field: 'amount', operator: 'greater_than', value: '', case_sensitive: true }
      ]
    }));
  };

  const removeCondition = (index) => {
    if (formData.conditions.length > 1) {
      const newConditions = formData.conditions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        conditions: newConditions
      }));
    }
  };

  const validateRule = async () => {
    setIsValidating(true);
    try {
      const response = await fetch('/api/alert-rules/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const validationResult = await response.json();
        setValidation(validationResult);
      } else {
        setValidation({
          is_valid: false,
          errors: ['Failed to validate rule'],
          warnings: [],
          conflicts: []
        });
      }
    } catch (error) {
      setValidation({
        is_valid: false,
        errors: ['Network error during validation'],
        warnings: [],
        conflicts: []
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving rule:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (onTest) {
      try {
        const results = await onTest(formData);
        setTestResults(results);
      } catch (error) {
        console.error('Error testing rule:', error);
      }
    }
  };

  const renderCondition = (condition, index) => {
    const fieldInfo = TRANSACTION_FIELDS.find(f => f.value === condition.field);
    const isListOperator = ['in', 'not_in'].includes(condition.operator);
    const isBetweenOperator = condition.operator === 'between';

    return (
      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Condition {index + 1}
          </span>
          {formData.conditions.length > 1 && (
            <button
              type="button"
              onClick={() => removeCondition(index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Field Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field
            </label>
            <select
              value={condition.field}
              onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TRANSACTION_FIELDS.map(field => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          {/* Operator Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operator
            </label>
            <select
              value={condition.operator}
              onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {OPERATORS.map(op => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            {isListOperator ? (
              <input
                type="text"
                value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                onChange={(e) => {
                  const values = e.target.value.split(',').map(v => v.trim());
                  handleConditionChange(index, 'value', values);
                }}
                placeholder="value1, value2, value3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : isBetweenOperator ? (
              <div className="flex space-x-2">
                <input
                  type={fieldInfo?.type === 'number' ? 'number' : 'text'}
                  value={Array.isArray(condition.value) ? condition.value[0] || '' : ''}
                  onChange={(e) => {
                    const currentValue = Array.isArray(condition.value) ? condition.value : ['', ''];
                    currentValue[0] = e.target.value;
                    handleConditionChange(index, 'value', currentValue);
                  }}
                  placeholder="Min"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type={fieldInfo?.type === 'number' ? 'number' : 'text'}
                  value={Array.isArray(condition.value) ? condition.value[1] || '' : ''}
                  onChange={(e) => {
                    const currentValue = Array.isArray(condition.value) ? condition.value : ['', ''];
                    currentValue[1] = e.target.value;
                    handleConditionChange(index, 'value', currentValue);
                  }}
                  placeholder="Max"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <input
                type={fieldInfo?.type === 'number' ? 'number' : 'text'}
                value={condition.value}
                onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Case Sensitivity for String Fields */}
        {fieldInfo?.type === 'string' && (
          <div className="mt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={condition.case_sensitive}
                onChange={(e) => handleConditionChange(index, 'case_sensitive', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Case sensitive</span>
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {rule ? 'Edit Alert Rule' : 'Create Alert Rule'}
        </h2>
        <p className="text-gray-600 mt-1">
          Configure conditions and settings for fraud detection alerts
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rule Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter rule name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity *
            </label>
            <select
              value={formData.severity}
              onChange={(e) => handleInputChange('severity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SEVERITY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe what this rule detects"
          />
        </div>

        {/* Conditions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Conditions</h3>
            <div className="flex items-center space-x-2">
              <select
                value={formData.condition_logic}
                onChange={(e) => handleInputChange('condition_logic', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="AND">All conditions (AND)</option>
                <option value="OR">Any condition (OR)</option>
              </select>
              <button
                type="button"
                onClick={addCondition}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Condition
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {formData.conditions.map((condition, index) => renderCondition(condition, index))}
          </div>
        </div>

        {/* Notification Channels */}
        <div>
          <NotificationSettings
            channels={formData.notification_channels}
            onUpdate={(channels) => handleInputChange('notification_channels', channels)}
          />
        </div>

        {/* Threshold and Timing */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Threshold & Timing</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Threshold Count
              </label>
              <input
                type="number"
                min="1"
                value={formData.threshold_count}
                onChange={(e) => handleInputChange('threshold_count', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Window (min)
              </label>
              <input
                type="number"
                min="1"
                value={formData.time_window_minutes}
                onChange={(e) => handleInputChange('time_window_minutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cooldown (min)
              </label>
              <input
                type="number"
                min="0"
                value={formData.cooldown_minutes}
                onChange={(e) => handleInputChange('cooldown_minutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escalation Delay (min)
              </label>
              <input
                type="number"
                min="0"
                value={formData.escalation_delay_minutes}
                onChange={(e) => handleInputChange('escalation_delay_minutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Validation Results */}
        {validation && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              {validation.is_valid ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className={`font-medium ${validation.is_valid ? 'text-green-800' : 'text-red-800'}`}>
                {validation.is_valid ? 'Rule is valid' : 'Rule has validation errors'}
              </span>
            </div>

            {validation.errors.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-red-800 mb-1">Errors:</h4>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Warnings:</h4>
                <ul className="list-disc list-inside text-sm text-yellow-700">
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.conflicts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-orange-800 mb-1">Conflicts:</h4>
                <ul className="list-disc list-inside text-sm text-orange-700">
                  {validation.conflicts.map((conflict, index) => (
                    <li key={index}>{conflict}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Test Results */}
        {testResults && (
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-2">Test Results</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Transactions:</span>
                <div className="font-medium">{testResults.total_transactions}</div>
              </div>
              <div>
                <span className="text-blue-700">Matches:</span>
                <div className="font-medium">{testResults.matched_transactions}</div>
              </div>
              <div>
                <span className="text-blue-700">Match Rate:</span>
                <div className="font-medium">{(testResults.match_rate * 100).toFixed(1)}%</div>
              </div>
              <div>
                <span className="text-blue-700">Avg Time:</span>
                <div className="font-medium">{testResults.average_execution_time_ms?.toFixed(1)}ms</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={validateRule}
              disabled={isValidating}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {isValidating ? 'Validating...' : 'Validate'}
            </button>

            {onTest && (
              <button
                type="button"
                onClick={handleTest}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Rule
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || (validation && !validation.is_valid)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Rule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertRuleBuilder;