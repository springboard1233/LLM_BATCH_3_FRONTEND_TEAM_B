import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Bell, CheckCircle, XCircle, Loader } from 'lucide-react';

const NotificationSettings = ({ ruleId, channels = [], onUpdate }) => {
  const [activeChannels, setActiveChannels] = useState(channels);
  const [testingChannel, setTestingChannel] = useState(null);
  const [testResults, setTestResults] = useState({});

  const channelTypes = [
    {
      type: 'email',
      label: 'Email',
      icon: Mail,
      fields: [
        { name: 'to_email', label: 'Recipient Email', type: 'email', placeholder: 'analyst@company.com' }
      ]
    },
    {
      type: 'sms',
      label: 'SMS',
      icon: MessageSquare,
      fields: [
        { name: 'to_number', label: 'Phone Number', type: 'tel', placeholder: '+1234567890' }
      ]
    },
    {
      type: 'slack',
      label: 'Slack',
      icon: Send,
      fields: [
        { name: 'webhook_url', label: 'Webhook URL', type: 'url', placeholder: 'https://hooks.slack.com/...' },
        { name: 'channel', label: 'Channel', type: 'text', placeholder: '#fraud-alerts' }
      ]
    },
    {
      type: 'webhook',
      label: 'Webhook',
      icon: Bell,
      fields: [
        { name: 'url', label: 'Webhook URL', type: 'url', placeholder: 'https://api.example.com/webhook' },
        { name: 'method', label: 'HTTP Method', type: 'select', options: ['POST', 'PUT'], default: 'POST' }
      ]
    }
  ];

  const addChannel = (type) => {
    const channelType = channelTypes.find(ct => ct.type === type);
    const newChannel = {
      type,
      config: {},
      enabled: true
    };

    // Initialize config with default values
    channelType.fields.forEach(field => {
      if (field.default) {
        newChannel.config[field.name] = field.default;
      } else {
        newChannel.config[field.name] = '';
      }
    });

    setActiveChannels([...activeChannels, newChannel]);
  };

  const removeChannel = (index) => {
    const updated = activeChannels.filter((_, i) => i !== index);
    setActiveChannels(updated);
    if (onUpdate) {
      onUpdate(updated);
    }
  };

  const updateChannelConfig = (index, field, value) => {
    const updated = [...activeChannels];
    updated[index].config[field] = value;
    setActiveChannels(updated);
    if (onUpdate) {
      onUpdate(updated);
    }
  };

  const toggleChannel = (index) => {
    const updated = [...activeChannels];
    updated[index].enabled = !updated[index].enabled;
    setActiveChannels(updated);
    if (onUpdate) {
      onUpdate(updated);
    }
  };

  const testChannel = async (index) => {
    const channel = activeChannels[index];
    setTestingChannel(index);
    setTestResults({ ...testResults, [index]: null });

    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          channel_type: channel.type,
          config: channel.config
        })
      });

      if (response.ok) {
        setTestResults({ ...testResults, [index]: { success: true, message: 'Test notification sent successfully!' } });
      } else {
        const error = await response.json();
        setTestResults({ ...testResults, [index]: { success: false, message: error.detail || 'Test failed' } });
      }
    } catch (error) {
      setTestResults({ ...testResults, [index]: { success: false, message: 'Network error' } });
    } finally {
      setTestingChannel(null);
    }
  };

  const getChannelIcon = (type) => {
    const channelType = channelTypes.find(ct => ct.type === type);
    const Icon = channelType?.icon || Bell;
    return <Icon className="h-5 w-5" />;
  };

  const renderChannelFields = (channel, index) => {
    const channelType = channelTypes.find(ct => ct.type === channel.type);
    if (!channelType) return null;

    return channelType.fields.map((field) => (
      <div key={field.name} className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        {field.type === 'select' ? (
          <select
            value={channel.config[field.name] || field.default || ''}
            onChange={(e) => updateChannelConfig(index, field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            value={channel.config[field.name] || ''}
            onChange={(e) => updateChannelConfig(index, field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Notification Channels</h3>
        <p className="text-sm text-gray-600 mb-4">
          Configure how you want to receive alerts for this rule
        </p>
      </div>

      {/* Add Channel Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {channelTypes.map((channelType) => {
          const Icon = channelType.icon;
          return (
            <button
              key={channelType.type}
              onClick={() => addChannel(channelType.type)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              <Icon className="h-4 w-4 mr-2" />
              Add {channelType.label}
            </button>
          );
        })}
      </div>

      {/* Active Channels */}
      {activeChannels.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No notification channels configured</p>
          <p className="text-xs text-gray-500 mt-1">Add a channel above to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeChannels.map((channel, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getChannelIcon(channel.type)}
                  <span className="font-medium text-gray-900 capitalize">
                    {channel.type}
                  </span>
                  <label className="flex items-center ml-4">
                    <input
                      type="checkbox"
                      checked={channel.enabled}
                      onChange={() => toggleChannel(index)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-600">Enabled</span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => testChannel(index)}
                    disabled={testingChannel === index}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {testingChannel === index ? (
                      <>
                        <Loader className="h-3 w-3 mr-1 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Send className="h-3 w-3 mr-1" />
                        Test
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => removeChannel(index)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {renderChannelFields(channel, index)}

              {/* Test Result */}
              {testResults[index] && (
                <div className={`mt-3 p-3 rounded-md flex items-start ${
                  testResults[index].success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {testResults[index].success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${
                      testResults[index].success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testResults[index].success ? 'Success' : 'Failed'}
                    </p>
                    <p className={`text-sm ${
                      testResults[index].success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {testResults[index].message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Configuration Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Test each channel after configuration to ensure it works correctly</li>
          <li>You can add multiple channels of the same type with different recipients</li>
          <li>Disabled channels will not receive notifications but configuration is preserved</li>
          <li>Failed notifications will be automatically retried up to 3 times</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationSettings;