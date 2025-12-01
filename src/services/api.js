// Prefer env base URL if available, fallback to localhost
const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  'http://127.0.0.1:8000/api';

// ---- Auth storage helpers ----
const AUTH_STORAGE_KEY = 'secureguard_auth';

function saveAuthSession(payload) {
  try {
    if (typeof window === 'undefined') return;

    // Expecting backend login response shape:
    // { access_token, token_type, user: { ... } }
    const session = {
      token: payload?.access_token || null,
      tokenType: payload?.token_type || 'bearer',
      user: payload?.user || null
    };

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save auth session:', err);
  }
}

function getAuthSession() {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read auth session:', err);
    return null;
  }
}

function getAuthToken() {
  const session = getAuthSession();
  return session?.token || null;
}

function getCurrentUser() {
  const session = getAuthSession();
  return session?.user || null;
}

function clearAuthSession() {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear auth session:', err);
  }
}

class ApiService {
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const token = getAuthToken();

      console.log(`Making request to: ${url}`);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          // Attach Authorization header if we have a token
          ...(token
            ? {
                Authorization: `Bearer ${token}`
              }
            : {}),
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        if (response.status === 0) {
          throw new Error(
            'Network error: Unable to connect to server. Please check if the backend is running.'
          );
        }

        // Try to surface backend error message if present
        let errMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody?.detail) {
            errMsg = Array.isArray(errorBody.detail)
              ? errorBody.detail.map((d) => d.msg || d).join(', ')
              : errorBody.detail;
          }
        } catch {
          // ignore JSON parse errors
        }

        throw new Error(errMsg);
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

  // ---------------------------
  // AUTH ENDPOINTS
  // ---------------------------

  /**
   * Signup user with backend
   * POST /api/auth/signup
   * payload: { email, password, name? }
   */
  async signupRequest(payload) {
    try {
      if (!payload?.email || !payload?.password) {
        throw new Error('Email and password are required');
      }

      const res = await this.makeRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Backend returns:
      // { status: "ok", user_id, email, name }
      return res;
    } catch (error) {
      console.error('Signup request failed:', error);
      throw error;
    }
  }

  /**
   * Login user with backend
   * POST /api/auth/login
   * payload: { email, password }
   * If autoStore=true (default), saves token+user in localStorage.
   */
  async loginRequest(payload, { autoStore = true } = {}) {
    try {
      if (!payload?.email || !payload?.password) {
        throw new Error('Email and password are required');
      }

      const res = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // res: { access_token, token_type, user: { ... } }
      if (autoStore) {
        saveAuthSession(res);
      }

      return res;
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  }

  /**
   * Clear auth session (logout)
   */
  logout() {
    clearAuthSession();
  }

  /**
   * Get current authenticated user (from localStorage)
   */
  getCurrentUser() {
    return getCurrentUser();
  }

  /**
   * Get raw auth token (from localStorage)
   */
  getAuthToken() {
    return getAuthToken();
  }

  // ---------------------------
  // EXISTING METHODS (unchanged)
  // ---------------------------

  // Overview statistics
  async getOverviewStats() {
    try {
      console.log('Fetching overview stats...');
      const data = await this.makeRequest('/overview/stats');

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
      throw error;
    }
  }

  // Transaction insights
  async getTransactionInsights() {
    try {
      console.log('Fetching transaction insights...');
      const data = await this.makeRequest('/insights/transaction_amounts');

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
      const endpoint = queryString
        ? `/filter/transactions?${queryString}`
        : '/filter/transactions';
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
      const response = await this.makeRequest(
        `/filter/transactions?${queryString}`
      );

      const transformedData = Array.isArray(response)
        ? response
        : response.data || [];

      return {
        data: transformedData.map((t) => ({
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
