import { useDashboard } from '../contexts/DashboardContext';

function DashboardLayout() {
  const { 
    transactions,
    loading,
    error,
    currentPage,
    totalPages,
    loadTransactions 
  } = useDashboard();

  // Add debugging
  console.log('DashboardLayout received:', {
    transactions,
    loading,
    error,
    currentPage,
    totalPages
  });

  return (
    <div>
      {/* Other dashboard components */}
      <TransactionTable 
        transactions={Array.isArray(transactions) ? transactions : []}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}