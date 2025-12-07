//Make sure to run "npm install recharts"

import React, { useEffect, useMemo, useState } from 'react';
import { Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import useResponsive from './src/hooks/useResponsive';

// color codes
const COLORS = {
  primary: '#3B82F6', //Blue
  success: '#10B981', //Green
  warning: '#F59E0B', //Yellow
  danger: '#EF4444', //Red

  // gray color codes
  grayBg: '#F3F4F6',
  grayBorder: '#E5E7EB',
  grayText: '#6B7280',
  grayTitle: '#1F2937',
  white: '#FFFFFF',

  // Pie color codes
  pie: {
    mobile: '#3B82F6', //Blue
    atm: '#10B981', //Green
    pos: '#F59E0B', //Yellow
    web: '#EF4444', //Red
  },
};

//Main part in Analytics

const AnalyticsView = ({ data }) => {
  // Responsive hook
  const { isMobile, isTablet } = useResponsive();
  
  // Backend data state
  const [backendData, setBackendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:8000/api/analytics/dashboard');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const analyticsData = await response.json();
        setBackendData(analyticsData);
      } catch (err) {
        console.warn(
          'Failed to fetch analytics from backend:',
          err && err.message ? err.message : err
        );
        setError(err && err.message ? err.message : String(err));
        setBackendData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Use backend data if available, otherwise fallback to local calculations
  const analyticsMetrics = useMemo(() => {
    // Try to use backend data first
    if (backendData && backendData.analytics_metrics) {
      return backendData.analytics_metrics;
    }

    // Fallback to local calculations if no backend data
    if (!data || data.length === 0) {
      return {
        totalTransactions: 0,
        fraudRate: '0.00',
        fraudLoss: 0,
        legitimateVolume: 0,
      };
    }
    let fraudLoss = 0;
    let legitimateVolume = 0;
    let fraudTransactionsCount = 0;
    const totalTransactions = data.length;

    data.forEach((t) => {
      const amount = parseFloat(t.transaction_amount) || 0;

      // is_fraud is a number (0 or 1)
      if (t.is_fraud === 1) {
        fraudTransactionsCount++;
        fraudLoss += amount;
      } else {
        legitimateVolume += amount;
      }
    });

    const fraudRate =
      totalTransactions > 0
        ? ((fraudTransactionsCount / totalTransactions) * 100).toFixed(2)
        : '0.00';

    return { totalTransactions, fraudRate, fraudLoss, legitimateVolume };
  }, [backendData, data]);

  //Transaction Volume Chart - Backend data or local calculation
  const volumeByDayData = useMemo(() => {
    // Try to use backend data first
    if (backendData && backendData.volume_by_day_data) {
      return backendData.volume_by_day_data;
    }

    // Fallback to local calculations
    if (!data) return [];
    const dailyVolumes = new Map();

    data.forEach((t) => {
      const day = t.day;
      const amount = parseFloat(t.transaction_amount) || 0;
      dailyVolumes.set(day, (dailyVolumes.get(day) || 0) + amount);
    });

    return Array.from(dailyVolumes.entries())
      .map(([day, volume]) => ({ name: `Day ${day}`, volume }))
      .sort(
        (a, b) =>
          parseInt(a.name.split(' ')[1], 10) - parseInt(b.name.split(' ')[1], 10)
      ); // Sort by day
  }, [backendData, data]);

  //Channel Distribution - Backend data or local calculation
  const channelData = useMemo(() => {
    // Try to use backend data first
    if (backendData && backendData.channel_data) {
      return backendData.channel_data;
    }

    // Fallback to local calculations
    if (!data) return [];
    const counts = { mobile: 0, atm: 0, pos: 0, web: 0 };

    data.forEach((t) => {
      if (t.channel_mobile === 1) counts.mobile++;
      else if (t.channel_atm === 1) counts.atm++;
      else if (t.channel_pos === 1) counts.pos++;
      else if (t.channel_web === 1) counts.web++;
    });

    return [
      { name: 'Mobile', value: counts.mobile, color: COLORS.pie.mobile },
      { name: 'ATM', value: counts.atm, color: COLORS.pie.atm },
      { name: 'POS', value: counts.pos, color: COLORS.pie.pos },
      { name: 'Web', value: counts.web, color: COLORS.pie.web },
    ];
  }, [backendData, data]);

  //Activity Heatmaps - Backend data or local calculation
  const activityData = useMemo(() => {
    // Try to use backend data first
    if (backendData && backendData.activity_data) {
      return backendData.activity_data;
    }

    // Fallback to local calculations
    if (!data) return { hourly: [], daily: [] };

    const hourlyCounts = new Array(24).fill(0);
    const dailyCounts = new Array(7).fill(0);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    data.forEach((t) => {
      const hour = t.hour; // Assuming 'hour' column 0-23
      const weekday = t.weekday; // Assuming 'weekday' column 0-6
      if (typeof hour === 'number' && hour >= 0 && hour <= 23) hourlyCounts[hour]++;
      if (typeof weekday === 'number' && weekday >= 0 && weekday <= 6) dailyCounts[weekday]++;
    });

    const hourly = hourlyCounts.map((count, i) => ({
      name: `${i}:00`,
      transactions: count,
    }));
    const daily = dailyCounts.map((count, i) => ({
      name: dayNames[i],
      transactions: count,
    }));

    return { hourly, daily };
  }, [backendData, data]);

  // 🔹 Feature Importance – expects backendData.feature_importance
  const featureImportanceData = useMemo(() => {
    if (backendData && backendData.feature_importance) {
      const raw = backendData.feature_importance;

      // Accept both array of objects or dict {feature: importance}
      const arr = Array.isArray(raw)
        ? raw
        : Object.entries(raw).map(([feature, importance]) => ({
            feature,
            importance,
          }));

      return arr
        .map((item) => ({
          feature: item.feature || item.name || String(item[0]),
          importance:
            typeof item.importance === 'number'
              ? item.importance
              : typeof item.value === 'number'
              ? item.value
              : Number(item[1]) || 0,
        }))
        .filter((d) => !Number.isNaN(d.importance))
        .sort((a, b) => b.importance - a.importance) // highest first
        .slice(0, 10); // top 10 features
    }

    // no backend feature importance -> empty
    return [];
  }, [backendData]);

  // Responsive chart configurations
  const chartConfig = useMemo(() => ({
    margin: isMobile 
      ? { top: 5, right: 5, left: -20, bottom: 5 }
      : { top: 5, right: 20, left: -20, bottom: 5 },
    fontSize: isMobile ? 10 : 12,
    legendLayout: isMobile ? 'horizontal' : 'vertical',
    pieOuterRadius: isMobile ? 70 : 100,
    chartHeight: isMobile ? 250 : 300,
  }), [isMobile]);

  // For formatting currency on chart hover
  const formatCurrencyTooltip = (value) => {
    if (value == null) return value;
    return `₹${Number(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // For formatting simple counts on chart hover
  const formatCountTooltip = (value) => {
    if (value == null) return value;
    return `${Number(value).toLocaleString()} transactions`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="animate-pulse">
          <div className="h-6 md:h-8 bg-gray-200 rounded w-1/3 mb-4 md:mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="lg:col-span-2 h-64 md:h-80 bg-gray-200 rounded"></div>
            <div className="h-64 md:h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with fallback notice
  if (error && !backendData) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
          <p className="text-amber-800 text-xs md:text-sm">
            <strong>Backend unavailable:</strong> Showing fallback data. {error}
          </p>
        </div>
        {/* Continue with render even on error - fallback to local data */}
      </div>
    );
  }

  // Show success notification if using backend data
  if (backendData && !loading) {
    // eslint-disable-next-line no-console
    console.log('✅ Analytics loaded from backend API');
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <h2
        className="text-xl md:text-2xl font-semibold mb-3 md:mb-4"
        style={{ color: COLORS.grayTitle }}
      >
        Analytics & Insights
        {backendData && !loading && (
          <span className="text-xs md:text-sm ml-2 text-green-600 font-normal">
            (Backend data)
          </span>
        )}
      </h2>

      {/* Fraud Loss & Legitimate Volume Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            title: 'Fraud Loss',
            value: `₹${Number(analyticsMetrics.fraudLoss || 0).toLocaleString(
              'en-IN',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`,
            icon: AlertTriangle,
            color: COLORS.danger,
            iconColor: COLORS.danger,
          },
          {
            title: 'Legitimate Volume',
            value: `₹${Number(analyticsMetrics.legitimateVolume || 0).toLocaleString(
              'en-IN',
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )}`,
            icon: CheckCircle,
            color: COLORS.success,
            iconColor: COLORS.success,
          },
          {
            title: 'Total Transactions',
            value: (analyticsMetrics.totalTransactions || 0).toLocaleString(),
            icon: Activity,
            color: COLORS.primary,
            iconColor: COLORS.primary,
          },
          {
            title: 'Fraud Rate',
            value: `${analyticsMetrics.fraudRate}%`,
            icon: Shield,
            color: COLORS.warning,
            iconColor: COLORS.warning,
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.grayBorder,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: COLORS.grayText }}
                >
                  {stat.title}
                </p>
                <p
                  className="text-xl font-bold mt-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </div>
              <div
                style={{ backgroundColor: stat.iconColor }}
                className="rounded-lg p-2.5"
              >
                <stat.icon
                  className="h-5 w-5"
                  style={{ color: COLORS.white }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Transaction Volume Chart section */}
        <div
          className="lg:col-span-2 rounded-xl shadow-sm border p-4 md:p-6 min-h-[300px] md:min-h-[350px]"
          style={{
            backgroundColor: COLORS.white,
            borderColor: COLORS.grayBorder,
          }}
        >
          <h3
            className="text-base md:text-lg font-semibold mb-3 md:mb-4"
            style={{ color: COLORS.grayTitle }}
          >
            Transaction Volume Over Time
          </h3>
          <ResponsiveContainer width="100%" height={chartConfig.chartHeight}>
            <BarChart
              data={volumeByDayData}
              margin={chartConfig.margin}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={COLORS.grayBorder}
              />
              <XAxis
                dataKey="name"
                fontSize={chartConfig.fontSize}
                stroke={COLORS.grayText}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 30}
              />
              <YAxis
                fontSize={chartConfig.fontSize}
                stroke={COLORS.grayText}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip 
                formatter={(value) => formatCurrencyTooltip(value)}
                contentStyle={{ fontSize: chartConfig.fontSize }}
              />
              <Bar
                dataKey="volume"
                fill={COLORS.primary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Distribution section */}
        <div
          className="rounded-xl shadow-sm border p-4 md:p-6 min-h-[300px] md:min-h-[350px]"
          style={{
            backgroundColor: COLORS.white,
            borderColor: COLORS.grayBorder,
          }}
        >
          <h3
            className="text-base md:text-lg font-semibold mb-3 md:mb-4"
            style={{ color: COLORS.grayTitle }}
          >
            Channel Distribution
          </h3>
          <ResponsiveContainer width="100%" height={chartConfig.chartHeight}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                outerRadius={chartConfig.pieOuterRadius}
                fill="#8884d8"
                dataKey="value"
                label={isMobile ? false : ({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {channelData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value.toLocaleString()} txns`,
                  name,
                ]}
                contentStyle={{ fontSize: chartConfig.fontSize }}
              />
              <Legend 
                layout={chartConfig.legendLayout}
                verticalAlign={isMobile ? 'bottom' : 'middle'}
                align={isMobile ? 'center' : 'right'}
                wrapperStyle={{ fontSize: chartConfig.fontSize }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔹 Feature Importance section */}
      <div
        className="rounded-xl shadow-sm border p-4 md:p-6"
        style={{
          backgroundColor: COLORS.white,
          borderColor: COLORS.grayBorder,
        }}
      >
        <h3
          className="text-base md:text-lg font-semibold mb-3 md:mb-4"
          style={{ color: COLORS.grayTitle }}
        >
          Model Feature Importance
        </h3>

        {featureImportanceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={chartConfig.chartHeight}>
            <BarChart
              data={featureImportanceData}
              layout="vertical"
              margin={isMobile 
                ? { top: 5, right: 10, left: 10, bottom: 5 }
                : { top: 5, right: 20, left: 40, bottom: 5 }
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={COLORS.grayBorder}
              />
              <XAxis
                type="number"
                fontSize={chartConfig.fontSize}
                stroke={COLORS.grayText}
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
              />
              <YAxis
                type="category"
                dataKey="feature"
                fontSize={chartConfig.fontSize}
                stroke={COLORS.grayText}
                width={isMobile ? 80 : 120}
              />
              <Tooltip
                formatter={(value) => [
                  `${(value * 100).toFixed(2)}%`,
                  'Importance',
                ]}
                contentStyle={{ fontSize: chartConfig.fontSize }}
              />
              <Bar
                dataKey="importance"
                fill={COLORS.primary}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm" style={{ color: COLORS.grayText }}>
            Feature importance data is not available. Make sure your backend
            includes a <code>feature_importance</code> field in the response
            from <code>/api/analytics/dashboard</code> (for example, as an
            array of objects like
            {" [{ feature: 'transaction_amount', importance: 0.35 }, ... ] "}
            or a mapping of feature name to importance).
          </p>
        )}
      </div>

      {/* Transaction Activity Heatmap section*/}
      <div
        className="rounded-xl shadow-sm border p-4 md:p-6"
        style={{
          backgroundColor: COLORS.white,
          borderColor: COLORS.grayBorder,
        }}
      >
        <h3
          className="text-base md:text-lg font-semibold mb-3 md:mb-4"
          style={{ color: COLORS.grayTitle }}
        >
          Transaction Activity
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 min-h-[250px]">
          {/* Hourly Distribution */}
          <div>
            <h4
              className="text-xs md:text-sm font-medium text-center mb-2"
              style={{ color: COLORS.grayText }}
            >
              Hourly Distribution
            </h4>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
              <BarChart
                data={activityData.hourly}
                margin={isMobile 
                  ? { top: 5, right: 5, left: -10, bottom: 5 }
                  : { top: 5, right: 0, left: 0, bottom: 5 }
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={COLORS.grayBorder}
                />
                <XAxis
                  dataKey="name"
                  fontSize={chartConfig.fontSize}
                  stroke={COLORS.grayText}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 50 : 30}
                />
                <YAxis 
                  fontSize={chartConfig.fontSize} 
                  stroke={COLORS.grayText} 
                />
                <Tooltip 
                  formatter={(value) => formatCountTooltip(value)}
                  contentStyle={{ fontSize: chartConfig.fontSize }}
                />
                <Bar
                  dataKey="transactions"
                  fill={COLORS.warning}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Activity */}
          <div>
            <h4
              className="text-xs md:text-sm font-medium text-center mb-2"
              style={{ color: COLORS.grayText }}
            >
              Daily Activity
            </h4>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
              <BarChart
                data={activityData.daily}
                margin={isMobile 
                  ? { top: 5, right: 5, left: -10, bottom: 5 }
                  : { top: 5, right: 0, left: 0, bottom: 5 }
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={COLORS.grayBorder}
                />
                <XAxis
                  dataKey="name"
                  fontSize={chartConfig.fontSize}
                  stroke={COLORS.grayText}
                />
                <YAxis 
                  fontSize={chartConfig.fontSize} 
                  stroke={COLORS.grayText} 
                />
                <Tooltip 
                  formatter={(value) => formatCountTooltip(value)}
                  contentStyle={{ fontSize: chartConfig.fontSize }}
                />
                <Bar
                  dataKey="transactions"
                  fill={COLORS.success}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
