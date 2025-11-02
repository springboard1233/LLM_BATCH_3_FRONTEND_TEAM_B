import { useDashboard } from '../contexts/DashboardContext';

export function DebugPanel() {
  const dashboardState = useDashboard();
  
  return process.env.NODE_ENV === 'development' ? (
    <div className="fixed bottom-0 right-0 bg-black/75 text-white p-4 m-4 rounded-lg max-w-lg max-h-96 overflow-auto">
      <pre>{JSON.stringify(dashboardState, null, 2)}</pre>
    </div>
  ) : null;
}