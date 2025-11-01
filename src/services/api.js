const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  async makeRequest(endpoint, options = {}) {
    try {
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
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Overview statistics
  async getOverviewStats() {
    try {
      return await this.makeRequest('/overview/stats');
    } catch (error) {
      console.error('Failed to fetch overview stats:', error);
      return {
        total_records: 0,
        fraud_cases: 0,
        non_fraud_cases: 0,
        fraud_percentage: 0
      };
    }
  }

  // Transaction insights
  async getTransactionInsights() {
    try {
      return await this.makeRequest('/insights/transaction_amounts');
    } catch (error) {
      console.error('Failed to fetch transaction insights:', error);
      return { insights: [] };
    }
  }

  // Fraud trends
  async getFraudTrends() {
    try {
      return await this.makeRequest('/analytics/fraud_trend');
    } catch (error) {
      console.error('Failed to fetch fraud trends:', error);
      return [];
    }
  }

  // Fraud by channel
  async getFraudByChannel() {
    try {
      return await this.makeRequest('/analytics/fraud_by_channel');
    } catch (error) {
      console.error('Failed to fetch fraud by channel:', error);
      return [];
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
      return await this.makeRequest('/alerts/suspicious');
    } catch (error) {
      console.error('Failed to fetch suspicious transactions:', error);
      return [];
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
      return await this.makeRequest(`/filter/transactions?${queryString}`);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      return { data: [], totalPages: 0, currentPage: 1, total: 0 };
    }
  }
}

export const apiService = new ApiService();