const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
  async makeRequest(endpoint, options = {}) {
    try {
      console.log(`Making request to: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        if (response.status === 0) {
          throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Response from ${endpoint}:`, {
        status: response.status,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Overview statistics
  async getOverviewStats() {
    try {
      console.log('Fetching overview stats...');
      const data = await this.makeRequest('/overview/stats');
      
      // Data validation and transformation
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid overview stats data format');
      }
      
      const stats = {
        total_records: parseInt(data.total_records) || 0,
        fraud_cases: parseInt(data.fraud_cases) || 0,
        non_fraud_cases: parseInt(data.non_fraud_cases) || 0,
        fraud_percentage: parseFloat(data.fraud_percentage) || 0,
        non_fraud_percentage: parseFloat(data.non_fraud_percentage) || 0
      };
      
      console.log('Processed overview stats:', stats);
      return stats;
    } catch (error) {
      console.error('Failed to fetch overview stats:', error);
      throw error; // Let the component handle the error
    }
  }

  // Transaction insights
  async getTransactionInsights() {
    try {
      console.log('Fetching transaction insights...');
      const data = await this.makeRequest('/insights/transaction_amounts');
      
      // Transform the data to match frontend requirements
      return {
        averageAmount: parseFloat(data.avg_amount || 0).toFixed(2),
        maxAmount: parseFloat(data.max_amount || 0).toFixed(2),
        minAmount: parseFloat(data.min_amount || 0).toFixed(2)
      };
    } catch (error) {
      console.error('Failed to fetch transaction insights:', error);
      throw error;
    }
  }

  // Fraud trends
  async getFraudTrends() {
    try {
      // Changed from '/analytics/fraud-trend' to '/analytics/fraud_trend'
      const data = await this.makeRequest('/analytics/fraud_trend');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch fraud trends:', error);
      throw error;
    }
  }

  // Fraud by channel
  async getFraudByChannel() {
    try {
      // Changed from '/analytics/fraud-by-channel' to '/analytics/fraud_by_channel'
      const data = await this.makeRequest('/analytics/fraud_by_channel');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch fraud by channel:', error);
      return [];
    }
  }

  async getPredictionHistory(page = 1, limit = 15) {
    try {
      const params = new URLSearchParams({ page, limit }).toString();
      return await this.makeRequest(`/prediction/history?${params}`);
    } catch (error) {
      console.error('Failed to fetch prediction history:', error);
      throw error;
    }
  }

  // Filter transactions
  async filterTransactions(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/filter/transactions?${queryString}` : '/filter/transactions';
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Failed to filter transactions:', error);
      return { data: [], totalPages: 0, currentPage: 1 };
    }
  }

  // Get suspicious transactions
  async getSuspiciousTransactions() {
    try {
      const data = await this.makeRequest('/alerts/suspicious');
      // Ensure data is an array and transform if needed
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch suspicious transactions:', error);
      throw error;
    }
  }

  // Get all transactions with pagination
  async getTransactions(page = 1, limit = 10, filters = {}) {
    try {
      const params = {
        page,
        limit,
        ...filters
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await this.makeRequest(`/filter/transactions?${queryString}`);
      
      // Ensure consistent data structure
      const transformedData = Array.isArray(response) ? response : response.data || [];
      
      return {
        data: transformedData.map(t => ({
          id: t._id || t.id,
          customerId: t.customer_id,
          date: t.timestamp,
          channel: t.channel_mobile ? 'Mobile' : 'Web',
          amount: parseFloat(t.transaction_amount || 0),
          kycStatus: Boolean(t.kyc_status),
          status: t.is_fraud ? 'Fraud' : 'Legitimate'
        })),
        totalPages: Math.ceil(transformedData.length / limit),
        currentPage: page,
        total: transformedData.length
      };
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  }

  async predictFraud(payload) {
    try {
      if (!payload) {
        throw new Error('Missing transaction payload');
      }
      return await this.makeRequest('/prediction/predict', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Failed to run fraud prediction:', error);
      throw error;
    }
  }

  // Simple auth methods - no JWT, just store user in localStorage
  async loginRequest({ email, password }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Store user in localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signupRequest({ name, email, password }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          full_name: name,
          role: 'analyst' 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }

      const data = await response.json();
      
      // Store user in localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  logout() {
    // Clear user from localStorage
    localStorage.removeItem('user');
    return Promise.resolve({ message: 'Logged out' });
  }

  getCurrentUser() {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}

export const apiService = new ApiService();