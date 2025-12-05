import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import AlertRulesList from '../components/AlertRulesList';
import AlertRuleBuilder from '../components/AlertRuleBuilder';
import AlertManagement from '../components/AlertManagement';

const AlertConfiguration = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'manage'
  const [selectedRule, setSelectedRule] = useState(null);

  const handleCreateRule = () => {
    setSelectedRule(null);
    setCurrentView('create');
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setCurrentView('edit');
  };

  const handleSaveRule = async (ruleData) => {
    try {
      const url = selectedRule 
        ? `/api/alert-rules/${selectedRule.id}`
        : '/api/alert-rules/';
      
      const method = selectedRule ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(ruleData)
      });

      if (response.ok) {
        setCurrentView('list');
        setSelectedRule(null);
        // Show success message
        alert(selectedRule ? 'Rule updated successfully!' : 'Rule created successfully!');
      } else {
        const error = await response.json();
        throw new Error(error.detail?.message || 'Failed to save rule');
      }
    } catch (error) {
      console.error('Error saving rule:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleTestRule = async (ruleData) => {
    try {
      // Generate sample test data
      const testData = [
        {
          id: 'test_1',
          amount: 5000,
          risk_score: 0.8,
          fraud_probability: 0.9,
          customer_id: 'CUST001',
          channel: 'online',
          country: 'US',
          currency: 'USD',
          merchant_id: 'MERCH001'
        },
        {
          id: 'test_2',
          amount: 100,
          risk_score: 0.2,
          fraud_probability: 0.1,
          customer_id: 'CUST002',
          channel: 'atm',
          country: 'CA',
          currency: 'CAD',
          merchant_id: 'MERCH002'
        },
        {
          id: 'test_3',
          amount: 2500,
          risk_score: 0.6,
          fraud_probability: 0.7,
          customer_id: 'CUST003',
          channel: 'mobile',
          country: 'UK',
          currency: 'GBP',
          merchant_id: 'MERCH003'
        }
      ];

      const response = await fetch('/api/alert-rules/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(ruleData)
      });

      if (response.ok) {
        // For now, return mock test results
        // In a real implementation, you'd send the test data to a test endpoint
        return {
          total_transactions: testData.length,
          matched_transactions: Math.floor(Math.random() * testData.length),
          match_rate: Math.random(),
          matched_ids: ['test_1'],
          average_execution_time_ms: Math.random() * 10 + 1
        };
      } else {
        throw new Error('Failed to test rule');
      }
    } catch (error) {
      console.error('Error testing rule:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedRule(null);
  };

  const handleDeleteRule = (ruleId) => {
    // Rule deletion is handled in the AlertRulesList component
    console.log('Rule deleted:', ruleId);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
      case 'edit':
        return (
          <AlertRuleBuilder
            rule={selectedRule}
            onSave={handleSaveRule}
            onCancel={handleCancel}
            onTest={handleTestRule}
          />
        );
      case 'manage':
        return <AlertManagement />;
      case 'list':
      default:
        return (
          <AlertRulesList
            onCreateRule={handleCreateRule}
            onEditRule={handleEditRule}
            onDeleteRule={handleDeleteRule}
          />
        );
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'create':
        return 'Create Alert Rule';
      case 'edit':
        return 'Edit Alert Rule';
      case 'manage':
        return 'Alert Management';
      case 'list':
      default:
        return 'Alert Configuration';
    }
  };

  const showBackButton = currentView !== 'list';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={handleCancel}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Back
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-gray-600 mt-1">
                  {currentView === 'list' && 'Configure and manage fraud detection alert rules'}
                  {currentView === 'create' && 'Create a new alert rule for fraud detection'}
                  {currentView === 'edit' && 'Modify an existing alert rule'}
                  {currentView === 'manage' && 'Monitor and manage active alerts'}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            {currentView === 'list' && (
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setCurrentView('list')}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-white text-gray-900 shadow-sm"
                >
                  Rules
                </button>
                <button
                  onClick={() => setCurrentView('manage')}
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900"
                >
                  Alerts
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default AlertConfiguration;