/**
 * WebSocket client service for real-time communication
 */
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.eventHandlers = new Map();
    this.subscriptions = new Set();
    this.connectionPromise = null;
  }

  /**
   * Connect to WebSocket server
   */
  async connect() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this._establishConnection();
    return this.connectionPromise;
  }

  async _establishConnection() {
    try {
      // Get authentication token
      const token = this._getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Create socket connection
      this.socket = io(this._getServerUrl(), {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: false, // We'll handle reconnection manually
      });

      // Set up event listeners
      this._setupEventListeners();

      // Wait for connection
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.socket.on('connect', () => {
          clearTimeout(timeout);
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      
      console.log('WebSocket connected successfully');
      this._notifyConnectionChange(true);

      return this.socket;

    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.connectionPromise = null;
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.connectionPromise = null;
    this._notifyConnectionChange(false);
  }

  /**
   * Subscribe to a real-time channel
   */
  async subscribe(channel) {
    if (!this.isConnected) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Subscription to ${channel} timed out`));
      }, 5000);

      // Listen for subscription confirmation
      const onSubscribed = (data) => {
        if (data.channel === channel) {
          clearTimeout(timeout);
          this.subscriptions.add(channel);
          this.socket.off('subscribed', onSubscribed);
          this.socket.off('error', onError);
          resolve(data);
        }
      };

      const onError = (error) => {
        clearTimeout(timeout);
        this.socket.off('subscribed', onSubscribed);
        this.socket.off('error', onError);
        reject(new Error(error.message || 'Subscription failed'));
      };

      this.socket.on('subscribed', onSubscribed);
      this.socket.on('error', onError);

      // Send subscription request
      this.socket.emit('subscribe', { channel });
    });
  }

  /**
   * Unsubscribe from a real-time channel
   */
  async unsubscribe(channel) {
    if (!this.isConnected || !this.subscriptions.has(channel)) {
      return;
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(); // Don't fail on timeout
      }, 5000);

      const onUnsubscribed = (data) => {
        if (data.channel === channel) {
          clearTimeout(timeout);
          this.subscriptions.delete(channel);
          this.socket.off('unsubscribed', onUnsubscribed);
          resolve(data);
        }
      };

      this.socket.on('unsubscribed', onUnsubscribed);
      this.socket.emit('unsubscribe', { channel });
    });
  }

  /**
   * Register event handler
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event).add(handler);

    // If socket is connected, register with socket
    if (this.socket) {
      this.socket.on(event, handler);
    }
  }

  /**
   * Unregister event handler
   */
  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).delete(handler);
    }

    if (this.socket) {
      this.socket.off(event, handler);
    }
  }

  /**
   * Send ping to keep connection alive
   */
  ping() {
    if (this.isConnected && this.socket) {
      this.socket.emit('ping', { timestamp: Date.now() });
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      subscriptions: Array.from(this.subscriptions),
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  /**
   * Setup socket event listeners
   */
  _setupEventListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this._notifyConnectionChange(true);
      this._resubscribeToChannels();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      this._notifyConnectionChange(false);
      
      // Attempt reconnection if not intentional
      if (reason !== 'io client disconnect') {
        this._attemptReconnection();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
      this._notifyConnectionChange(false);
      this._attemptReconnection();
    });

    // Server messages
    this.socket.on('connected', (data) => {
      console.log('WebSocket authentication successful:', data);
    });

    this.socket.on('disconnect_notice', (data) => {
      console.warn('Server disconnect notice:', data.reason);
    });

    this.socket.on('pong', (data) => {
      // Handle pong response for keepalive
      console.debug('Received pong:', data);
    });

    // Real-time events
    this.socket.on('realtime_event', (eventData) => {
      this._handleRealtimeEvent(eventData);
    });

    // Register custom event handlers
    this.eventHandlers.forEach((handlers, event) => {
      handlers.forEach(handler => {
        this.socket.on(event, handler);
      });
    });
  }

  /**
   * Handle real-time events
   */
  _handleRealtimeEvent(eventData) {
    const { type, data, timestamp } = eventData;
    
    console.log(`Received real-time event: ${type}`, data);

    // Emit to specific event handlers
    if (this.eventHandlers.has(type)) {
      this.eventHandlers.get(type).forEach(handler => {
        try {
          handler(data, timestamp);
        } catch (error) {
          console.error(`Error in event handler for ${type}:`, error);
        }
      });
    }

    // Emit to generic real-time event handlers
    if (this.eventHandlers.has('realtime_event')) {
      this.eventHandlers.get('realtime_event').forEach(handler => {
        try {
          handler(eventData);
        } catch (error) {
          console.error('Error in realtime_event handler:', error);
        }
      });
    }
  }

  /**
   * Attempt reconnection with exponential backoff
   */
  async _attemptReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

    setTimeout(async () => {
      try {
        this.connectionPromise = null;
        await this.connect();
      } catch (error) {
        console.error('Reconnection failed:', error);
        this._attemptReconnection();
      }
    }, delay);
  }

  /**
   * Resubscribe to channels after reconnection
   */
  async _resubscribeToChannels() {
    const channels = Array.from(this.subscriptions);
    this.subscriptions.clear();

    for (const channel of channels) {
      try {
        await this.subscribe(channel);
        console.log(`Resubscribed to channel: ${channel}`);
      } catch (error) {
        console.error(`Failed to resubscribe to ${channel}:`, error);
      }
    }
  }

  /**
   * Notify connection status change
   */
  _notifyConnectionChange(isConnected) {
    if (this.eventHandlers.has('connection_change')) {
      this.eventHandlers.get('connection_change').forEach(handler => {
        try {
          handler(isConnected);
        } catch (error) {
          console.error('Error in connection_change handler:', error);
        }
      });
    }
  }

  /**
   * Get authentication token
   */
  _getAuthToken() {
    // Try to get token from various sources
    return (
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token') ||
      Cookies.get('access_token')
    );
  }

  /**
   * Get server URL
   */
  _getServerUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NODE_ENV === 'production' 
      ? window.location.host 
      : 'localhost:8000';
    
    return `${protocol}//${host}`;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

// Auto-connect on page load if token is available
if (typeof window !== 'undefined') {
  // Start keepalive ping every 30 seconds
  setInterval(() => {
    websocketService.ping();
  }, 30000);

  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !websocketService.isConnected) {
      websocketService.connect().catch(console.error);
    }
  });

  // Handle online/offline events
  window.addEventListener('online', () => {
    if (!websocketService.isConnected) {
      websocketService.connect().catch(console.error);
    }
  });

  window.addEventListener('offline', () => {
    websocketService.disconnect();
  });
}

export default websocketService;