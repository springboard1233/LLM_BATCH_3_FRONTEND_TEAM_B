import { useState, useEffect } from 'react'
import ThemeAwareLandingPage from './components/ThemeAwareLandingPage.jsx'
import SettingsPage from './components/SettingsPage.jsx'
import DashboardLayout from '../DashboardLayout.jsx'
import DashboardHeader from '../DashboardHeader.jsx'
import NavigationSidebar from '../NavigationSidebar.jsx'
import SystemStatus from '../SystemStatus.jsx'
import QuickStats from '../QuickStats.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'

import RiskLevelIndicator from '../RiskLevelIndicator.jsx'
import SearchFilterBar from '../SearchFilterBar.jsx'
import TransactionTable from '../TransactionTable.jsx'
import KeyPerformanceIndicators from '../KeyPerformanceIndicators.jsx'


// Enhanced sample data for comprehensive dashboard demonstration
const sampleTransactions = [
  {
    id: 'TXN001',
    customerId: 'CUST001',
    amount: 1500.00,
    status: 'Legitimate',
    channel: 'Online Banking',
    date: '2024-01-15',
    riskLevel: 'Low',
    kycStatus: true,
    kyc: true
  },
  {
    id: 'TXN002',
    customerId: 'CUST002',
    amount: 25000.00,
    status: 'Fraud',
    channel: 'Wire Transfer',
    date: '2024-01-14',
    riskLevel: 'High',
    kycStatus: false,
    kyc: false
  },
  {
    id: 'TXN003',
    customerId: 'CUST003',
    amount: 750.00,
    status: 'Legitimate',
    channel: 'Mobile App',
    date: '2024-01-13',
    riskLevel: 'Low',
    kycStatus: true,
    kyc: true
  },
  {
    id: 'TXN004',
    customerId: 'CUST004',
    amount: 3200.00,
    status: 'Safe',
    channel: 'ATM',
    date: '2024-01-12',
    riskLevel: 'Low',
    kycStatus: true,
    kyc: true
  },
  {
    id: 'TXN005',
    customerId: 'CUST005',
    amount: 50000.00,
    status: 'Fraud',
    channel: 'Branch',
    date: '2024-01-11',
    riskLevel: 'High',
    kycStatus: false,
    kyc: false
  },
  {
    id: 'TXN006',
    customerId: 'CUST006',
    amount: 890.50,
    status: 'Legitimate',
    channel: 'POS',
    date: '2024-01-10',
    riskLevel: 'Low',
    kycStatus: true,
    kyc: true
  },
  {
    id: 'TXN007',
    customerId: 'CUST007',
    amount: 12500.00,
    status: 'Fraud',
    channel: 'Web',
    date: '2024-01-09',
    riskLevel: 'High',
    kycStatus: false,
    kyc: false
  },
  {
    id: 'TXN008',
    customerId: 'CUST008',
    amount: 450.75,
    status: 'Safe',
    channel: 'Mobile',
    date: '2024-01-08',
    riskLevel: 'Low',
    kycStatus: true,
    kyc: true
  },
  {
    id: 'TXN009',
    customerId: 'CUST009',
    amount: 8750.00,
    status: 'Fraud',
    channel: 'ATM',
    date: '2024-01-07',
    riskLevel: 'High',
    kycStatus: false,
    kyc: false
  },
  {
    id: 'TXN010',
    customerId: 'CUST010',
    amount: 2100.25,
    status: 'Legitimate',
    channel: 'Online Banking',
    date: '2024-01-06',
    riskLevel: 'Medium',
    kycStatus: true,
    kyc: true
  },
  {
    id: 'TXN011',
    customerId: 'CUST011',
    amount: 675.00,
    status: 'Safe',
    channel: 'Mobile App',
    date: '2024-01-05',
    riskLevel: 'Low',
    kycStatus: true,
    kyc: true
  },
  {
    id: 'TXN012',
    customerId: 'CUST012',
    amount: 15000.00,
    status: 'Fraud',
    channel: 'Wire Transfer',
    date: '2024-01-04',
    riskLevel: 'High',
    kycStatus: false,
    kyc: false
  }
]



function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  )
}

function AppContent() {
  const [currentView, setCurrentView] = useState('landing') // 'landing' or 'dashboard'
  const [activeSection, setActiveSection] = useState('dashboard')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 1000)
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Top Row - System Status and Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <SystemStatus transactions={sampleTransactions} />
              </div>
              <div className="lg:col-span-1">
                <QuickStats transactions={sampleTransactions} />
              </div>
            </div>


            {/* Key Performance Indicators */}
            <KeyPerformanceIndicators transactions={sampleTransactions} />

            {/* Main Dashboard Content */}
            <DashboardLayout
              transactions={sampleTransactions}
              isLoading={isLoading}
            />
          </div>
        )
      case 'analytics':
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Analytics Dashboard</h2>
            <p className="text-gray-300">Advanced analytics and reporting features coming soon...</p>
          </div>
        )
      case 'fraud-detection':
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Fraud Detection Engine</h2>
            <p className="text-gray-300">Real-time fraud detection configuration and monitoring...</p>
          </div>
        )
      case 'settings':
        return <SettingsPage />
      default:
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{activeSection.replace('-', ' ').toUpperCase()}</h2>
            <p className="text-gray-300">This section is under development...</p>
          </div>
        )
    }
  }

  // Show landing page or dashboard based on current view
  if (currentView === 'landing') {
    return <ThemeAwareLandingPage onGetStarted={() => setCurrentView('dashboard')} />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/3 to-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Sidebar */}
      <NavigationSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <DashboardHeader
          onRefresh={handleRefresh}
          lastUpdated={lastUpdated}
          transactions={sampleTransactions}
          onBackToLanding={() => setCurrentView('landing')}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderMainContent()}
        </main>
      </div>

    </div>
  )
}

export default App