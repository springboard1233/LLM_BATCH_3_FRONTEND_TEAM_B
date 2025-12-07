/**
 * Real-time connection status indicator component
 */
import React from 'react';
import { Wifi, WifiOff, AlertCircle, Loader } from 'lucide-react';
import { useConnectionStatus } from '../hooks/useWebSocket';

const RealtimeIndicator = ({ className = '', showText = true }) => {
  const { isConnected, isConnecting, error } = useConnectionStatus();

  const getStatusConfig = () => {
    if (isConnecting) {
      return {
        icon: Loader,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        text: 'Connecting...',
        animate: 'animate-spin',
      };
    }

    if (error) {
      return {
        icon: AlertCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        text: 'Connection Error',
        animate: '',
      };
    }

    if (isConnected) {
      return {
        icon: Wifi,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        text: 'Real-time Connected',
        animate: '',
      };
    }

    return {
      icon: WifiOff,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      text: 'Disconnected',
      animate: '',
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-full border
        ${config.bgColor} ${config.borderColor}
      `}>
        <Icon 
          className={`w-4 h-4 ${config.color} ${config.animate}`}
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </span>
          {error && (
            <span className="text-xs text-gray-500 truncate max-w-32">
              {error}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default RealtimeIndicator;