import { TrendingUp, AlertTriangle, DollarSign, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { transactionAPI } from '../lib/api';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const MetricCard = ({ title, value, icon, trend, color }: MetricCardProps) => (
  <div className={`bg-gradient-to-br ${color} rounded-lg p-4 border border-opacity-20`}>
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-lg bg-white bg-opacity-10`}>
        {icon}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs font-medium text-white bg-white bg-opacity-20 px-2 py-1 rounded">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-white text-opacity-80">{title}</div>
  </div>
);

export const RiskAnalysisCard = () => {
  const [metrics, setMetrics] = useState({
    overallRiskScore: 0,
    fraudRate: 0,
    fraudCases: 0,
    highValueFraud: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const { data: stats } = await transactionAPI.getStats();

      if (stats) {
        const fraudRate = stats.totalTransactions > 0 
          ? (stats.flagged / stats.totalTransactions) * 100 
          : 0;

        setMetrics({
          overallRiskScore: Math.round(stats.avgRisk),
          fraudRate: parseFloat(fraudRate.toFixed(1)),
          fraudCases: stats.flagged,
          highValueFraud: stats.highRisk,
        });
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Risk Analysis Overview</h2>
          <p className="text-slate-400 text-sm">Real-time transaction surveillance metrics</p>
        </div>
        <div className="text-xs text-slate-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Risk Score"
          value={metrics.overallRiskScore}
          icon={<Activity className="w-5 h-5 text-white" />}
          color="from-blue-600 to-blue-700"
        />

        <MetricCard
          title="Fraud Rate"
          value={`${metrics.fraudRate}%`}
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          trend="+0.3%"
          color="from-orange-600 to-orange-700"
        />

        <MetricCard
          title="Fraud Cases"
          value={metrics.fraudCases}
          icon={<AlertTriangle className="w-5 h-5 text-white" />}
          color="from-red-600 to-red-700"
        />

        <MetricCard
          title="High Value Fraud"
          value={metrics.highValueFraud}
          icon={<DollarSign className="w-5 h-5 text-white" />}
          color="from-purple-600 to-purple-700"
        />
      </div>

      <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Low Risk Profile Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-slate-500 mb-1">Avg Transaction Amount</div>
            <div className="text-white font-semibold">₹12,450</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Primary Channels</div>
            <div className="text-white font-semibold">Mobile (65%), Web (25%)</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Geographic Pattern</div>
            <div className="text-white font-semibold">Consistent locations</div>
          </div>
        </div>
      </div>
    </div>
  );
};
