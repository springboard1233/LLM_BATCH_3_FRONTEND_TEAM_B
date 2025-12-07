import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { TrendingUp, AlertTriangle, Shield, Eye } from 'lucide-react';
import useResponsive from './src/hooks/useResponsive';

const RiskAnalysis = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const { isMobile, isTablet } = useResponsive();

  // Mock data for risk distribution
  const riskDistribution = [
    { range: '0-20%', count: 450, fill: '#10B981' },
    { range: '20-40%', count: 320, fill: '#84CC16' },
    { range: '40-60%', count: 180, fill: '#F59E0B' },
    { range: '60-80%', count: 95, fill: '#EF5350' },
    { range: '80-100%', count: 25, fill: '#C62828' },
  ];

  // Mock data for risk trend over time
  const riskTrend = [
    { date: '2025-11-15', avgRisk: 0.22, highRiskCount: 12 },
    { date: '2025-11-16', avgRisk: 0.25, highRiskCount: 18 },
    { date: '2025-11-17', avgRisk: 0.28, highRiskCount: 25 },
    { date: '2025-11-18', avgRisk: 0.26, highRiskCount: 22 },
    { date: '2025-11-19', avgRisk: 0.32, highRiskCount: 35 },
    { date: '2025-11-20', avgRisk: 0.35, highRiskCount: 42 },
    { date: '2025-11-21', avgRisk: 0.33, highRiskCount: 38 },
  ];

  // Mock data for risk by channel
  const riskByChannel = [
    { channel: 'Mobile', avgRisk: 0.18, transactions: 450 },
    { channel: 'Web', avgRisk: 0.35, transactions: 320 },
    { channel: 'ATM', avgRisk: 0.12, transactions: 280 },
    { channel: 'POS', avgRisk: 0.28, transactions: 220 },
  ];

  // Mock data for risk by customer segment
  const riskMetrics = [
    {
      segment: 'New Customers',
      avgRisk: 0.42,
      fraudRate: 0.08,
      alertCount: 45,
    },
    {
      segment: 'Regular Customers',
      avgRisk: 0.18,
      fraudRate: 0.02,
      alertCount: 12,
    },
    {
      segment: 'VIP Customers',
      avgRisk: 0.08,
      fraudRate: 0.005,
      alertCount: 2,
    },
    {
      segment: 'Dormant Customers',
      avgRisk: 0.55,
      fraudRate: 0.12,
      alertCount: 28,
    },
  ];

  const [selectedMetric, setSelectedMetric] = useState('avgRisk');

  // Responsive chart configurations
  const chartConfig = useMemo(() => ({
    fontSize: isMobile ? 10 : 12,
    chartHeight: isMobile ? 250 : 300,
    pieOuterRadius: isMobile ? 60 : 80,
  }), [isMobile]);

  const getMetricColor = (value) => {
    if (value < 0.2) return 'text-green-500';
    if (value < 0.4) return 'text-yellow-500';
    if (value < 0.6) return 'text-orange-500';
    return 'text-red-500';
  };

  const getMetricBgColor = (value) => {
    if (value < 0.2) return 'bg-green-100 dark:bg-green-900';
    if (value < 0.4) return 'bg-yellow-100 dark:bg-yellow-900';
    if (value < 0.6) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div
        className={`rounded-xl p-4 md:p-6 shadow-lg border ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Risk Analysis Dashboard</h2>

        {/* Key Risk Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400 mb-1">Avg Risk Score</p>
                <p className="text-2xl md:text-3xl font-bold">0.28</p>
              </div>
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400 mb-1">High Risk Txns</p>
                <p className="text-2xl md:text-3xl font-bold text-red-500">38</p>
              </div>
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400 mb-1">Fraud Rate</p>
                <p className="text-2xl md:text-3xl font-bold">2.1%</p>
              </div>
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400 mb-1">Active Alerts</p>
                <p className="text-2xl md:text-3xl font-bold">87</p>
              </div>
              <Eye className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Risk Distribution */}
        <div
          className={`rounded-xl p-4 md:p-6 shadow-lg border ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={chartConfig.chartHeight}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={isMobile ? false : ({ range, count }) => `${range}: ${count}`}
                outerRadius={chartConfig.pieOuterRadius}
                fill="#8884d8"
                dataKey="count"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: chartConfig.fontSize }} />
              <Legend wrapperStyle={{ fontSize: chartConfig.fontSize }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk by Channel */}
        <div
          className={`rounded-xl p-4 md:p-6 shadow-lg border ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Average Risk by Channel</h3>
          <ResponsiveContainer width="100%" height={chartConfig.chartHeight}>
            <BarChart 
              data={riskByChannel}
              margin={isMobile 
                ? { top: 5, right: 5, left: -10, bottom: 5 }
                : { top: 5, right: 20, left: 0, bottom: 5 }
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#4b5563' : '#e0e0e0'}
              />
              <XAxis 
                dataKey="channel" 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={chartConfig.fontSize}
              />
              <YAxis 
                stroke={isDark ? '#9ca3af' : '#6b7280'}
                fontSize={chartConfig.fontSize}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  fontSize: chartConfig.fontSize,
                }}
              />
              <Bar dataKey="avgRisk" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Trend */}
      <div
        className={`rounded-xl p-4 md:p-6 shadow-lg border ${
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Risk Trend Over Time</h3>
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 350}>
          <LineChart 
            data={riskTrend}
            margin={isMobile 
              ? { top: 5, right: 5, left: -10, bottom: 5 }
              : { top: 5, right: 20, left: 0, bottom: 5 }
            }
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#4b5563' : '#e0e0e0'}
            />
            <XAxis 
              dataKey="date" 
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              fontSize={chartConfig.fontSize}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 60 : 30}
            />
            <YAxis 
              stroke={isDark ? '#9ca3af' : '#6b7280'} 
              yAxisId="left"
              fontSize={chartConfig.fontSize}
            />
            <YAxis
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              yAxisId="right"
              orientation="right"
              fontSize={chartConfig.fontSize}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                fontSize: chartConfig.fontSize,
              }}
            />
            <Legend wrapperStyle={{ fontSize: chartConfig.fontSize }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avgRisk"
              stroke="#3B82F6"
              name="Avg Risk Score"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="highRiskCount"
              stroke="#EF4444"
              name="High Risk Count"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk by Customer Segment */}
      <div
        className={`rounded-xl p-4 md:p-6 shadow-lg border ${
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Risk Analysis by Customer Segment</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {riskMetrics.map((metric) => (
            <div
              key={metric.segment}
              className={`p-4 rounded-lg border ${
                isDark
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <h4 className="font-semibold mb-4">{metric.segment}</h4>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Avg Risk Score</span>
                    <span
                      className={`font-bold ${getMetricColor(metric.avgRisk)}`}
                    >
                      {(metric.avgRisk * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full ${getMetricBgColor(
                      metric.avgRisk
                    )}`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      style={{ width: `${metric.avgRisk * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fraud Rate</span>
                  <span className="font-semibold text-red-500">
                    {(metric.fraudRate * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Active Alerts</span>
                  <span className="font-semibold text-orange-500">
                    {metric.alertCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;