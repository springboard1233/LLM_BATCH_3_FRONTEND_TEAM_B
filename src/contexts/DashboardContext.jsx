import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const DashboardContext = createContext();

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_OVERVIEW_STATS: 'SET_OVERVIEW_STATS',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_TOTAL_TRANSACTIONS: 'SET_TOTAL_TRANSACTIONS',
  SET_SUSPICIOUS_TRANSACTIONS: 'SET_SUSPICIOUS_TRANSACTIONS',
  SET_FRAUD_TRENDS: 'SET_FRAUD_TRENDS',
  SET_TRANSACTION_INSIGHTS: 'SET_TRANSACTION_INSIGHTS',
  SET_FILTERS: 'SET_FILTERS',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_TOTAL_PAGES: 'SET_TOTAL_PAGES',
};

// Initial state
const initialState = {
  overviewStats: null,
  transactions: [],
  totalTransactions: 0,
  avgTransactionAmount: 0,
  totalAmount: 0,
  suspiciousTransactions: [],
  fraudTrends: [],
  transactionInsights: null,
  loading: false,
  error: null,
  filters: {},
  currentPage: 1,
  totalPages: 1,
};

// Reducer
function dashboardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_OVERVIEW_STATS:
      return { ...state, overviewStats: action.payload };
    case ACTIONS.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    case ACTIONS.SET_TOTAL_TRANSACTIONS:
      return { ...state, totalTransactions: action.payload };
    case ACTIONS.SET_SUSPICIOUS_TRANSACTIONS:
      return { ...state, suspiciousTransactions: action.payload };
    case ACTIONS.SET_FRAUD_TRENDS:
      return { ...state, fraudTrends: action.payload };
    case ACTIONS.SET_TRANSACTION_INSIGHTS:
      return { ...state, transactionInsights: action.payload };
    case ACTIONS.SET_FILTERS:
      return { ...state, filters: action.payload };
    case ACTIONS.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    case ACTIONS.SET_TOTAL_PAGES:
      return { ...state, totalPages: action.payload };
    default:
      return state;
  }
}

// Provider component
export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Set loading state
  const setLoading = useCallback((loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  }, []);

  // Set error state
  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  // Load overview statistics
  const loadOverviewStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getOverviewStats();
      dispatch({ type: ACTIONS.SET_OVERVIEW_STATS, payload: data });
      
      // Also store avg amount and total amount in state
      if (data.avg_transaction_amount !== undefined) {
        dispatch({ type: ACTIONS.SET_TOTAL_TRANSACTIONS, payload: data.total_records || 0 });
        // Store additional metrics in overviewStats for now
      }
      
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Load transactions with filters and pagination
  const loadTransactions = useCallback(async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      // Fetch 100 transactions per page for better user experience
      const response = await apiService.getTransactions(page, 100, filters);
      console.log('✅ DashboardContext - API Response:', {
        total: response.total,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        dataLength: response.data?.length
      });
      
      // Make sure we're dispatching the correct data structure
      dispatch({ 
        type: ACTIONS.SET_TRANSACTIONS, 
        payload: Array.isArray(response) ? response : response.data || [] 
      });
      
      // Store total transaction count from backend
      const totalCount = response.total || response.data?.length || 0;
      console.log('✅ DashboardContext - Setting totalTransactions to:', totalCount);
      dispatch({ type: ACTIONS.SET_TOTAL_TRANSACTIONS, payload: totalCount });
      
      // Update pagination if available
      if (response.totalPages) {
        dispatch({ type: ACTIONS.SET_TOTAL_PAGES, payload: response.totalPages });
      }
      setError(null);
    } catch (error) {
      console.error('❌ Error loading transactions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Load suspicious transactions
  const loadSuspiciousTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getSuspiciousTransactions();
      dispatch({ type: ACTIONS.SET_SUSPICIOUS_TRANSACTIONS, payload: data || [] });
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Load fraud trends
  const loadFraudTrends = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getFraudTrends();
      dispatch({ type: ACTIONS.SET_FRAUD_TRENDS, payload: data || [] });
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Load transaction insights
  const loadTransactionInsights = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getTransactionInsights();
      dispatch({ type: ACTIONS.SET_TRANSACTION_INSIGHTS, payload: data });
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Update filters
  const updateFilters = useCallback((filters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadOverviewStats(),
      loadTransactions(state.currentPage, state.filters),
      loadSuspiciousTransactions(),
      loadFraudTrends(),
      loadTransactionInsights(),
    ]);
  }, [loadOverviewStats, loadTransactions, loadSuspiciousTransactions, loadFraudTrends, loadTransactionInsights, state.currentPage, state.filters]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, []);

  const value = {
    // State
    ...state,
    
    // Actions
    loadOverviewStats,
    loadTransactions,
    loadSuspiciousTransactions,
    loadFraudTrends,
    loadTransactionInsights,
    updateFilters,
    refreshData,
    setLoading,
    setError,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// Custom hook to use dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

export default DashboardContext;