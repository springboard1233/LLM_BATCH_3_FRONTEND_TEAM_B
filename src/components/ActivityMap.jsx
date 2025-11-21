import React, { useState, useEffect } from 'react';
import { MapPin, Activity, AlertTriangle, TrendingUp } from 'lucide-react';

const ActivityMap = ({ theme = 'dark' }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activityData, setActivityData] = useState([]);

  const isDark = theme === 'dark';

  // Mock geographical activity data
  useEffect(() => {
    const mockData = [
      { id: 1, city: 'Mumbai', lat: 19.0760, lng: 72.8777, transactions: 1250, fraudCount: 45, riskLevel: 'high' },
      { id: 2, city: 'Delhi', lat: 28.7041, lng: 77.1025, transactions: 980, fraudCount: 32, riskLevel: 'medium' },
      { id: 3, city: 'Bangalore', lat: 12.9716, lng: 77.5946, transactions: 1100, fraudCount: 28, riskLevel: 'medium' },
      { id: 4, city: 'Hyderabad', lat: 17.3850, lng: 78.4867, transactions: 750, fraudCount: 18, riskLevel: 'low' },
      { id: 5, city: 'Chennai', lat: 13.0827, lng: 80.2707, transactions: 890, fraudCount: 25, riskLevel: 'medium' },
      { id: 6, city: 'Kolkata', lat: 22.5726, lng: 88.3639, transactions: 670, fraudCount: 15, riskLevel: 'low' },
      { id: 7, city: 'Pune', lat: 18.5204, lng: 73.8567, transactions: 540, fraudCount: 12, riskLevel: 'low' },
      { id: 8, city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, transactions: 620, fraudCount: 22, riskLevel: 'medium' },
    ];
    setActivityData(mockData);
  }, []);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return isDark ? 'text-red-400 bg-red-500/20 border-red-500/40' : 'text-red-600 bg-red-100 border-red-300';
      case 'medium':
        return isDark ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40' : 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low':
        return isDark ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' : 'text-emerald-600 bg-emerald-100 border-emerald-300';
      default:
        return isDark ? 'text-gray-400 bg-gray-500/20 border-gray-500/40' : 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getMarkerSize = (transactions) => {
    if (transactions > 1000) return 'w-6 h-6';
    if (transactions > 700) return 'w-5 h-5';
    return 'w-4 h-4';
  };

  const totalTransactions = activityData.reduce((sum, region) => sum + region.transactions, 0);
  const totalFraud = activityData.reduce((sum, region) => sum + region.fraudCount, 0);
  const avgFraudRate = totalTransactions > 0 ? (totalFraud / totalTransactions * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className={`rounded-2xl p-6 backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Activity Map
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1`}>
              Real-time geographical distribution of transaction activity and fraud detection
            </p>
          </div>
          <Activity className={`w-10 h-10 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Regions</p>
            <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{activityData.length}</p>
          </div>
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Transactions</p>
            <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {totalTransactions.toLocaleString()}
            </p>
          </div>
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Fraud Cases</p>
            <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              {totalFraud}
            </p>
          </div>
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg Fraud Rate</p>
            <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {avgFraudRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className={`lg:col-span-2 rounded-2xl p-6 backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
          <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            India Transaction Heatmap
          </h4>
          
          {/* Simplified India Map */}
          <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl border border-white/10 overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 400 500" className="w-full h-full">
                {/* Simplified India outline */}
                <path
                  d="M200,50 L220,80 L240,120 L250,160 L260,200 L270,240 L280,280 L285,320 L280,360 L270,400 L250,440 L220,460 L190,470 L160,460 L130,440 L110,400 L100,360 L95,320 L100,280 L110,240 L120,200 L130,160 L140,120 L160,80 L180,50 Z"
                  fill="currentColor"
                  className={isDark ? 'text-emerald-500/20' : 'text-emerald-500/30'}
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Activity Markers */}
            {activityData.map((region) => {
              // Convert lat/lng to SVG coordinates (simplified)
              const x = ((region.lng - 68) / (97 - 68)) * 100;
              const y = ((35 - region.lat) / (35 - 8)) * 100;

              return (
                <div
                  key={region.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => setSelectedRegion(region)}
                >
                  {/* Pulse Animation */}
                  <div className={`absolute inset-0 rounded-full animate-ping ${
                    region.riskLevel === 'high' ? 'bg-red-500' :
                    region.riskLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  } opacity-75`} />
                  
                  {/* Marker */}
                  <div className={`relative ${getMarkerSize(region.transactions)} rounded-full ${
                    region.riskLevel === 'high' ? 'bg-red-500' :
                    region.riskLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  } border-2 border-white shadow-lg`} />

                  {/* Tooltip */}
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                    isDark ? 'bg-gray-900 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'
                  } shadow-xl z-10`}>
                    <p className="font-semibold">{region.city}</p>
                    <p className="text-xs">{region.transactions} transactions</p>
                    <p className="text-xs text-red-400">{region.fraudCount} fraud cases</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>High Risk</span>
            </div>
          </div>
        </div>

        {/* Region Details */}
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
            <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedRegion ? selectedRegion.city : 'Select a Region'}
            </h4>

            {selectedRegion ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${getRiskColor(selectedRegion.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Risk Level</span>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold capitalize">{selectedRegion.riskLevel}</p>
                </div>

                <div className={`p-4 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Transactions
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRegion.transactions.toLocaleString()}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Fraud Cases
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    {selectedRegion.fraudCount}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Fraud Rate
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {((selectedRegion.fraudCount / selectedRegion.transactions) * 100).toFixed(2)}%
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Coordinates
                  </p>
                  <p className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedRegion.lat.toFixed(4)}, {selectedRegion.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            ) : (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Click on a marker to view region details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Regional Activity Table */}
      <div className={`rounded-2xl p-6 backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Regional Activity Summary
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`text-xs uppercase tracking-wide border-b ${
              isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
              <tr>
                <th className="px-6 py-3 text-left">City</th>
                <th className="px-6 py-3 text-left">Transactions</th>
                <th className="px-6 py-3 text-left">Fraud Cases</th>
                <th className="px-6 py-3 text-left">Fraud Rate</th>
                <th className="px-6 py-3 text-left">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {activityData
                .sort((a, b) => b.transactions - a.transactions)
                .map((region) => (
                  <tr
                    key={region.id}
                    className={`border-b cursor-pointer ${
                      isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'
                    } transition-colors`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    <td className={`px-6 py-4 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {region.city}
                    </td>
                    <td className="px-6 py-4">{region.transactions.toLocaleString()}</td>
                    <td className={`px-6 py-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      {region.fraudCount}
                    </td>
                    <td className="px-6 py-4">
                      {((region.fraudCount / region.transactions) * 100).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(region.riskLevel)}`}>
                        {region.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityMap;
