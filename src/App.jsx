import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import ThemeAwareLandingPage from './components/ThemeAwareLandingPage.jsx'
import SettingsPage from './components/SettingsPage.jsx'
import DashboardLayout from '../DashboardLayout.jsx'
import DashboardHeader from '../DashboardHeader.jsx'
import NavigationSidebar from '../NavigationSidebar.jsx'
import SystemStatus from '../SystemStatus.jsx'
import QuickStats from '../QuickStats.jsx'
import { SettingsProvider, useSettings } from './contexts/SettingsContext.jsx'
import LoginPage from './components/LoginPage.jsx'
import SignupPage from './components/SignupPage.jsx'
import { AuthProvider } from './contexts/AuthContext'

import DataUploadZone from './components/DataUploadZone'
import LiveToggle from './components/LiveToggle'
import ExportControls from './components/ExportControls'
import ExportPreviewTable from './components/ExportPreviewTable'
import Reports from './components/Reports'
import ActivityMap from "./components/ActivityMap";
import Toast from './components/Toast'

import RiskLevelIndicator from '../RiskLevelIndicator.jsx'
import SearchFilterBar from '../SearchFilterBar.jsx'
import TransactionTable from '../TransactionTable.jsx'
import KeyPerformanceIndicators from '../KeyPerformanceIndicators.jsx'
import { DashboardProvider, useDashboard } from './contexts/DashboardContext'
import AnalyticsView from '../AnalyticsView.jsx'
import FraudDetection from '../FraudDetection.jsx'
import TransactionManagement from '../TransactionManagement'
import RiskAnalysis from '../RiskAnalysis'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <DashboardProvider>
            <AppContent />
          </DashboardProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 🔥 THE FIX — IMPORT EFFECTIVE THEME
  const { effectiveTheme } = useSettings();
  const isDarkTheme = effectiveTheme === 'dark';
  
  // Check if we're on a route that should show landing page
  const isLandingRoute = location.pathname === '/' || location.pathname === '/landing';

  const [isLiveStream, setIsLiveStream] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [exportFormat, setExportFormat] = useState('CSV')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [exportData, setExportData] = useState([])
  const [isExporting, setIsExporting] = useState(false)
  const [toast, setToast] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Backend data
  const { 
    transactions, 
    totalTransactions,
    overviewStats,
    loading: isLoading, 
    error,
    refreshData
  } = useDashboard();

  // Debug logging
  useEffect(() => {
    console.log('📊 App.jsx - Dashboard State:', {
      transactionsLength: transactions?.length,
      totalTransactions,
      isLoading,
      error
    });
  }, [transactions, totalTransactions, isLoading, error]);

  const [currentView, setCurrentView] = useState('landing')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    refreshData();
    setLastUpdated(new Date());
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'fraud-detection', label: 'Fraud Detection' },
    { id: 'transaction-management', label: 'Transaction Management' },
    { id: 'risk-analysis', label: 'Risk Analysis' },
    { id: 'activity-map', label: 'Activity Map' },
    { id: 'reports', label: 'Reports' },
    { id: 'export', label: 'Export' }
  ]

  const renderHeader = () => (
    <DashboardHeader
      onRefresh={handleRefresh}
      lastUpdated={lastUpdated}
      transactions={transactions}
      onBackToLanding={() => setCurrentView('landing')}
      onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      rightContent={
        <LiveToggle
          isLiveStream={isLiveStream}
          setIsLiveStream={setIsLiveStream}
        />
      }
    />
  )

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className={`text-center p-6 md:p-10 text-sm md:text-base ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Loading backend data...
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-6 md:p-10 text-sm md:text-base">Error fetching data: {error}</div>
      )
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-4 md:space-y-6">
            <div className={`backdrop-blur-md rounded-xl border p-4 md:p-6 shadow-lg ${
              isDarkTheme 
                ? 'bg-black/20 border-white/10 text-white' 
                : 'bg-white/70 border-gray-300/50 text-gray-900 shadow-blue-100/50'
            }`}>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Data Upload</h3>
              <DataUploadZone
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                uploadProgress={uploadProgress}
                setUploadProgress={setUploadProgress}
                setToast={setToast}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="lg:col-span-3">
                <SystemStatus 
                  transactions={transactions} 
                  totalTransactions={totalTransactions}
                />
              </div>
              <div className="lg:col-span-1">
                <QuickStats 
                  transactions={transactions}
                  totalTransactions={totalTransactions}
                  overviewStats={overviewStats}
                />
              </div>
            </div>

            <KeyPerformanceIndicators 
              transactions={transactions} 
              totalTransactions={totalTransactions}
              overviewStats={overviewStats}
            />

            <DashboardLayout
              transactions={transactions}
              totalTransactions={totalTransactions}
              overviewStats={overviewStats}
              isLoading={isLoading}
            />
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-4 md:space-y-6">
            <div className={`backdrop-blur-md rounded-xl border p-4 md:p-6 shadow-lg ${
              isDarkTheme 
                ? 'bg-black/20 border-white/10 text-white' 
                : 'bg-white/70 border-gray-300/50 text-gray-900 shadow-blue-100/50'
            }`}>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Analytics & Insights</h3>
              <AnalyticsView data={transactions} />
            </div>
          </div>
        )

      case 'transaction-management':
        return (
          <div className="space-y-4 md:space-y-6">
            {/* 🔥 FIXED THEME PROP */}
            <TransactionManagement theme={isDarkTheme ? 'dark' : 'light'} />
          </div>
        )

      case 'risk-analysis':
        return (
          <div className="space-y-4 md:space-y-6">
            {/* 🔥 FIXED THEME PROP */}
            <RiskAnalysis theme={isDarkTheme ? 'dark' : 'light'} />
          </div>
        )

      case 'fraud-detection':
        return (
          <div className="space-y-4 md:space-y-6">
            <div className={`backdrop-blur-md rounded-xl border p-4 md:p-6 shadow-lg ${
              isDarkTheme 
                ? 'bg-black/20 border-white/10 text-white' 
                : 'bg-white/70 border-gray-300/50 text-gray-900 shadow-blue-100/50'
            }`}>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Fraud Detection Lab</h3>
              <FraudDetection />
            </div>
          </div>
        )

      case 'export':
        return (
          <div className="space-y-4 md:space-y-6">
            <div className={`backdrop-blur-md rounded-xl border p-4 md:p-6 shadow-lg ${
              isDarkTheme 
                ? 'bg-black/20 border-white/10 text-white' 
                : 'bg-white/70 border-gray-300/50 text-gray-900 shadow-blue-100/50'
            }`}>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Export & Reporting</h2>
              <ExportControls
                exportFormat={exportFormat}
                setExportFormat={setExportFormat}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                exportData={exportData}
                setExportData={setExportData}
                isExporting={isExporting}
                setIsExporting={setIsExporting}
                setToast={setToast}
                transactions={transactions}
              />
            </div>

            <ExportPreviewTable
              exportData={exportData}
              exportFormat={exportFormat}
            />
          </div>
        )

      case "activity-map":
        return (
          <div className="space-y-4 md:space-y-6">
            <ActivityMap 
              theme={isDarkTheme ? "dark" : "light"}
              transactions={transactions}
              totalTransactions={totalTransactions}
              overviewStats={overviewStats}
            />
          </div>
        ) 
        
        
      case 'reports':
        return <Reports transactions={transactions} />

      default:
        return (
          <div className={`backdrop-blur-md rounded-xl border p-4 md:p-6 lg:p-8 text-center shadow-lg ${
            isDarkTheme 
              ? 'bg-black/20 border-white/10' 
              : 'bg-white/70 border-gray-300/50 shadow-blue-100/50'
          }`}>
            <h2 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {activeSection.replace('-', ' ').toUpperCase()}
            </h2>
            <p className={`text-sm md:text-base ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              This section is under development...
            </p>
          </div>
        )
    }
  }

  // Handle routing - show auth pages or landing page
  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={() => navigate('/dashboard')} onSwitchToSignup={() => navigate('/register')} onContinueAsGuest={() => navigate('/dashboard')} />} />
      <Route path="/register" element={<SignupPage onSignup={() => navigate('/dashboard')} onSwitchToLogin={() => navigate('/login')} onContinueAsGuest={() => navigate('/dashboard')} />} />
      <Route path="/" element={<ThemeAwareLandingPage onGetStarted={() => { setCurrentView('dashboard'); navigate('/dashboard'); }} />} />
      <Route path="/landing" element={<ThemeAwareLandingPage onGetStarted={() => { setCurrentView('dashboard'); navigate('/dashboard'); }} />} />
      <Route path="/dashboard" element={
        <div className={`flex flex-col md:flex-row h-screen relative overflow-hidden transition-colors duration-300 ${
          isDarkTheme 
            ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        }`}>
          <NavigationSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            items={navigationItems}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuClose={() => setIsMobileMenuOpen(false)}
          />

          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            {renderHeader()}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{renderMainContent()}</main>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App
