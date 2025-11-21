const API_BASE_URL = 'http://127.0.0.1:8000/api';
const USE_MOCK_DATA = true; // Set to false when backend is available

class ApiService {
  async makeRequest(endpoint, options = {}) {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for: ${endpoint}`);
      return this.getMockData(endpoint);
    }

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

  getMockData(endpoint) {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.includes('/overview/stats')) {
          resolve({
            total_records: 1000,
            fraud_cases: 45,
            non_fraud_cases: 955,
            fraud_percentage: 4.5,
            non_fraud_percentage: 95.5
          });
        } else if (endpoint.includes('/insights/transaction_amounts')) {
          resolve({
            avg_amount: 1250.50,
            max_amount: 9999.99,
            min_amount: 10.00
          });
        } else if (endpoint.includes('/analytics/fraud_trend')) {
          resolve([
            { date: '2024-01-01', fraud_count: 5, total_count: 100 },
            { date: '2024-01-02', fraud_count: 8, total_count: 120 },
            { date: '2024-01-03', fraud_count: 3, total_count: 95 }
          ]);
        } else if (endpoint.includes('/analytics/fraud_by_channel')) {
          resolve([
            { channel: 'Mobile', fraud_count: 20, total_count: 500 },
            { channel: 'Web', fraud_count: 25, total_count: 500 }
          ]);
        } else if (endpoint.includes('/alerts/suspicious')) {
          resolve([
            {
              _id: 'sus1',
              customer_id: 'CUST001',
              timestamp: new Date().toISOString(),
              transaction_amount: 5000,
              channel_mobile: true,
              kyc_status: false,
              is_fraud: true
            }
          ]);
        } else if (endpoint.includes('/filter/transactions')) {
          const mockTransactions = Array.from({ length: 50 }, (_, i) => ({
            _id: `tx${i + 1}`,
            customer_id: `CUST${Math.floor(Math.random() * 100) + 1}`,
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            transaction_amount: Math.random() * 5000,
            channel_mobile: Math.random() > 0.5,
            kyc_status: Math.random() > 0.3,
            is_fraud: Math.random() > 0.9
          }));
          resolve(mockTransactions);
        } else {
          resolve({});
        }
      }, 300);
    });
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
}

export const apiService = new ApiService();