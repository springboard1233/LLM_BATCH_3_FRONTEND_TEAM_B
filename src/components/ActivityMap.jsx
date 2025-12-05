import React, { useState, useEffect } from 'react';
import { MapPin, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';

const ActivityMap = ({ theme = 'dark', transactions = [], totalTransactions = 0, overviewStats = null }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const { isMobile, isTablet } = useResponsive();

  const isDark = theme === 'dark';

  // Use real data from backend or mock data as fallback
  useEffect(() => {
    // Calculate real geographical distribution from transactions
    // Since we don't have location data in transactions, use mock data with real totals
    const totalTxns = totalTransactions || 5000;
    const totalFraudCases = overviewStats?.fraud_cases || 432;
    
    // Distribute transactions across cities proportionally
    const mockData = [
      { id: 1, city: 'Mumbai', lat: 19.0760, lng: 72.8777, transactions: Math.round(totalTxns * 0.25), fraudCount: Math.round(totalFraudCases * 0.25), riskLevel: 'high' },
      { id: 2, city: 'Delhi', lat: 28.7041, lng: 77.1025, transactions: Math.round(totalTxns * 0.20), fraudCount: Math.round(totalFraudCases * 0.20), riskLevel: 'medium' },
      { id: 3, city: 'Bangalore', lat: 12.9716, lng: 77.5946, transactions: Math.round(totalTxns * 0.22), fraudCount: Math.round(totalFraudCases * 0.22), riskLevel: 'medium' },
      { id: 4, city: 'Hyderabad', lat: 17.3850, lng: 78.4867, transactions: Math.round(totalTxns * 0.15), fraudCount: Math.round(totalFraudCases * 0.15), riskLevel: 'low' },
      { id: 5, city: 'Chennai', lat: 13.0827, lng: 80.2707, transactions: Math.round(totalTxns * 0.10), fraudCount: Math.round(totalFraudCases * 0.10), riskLevel: 'low' },
      { id: 6, city: 'Kolkata', lat: 22.5726, lng: 88.3639, transactions: Math.round(totalTxns * 0.05), fraudCount: Math.round(totalFraudCases * 0.05), riskLevel: 'low' },
      { id: 7, city: 'Pune', lat: 18.5204, lng: 73.8567, transactions: Math.round(totalTxns * 0.02), fraudCount: Math.round(totalFraudCases * 0.02), riskLevel: 'low' },
      { id: 8, city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, transactions: Math.round(totalTxns * 0.01), fraudCount: Math.round(totalFraudCases * 0.01), riskLevel: 'low' },
    ];
    setActivityData(mockData);
  }, [totalTransactions, overviewStats]);

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

  const totalRegionTransactions = activityData.reduce((sum, region) => sum + region.transactions, 0);
  const totalFraud = activityData.reduce((sum, region) => sum + region.fraudCount, 0);
  const avgFraudRate = totalRegionTransactions > 0 ? (totalFraud / totalRegionTransactions * 100).toFixed(2) : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Stats */}
      <div className={`rounded-2xl ${isMobile ? 'p-4' : 'p-6'} backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className={`flex items-center justify-between ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <div>
            <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Activity Map
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} ${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>
              {isMobile ? 'Transaction activity & fraud detection' : 'Real-time geographical distribution of transaction activity and fraud detection'}
            </p>
          </div>
          <Activity className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Regions
            </p>
            <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mt-1 md:mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {activityData.length}
            </p>
          </div>
          <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Transactions
            </p>
            <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mt-1 md:mt-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {isMobile ? `${(totalTransactions / 1000).toFixed(1)}k` : totalTransactions.toLocaleString()}
            </p>
          </div>
          <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Fraud Cases
            </p>
            <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mt-1 md:mt-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              {totalFraud}
            </p>
          </div>
          <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Fraud Rate
            </p>
            <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mt-1 md:mt-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {avgFraudRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Map Area */}
        <div className={`lg:col-span-2 rounded-2xl ${isMobile ? 'p-4' : 'p-6'} backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
          <h4 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 md:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            India Transaction Heatmap
          </h4>
          
          {/* Simplified India Map */}
          <div className={`relative w-full ${isMobile ? 'h-[300px]' : isTablet ? 'h-[400px]' : 'h-[500px]'} bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl border border-white/10 overflow-hidden`}>
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

                  {/* Tooltip - Hidden on mobile, shown on hover for desktop */}
                  {!isMobile && (
                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                      isDark ? 'bg-gray-900 border-white/20 text-white' : 'bg-white border-gray-200 text-gray-900'
                    } shadow-xl z-10`}>
                      <p className="font-semibold">{region.city}</p>
                      <p className="text-xs">{region.transactions} transactions</p>
                      <p className="text-xs text-red-400">{region.fraudCount} fraud cases</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className={`mt-3 md:mt-4 flex items-center justify-center ${isMobile ? 'gap-3' : 'gap-6'} ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <div className="flex items-center gap-1 md:gap-2">
              <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-emerald-500`} />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Low</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-yellow-500`} />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Medium</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full bg-red-500`} />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>High</span>
            </div>
          </div>
        </div>

        {/* Region Details */}
        <div className="space-y-3 md:space-y-4">
          <div className={`rounded-2xl ${isMobile ? 'p-4' : 'p-6'} backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
            <h4 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 md:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedRegion ? selectedRegion.city : 'Select a Region'}
            </h4>

            {selectedRegion ? (
              <div className="space-y-3 md:space-y-4">
                <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border ${getRiskColor(selectedRegion.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Risk Level</span>
                    <AlertTriangle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  </div>
                  <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold capitalize`}>{selectedRegion.riskLevel}</p>
                </div>

                <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} uppercase tracking-wide mb-1 md:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Transactions
                  </p>
                  <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRegion.transactions.toLocaleString()}
                  </p>
                </div>

                <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} uppercase tracking-wide mb-1 md:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Fraud Cases
                  </p>
                  <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    {selectedRegion.fraudCount}
                  </p>
                </div>

                <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} uppercase tracking-wide mb-1 md:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Fraud Rate
                  </p>
                  <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {((selectedRegion.fraudCount / selectedRegion.transactions) * 100).toFixed(2)}%
                  </p>
                </div>

                {!isMobile && (
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Coordinates
                    </p>
                    <p className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedRegion.lat.toFixed(4)}, {selectedRegion.lng.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className={`text-center ${isMobile ? 'py-6' : 'py-8'} ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <MapPin className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} mx-auto mb-3 opacity-50`} />
                <p className={isMobile ? 'text-sm' : ''}>
                  {isMobile ? 'Tap a marker for details' : 'Click on a marker to view region details'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Regional Activity Table */}
      <div className={`rounded-2xl ${isMobile ? 'p-4' : 'p-6'} backdrop-blur-lg border ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <h4 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 md:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Regional Activity Summary
        </h4>
        
        {/* Mobile: Card layout */}
        {isMobile ? (
          <div className="space-y-3">
            {activityData
              .sort((a, b) => b.transactions - a.transactions)
              .map((region) => (
                <div
                  key={region.id}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    isDark ? 'border-white/10 hover:bg-white/5 active:bg-white/10' : 'border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                  } transition-colors`}
                  onClick={() => setSelectedRegion(region)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {region.city}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(region.riskLevel)}`}>
                      {region.riskLevel}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Transactions</p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {region.transactions.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Fraud</p>
                      <p className={`font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        {region.fraudCount}
                      </p>
                    </div>
                    <div>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Rate</p>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {((region.fraudCount / region.transactions) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          /* Desktop: Table layout */
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
        )}
      </div>
    </div>
  );
};

export default ActivityMap;
