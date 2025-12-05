/**
 * React hook for WebSocket functionality
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocket';

/**
 * Hook for managing WebSocket connection
 */
export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    // Handle connection status changes
    const handleConnectionChange = (connected) => {
      setIsConnected(connected);
      if (connected) {
        setConnectionError(null);
        setReconnectAttempts(0);
      }
    };

    // Handle connection errors
    const handleError = (error) => {
      setConnectionError(error.message || 'Connection error');
    };

    // Register event handlers
    websocketService.on('connection_change', handleConnectionChange);
    websocketService.on('connect_error', handleError);

    // Initial connection attempt
    websocketService.connect().catch((error) => {
      setConnectionError(error.message);
    });

    // Update status from service
    const status = websocketService.getConnectionStatus();
    setIsConnected(status.isConnected);
    setReconnectAttempts(status.reconnectAttempts);

    return () => {
      websocketService.off('connection_change', handleConnectionChange);
      websocketService.off('connect_error', handleError);
    };
  }, []);

  const connect = useCallback(async () => {
    try {
      setConnectionError(null);
      await websocketService.connect();
    } catch (error) {
      setConnectionError(error.message);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  return {
    isConnected,
    connectionError,
    reconnectAttempts,
    connect,
    disconnect,
  };
}

/**
 * Hook for subscribing to real-time channels
 */
export function useRealtimeSubscription(channel, options = {}) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);
  const { autoSubscribe = true, onEvent } = options;

  const subscribe = useCallback(async () => {
    try {
      setSubscriptionError(null);
      await websocketService.subscribe(channel);
      setIsSubscribed(true);
    } catch (error) {
      setSubscriptionError(error.message);
      throw error;
    }
  }, [channel]);

  const unsubscribe = useCallback(async () => {
    try {
      await websocketService.unsubscribe(channel);
      setIsSubscribed(false);
    } catch (error) {
      console.error('Unsubscribe error:', error);
    }
  }, [channel]);

  useEffect(() => {
    if (autoSubscribe) {
      subscribe().catch(console.error);
    }

    return () => {
      if (isSubscribed) {
        unsubscribe();
      }
    };
  }, [channel, autoSubscribe, subscribe, unsubscribe, isSubscribed]);

  useEffect(() => {
    const handleRealtimeEvent = (eventData) => {
      setLastEvent(eventData);
      if (onEvent) {
        onEvent(eventData);
      }
    };

    websocketService.on('realtime_event', handleRealtimeEvent);

    return () => {
      websocketService.off('realtime_event', handleRealtimeEvent);
    };
  }, [onEvent]);

  return {
    isSubscribed,
    subscriptionError,
    lastEvent,
    subscribe,
    unsubscribe,
  };
}

/**
 * Hook for handling specific event types
 */
export function useRealtimeEvent(eventType, handler, dependencies = []) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const eventHandler = (data, timestamp) => {
      if (handlerRef.current) {
        handlerRef.current(data, timestamp);
      }
    };

    websocketService.on(eventType, eventHandler);

    return () => {
      websocketService.off(eventType, eventHandler);
    };
  }, [eventType, ...dependencies]);
}

/**
 * Hook for real-time alerts
 */
export function useRealtimeAlerts(onAlert) {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useRealtimeEvent('alert_created', useCallback((alertData) => {
    const newAlert = {
      ...alertData,
      id: alertData.alert_id,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 99)]); // Keep last 100 alerts
    setUnreadCount(prev => prev + 1);

    if (onAlert) {
      onAlert(newAlert);
    }
  }, [onAlert]));

  const markAsRead = useCallback((alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  return {
    alerts,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAlerts,
  };
}

/**
 * Hook for real-time analytics updates
 */
export function useRealtimeAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);

  useRealtimeEvent('analytics_updated', useCallback((data) => {
    const { metric_type, metric_value, time_period, additional_data } = data;
    
    setAnalyticsData(prev => ({
      ...prev,
      [metric_type]: {
        value: metric_value,
        time_period,
        additional_data,
        timestamp: new Date().toISOString(),
      },
    }));

    setLastUpdate(new Date().toISOString());
  }, []));

  useRealtimeEvent('dashboard_refresh', useCallback((data) => {
    const { dashboard_type, updated_components } = data;
    
    // Trigger refresh for specific components
    setLastUpdate(new Date().toISOString());
  }, []));

  return {
    analyticsData,
    lastUpdate,
  };
}

/**
 * Hook for real-time transaction updates
 */
export function useRealtimeTransactions(onTransactionUpdate) {
  const [recentTransactions, setRecentTransactions] = useState([]);

  useRealtimeEvent('transaction_processed', useCallback((data) => {
    const transaction = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    setRecentTransactions(prev => [transaction, ...prev.slice(0, 49)]); // Keep last 50

    if (onTransactionUpdate) {
      onTransactionUpdate(transaction);
    }
  }, [onTransactionUpdate]));

  useRealtimeEvent('transaction_flagged', useCallback((data) => {
    const flaggedTransaction = {
      ...data,
      flagged: true,
      timestamp: new Date().toISOString(),
    };

    setRecentTransactions(prev => [flaggedTransaction, ...prev.slice(0, 49)]);

    if (onTransactionUpdate) {
      onTransactionUpdate(flaggedTransaction);
    }
  }, [onTransactionUpdate]));

  return {
    recentTransactions,
  };
}

/**
 * Hook for connection status indicator
 */
export function useConnectionStatus() {
  const [status, setStatus] = useState({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  useEffect(() => {
    const updateStatus = () => {
      const wsStatus = websocketService.getConnectionStatus();
      setStatus({
        isConnected: wsStatus.isConnected,
        isConnecting: websocketService.connectionPromise !== null,
        error: null,
      });
    };

    const handleConnectionChange = (isConnected) => {
      setStatus(prev => ({
        ...prev,
        isConnected,
        isConnecting: false,
        error: isConnected ? null : prev.error,
      }));
    };

    const handleError = (error) => {
      setStatus(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message,
      }));
    };

    websocketService.on('connection_change', handleConnectionChange);
    websocketService.on('connect_error', handleError);

    // Initial status
    updateStatus();

    return () => {
      websocketService.off('connection_change', handleConnectionChange);
      websocketService.off('connect_error', handleError);
    };
  }, []);

  return status;
}