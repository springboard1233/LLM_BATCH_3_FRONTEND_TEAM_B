import { useState, useEffect } from 'react'
import ThemeAwareLandingPage from './components/ThemeAwareLandingPage.jsx'
import SettingsPage from './components/SettingsPage.jsx'
import DashboardLayout from '../DashboardLayout.jsx'
import DashboardHeader from '../DashboardHeader.jsx'
import NavigationSidebar from '../NavigationSidebar.jsx'
import SystemStatus from '../SystemStatus.jsx'
import QuickStats from '../QuickStats.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'

import DataUploadZone from './components/DataUploadZone'
import LiveToggle from './components/LiveToggle'
import ExportControls from './components/ExportControls'
import ExportPreviewTable from './components/ExportPreviewTable'
import Reports from './components/Reports'
import Toast from './components/Toast'

import RiskLevelIndicator from '../RiskLevelIndicator.jsx'
import SearchFilterBar from '../SearchFilterBar.jsx'
import TransactionTable from '../TransactionTable.jsx'
import KeyPerformanceIndicators from '../KeyPerformanceIndicators.jsx'
import { DashboardProvider, useDashboard } from './contexts/DashboardContext'
import AnalyticsView from '../AnalyticsView.jsx'
import FraudDetection from '../FraudDetection.jsx'

function App() {
  return (
    <SettingsProvider>
      <DashboardProvider>
        <AppContent />
      </DashboardProvider>
    </SettingsProvider>
  )
}

function AppContent() {
  const [isLiveStream, setIsLiveStream] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [exportFormat, setExportFormat] = useState('CSV')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [exportData, setExportData] = useState([])
  const [isExporting, setIsExporting] = useState(false)
  const [toast, setToast] = useState(null)

  // ✅ fetch data from FastAPI (provided by DashboardProvider)
  const { 
    transactions, 
    loading: isLoading, 
    error,
    refreshData
  } = useDashboard();

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
        <div className="text-center text-white p-10">Loading backend data...</div>
      )
    }

    if (error) {
      return (
        <div className="text-center text-red-400 p-10">Error fetching data: {error}</div>
      )
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-4">Data Upload</h3>
              <DataUploadZone
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                uploadProgress={uploadProgress}
                setUploadProgress={setUploadProgress}
                setToast={setToast}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <SystemStatus transactions={transactions} />
              </div>
              <div className="lg:col-span-1">
                <QuickStats transactions={transactions} />
              </div>
            </div>

            <KeyPerformanceIndicators transactions={transactions} />

            <DashboardLayout
              transactions={transactions}
              isLoading={isLoading}
            />
          </div>
        )
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-4">Analytics & Insights</h3>
              <AnalyticsView data={transactions} />
            </div>
          </div>
        )
      case 'fraud-detection':
        return (
          <div className="space-y-6">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-4">Fraud Detection Lab</h3>
              <FraudDetection />
            </div>
          </div>
        )

      case 'export':
        return (
          <div className="space-y-6">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-2xl font-bold mb-6">Export & Reporting</h2>
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

      case 'reports':
        return <Reports transactions={transactions} />

      default:
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              {activeSection.replace('-', ' ').toUpperCase()}
            </h2>
            <p className="text-gray-300">This section is under development...</p>
          </div>
        )
    }
  }

  if (currentView === 'landing') {
    return <ThemeAwareLandingPage onGetStarted={() => setCurrentView('dashboard')} />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      <NavigationSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        items={navigationItems}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {renderHeader()}
        <main className="flex-1 overflow-y-auto p-6">{renderMainContent()}</main>
      </div>
    </div>
  )
}

export default App
