import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SettingsProvider, useSettings } from '../contexts/SettingsContext'
import DashboardHeader from '../../DashboardHeader'
import SystemStatus from '../../SystemStatus'
import QuickStats from '../../QuickStats'
import KeyPerformanceIndicators from '../../KeyPerformanceIndicators'
import NavigationSidebar from '../../NavigationSidebar'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock window.matchMedia for theme detection
const mockMatchMedia = vi.fn().mockImplementation(query => ({
  matches: query === '(prefers-color-scheme: dark)',
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

// Sample transaction data for testing
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
  }
]

// Complete preferences object for testing
const completePreferences = {
  notifications: true,
  autoRefresh: true,
  refreshInterval: 30000,
  compactMode: false,
  fraudAlerts: true,
  realTimeUpdates: true,
  autoLogout: false,
  enhancedEncryption: true
}

describe('Cross-Component Theme and Language Integration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    
    // Reset document attributes
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-theme-source')
  })

  afterEach(() => {
    // Clean up after each test
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-theme-source')
  })

  describe('Theme Application Across Components', () => {
    it('should apply light theme to all dashboard components', async () => {
      // Mock localStorage to return light theme
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'secureguard_settings') {
          return JSON.stringify({
            theme: 'light',
            language: 'en',
            preferences: completePreferences
          })
        }
        return null
      })

      render(
        <SettingsProvider>
          <div>
            <DashboardHeader 
              onRefresh={() => {}} 
              lastUpdated={new Date()} 
              transactions={sampleTransactions}
            />
            <SystemStatus transactions={sampleTransactions} />
            <QuickStats transactions={sampleTransactions} />
            <KeyPerformanceIndicators transactions={sampleTransactions} />
            <NavigationSidebar activeSection="dashboard" />
          </div>
        </SettingsProvider>
      )

      // Wait for theme to be applied
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light')
      })

      // Verify theme is applied to document
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
      expect(document.documentElement.getAttribute('data-theme-source')).toBe('manual')
    })

    it('should apply dark theme to all dashboard components', async () => {
      // Mock localStorage to return dark theme
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'secureguard_settings') {
          return JSON.stringify({
            theme: 'dark',
            language: 'en',
            preferences: completePreferences
          })
        }
        return null
      })

      render(
        <SettingsProvider>
          <div>
            <DashboardHeader 
              onRefresh={() => {}} 
              lastUpdated={new Date()} 
              transactions={sampleTransactions}
            />
            <SystemStatus transactions={sampleTransactions} />
            <QuickStats transactions={sampleTransactions} />
            <KeyPerformanceIndicators transactions={sampleTransactions} />
            <NavigationSidebar activeSection="dashboard" />
          </div>
        </SettingsProvider>
      )

      // Wait for theme to be applied
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      })

      // Verify theme is applied to document
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      expect(document.documentElement.getAttribute('data-theme-source')).toBe('manual')
    })

    it('should apply system theme based on OS preference', async () => {
      // Mock system preference for dark mode
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      // Mock localStorage to return system theme
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'secureguard_settings') {
          return JSON.stringify({
            theme: 'system',
            language: 'en',
            preferences: completePreferences
          })
        }
        return null
      })

      render(
        <SettingsProvider>
          <div>
            <DashboardHeader 
              onRefresh={() => {}} 
              lastUpdated={new Date()} 
              transactions={sampleTransactions}
            />
            <SystemStatus transactions={sampleTransactions} />
          </div>
        </SettingsProvider>
      )

      // Wait for theme to be applied
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      })

      // Verify system theme is applied (dark based on our mock)
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      expect(document.documentElement.getAttribute('data-theme-source')).toBe('system')
    })

    it('should update theme immediately when changed via settings context', async () => {
      const TestComponent = () => {
        const { updateTheme, theme } = useSettings()
        
        return (
          <div>
            <button onClick={() => updateTheme('dark')}>Switch to Dark</button>
            <div data-testid="current-theme">{theme}</div>
            <DashboardHeader 
              onRefresh={() => {}} 
              lastUpdated={new Date()} 
              transactions={sampleTransactions}
            />
          </div>
        )
      }

      render(
        <SettingsProvider>
          <TestComponent />
        </SettingsProvider>
      )

      // Wait for initial theme (system default)
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBeTruthy()
      })

      // Change to dark theme
      fireEvent.click(screen.getByText('Switch to Dark'))

      // Verify immediate theme change
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      })
      
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    })
  })

  describe('Language Application Across Components', () => {
    it('should display English text in all components by default', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'secureguard_settings') {
          return JSON.stringify({
            theme: 'dark',
            language: 'en',
            preferences: completePreferences
          })
        }
        return null
      })

      render(
        <SettingsProvider>
          <div>
            <DashboardHeader 
              onRefresh={() => {}} 
              lastUpdated={new Date()} 
              transactions={sampleTransactions}
            />
            <SystemStatus transactions={sampleTransactions} />
            <QuickStats transactions={sampleTransactions} />
            <KeyPerformanceIndicators transactions={sampleTransactions} />
            <NavigationSidebar activeSection="dashboard" />
          </div>
        </SettingsProvider>
      )

      // Check for English text in various components
      await waitFor(() => {
        expect(screen.getByText('SecureGuard AI Fraud Detection')).toBeInTheDocument()
      })
      
      expect(screen.getByText('System Status')).toBeInTheDocument()
      expect(screen.getByText('Quick Stats')).toBeInTheDocument()
      expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument()
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByText('Fraud Detection')).toBeInTheDocument()
    })

    it('should display Spanish text in all components when Spanish is selected', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'secureguard_settings') {
          return JSON.stringify({
            theme: 'dark',
            language: 'es',
            preferences: completePreferences
          })
        }
        return null
      })

      render(
        <SettingsProvider>
          <div>
            <DashboardHeader 
              onRefresh={() => {}} 
              lastUpdated={new Date()} 
              transactions={sampleTransactions}
            />
            <SystemStatus transactions={sampleTransactions} />
            <QuickStats transactions={sampleTransactions} />
            <KeyPerformanceIndicators transactions={sampleTransactions} />
            <NavigationSidebar activeSection="dashboard" />
          </div>
        </SettingsProvider>
      )

      // Check for Spanish text in various components
      await waitFor(() => {
        expect(screen.getByText('SecureGuard AI Detección de Fraude')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Estado del Sistema')).toBeInTheDocument()
      expect(screen.getByText('Estadísticas Rápidas')).toBeInTheDocument()
      expect(screen.getByText('Indicadores Clave de Rendimiento')).toBeInTheDocument()
      expect(screen.getByText('Panel de Control')).toBeInTheDocument()
      expect(screen.getByText('Análisis')).toBeInTheDocument()
      expect(screen.getByText('Detección de Fraude')).toBeInTheDocument()
    })

    it('should update language immediately when changed via settings context', async () => {
      const TestComponent = () => {
        const { updateLanguage, language } = useSettings()
        
        return (
          <div>
            <button onClick={() => updateLanguage('es')}>Switch to Spanish</button>
            <div data-testid="current-language">{language}</div>
            <DashboardHeader 
              onRefresh={() => {}} 
              lastUpdated={new Date()} 
              transactions={sampleTransactions}
            />
            <NavigationSidebar activeSection="dashboard" />
          </div>
        )
      }

      render(
        <SettingsProvider>
          <TestComponent />
        </SettingsProvider>
      )

      // Verify initial English text
      await waitFor(() => {
        expect(screen.getByText('SecureGuard AI Fraud Detection')).toBeInTheDocument()
      })
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByTestId('current-language')).toHaveTextContent('en')

      // Change to Spanish
      fireEvent.click(screen.getByText('Switch to Spanish'))

      // Verify immediate language change
      await waitFor(() => {
        expect(screen.getByText('SecureGuard AI Detección de Fraude')).toBeInTheDocument()
      })
      expect(screen.getByText('Panel de Control')).toBeInTheDocument()
      expect(screen.getByTestId('current-language')).toHaveTextContent('es')
    })
  })

  describe('Settings Persistence Across Browser Sessions', () => {
    it('should persist theme settings in localStorage', async () => {
      const initialSettings = {
        theme: 'light',
        language: 'en',
        preferences: completePreferences
      }

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'secureguard_settings') {
          return JSON.stringify(initialSettings)
        }
        return null
      })

      render(
        <SettingsProvider>
          <DashboardHeader 
            onRefresh={() => {}} 
            lastUpdated={new Date()} 
            transactions={sampleTransactions}
          />
        </SettingsProvider>
      )

      // Wait for settings to load
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('light')
      })

      // Verify localStorage was called to retrieve settings
      expect(localStorageMock.getItem).toHaveBeenCalledWith('secureguard_settings')
    })

    it('should persist language settings in localStorage', async () => {
      const initialSettings = {
        theme: 'dark',
        language: 'es',
        preferences: completePreferences
      }

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'secureguard_settings') {
          return JSON.stringify(initialSettings)
        }
        return null
      })

      render(
        <SettingsProvider>
          <DashboardHeader 
            onRefresh={() => {}} 
            lastUpdated={new Date()} 
            transactions={sampleTransactions}
          />
        </SettingsProvider>
      )

      // Wait for settings to load and verify Spanish text
      await waitFor(() => {
        expect(screen.getByText('SecureGuard AI Detección de Fraude')).toBeInTheDocument()
      })

      // Verify localStorage was called to retrieve settings
      expect(localStorageMock.getItem).toHaveBeenCalledWith('secureguard_settings')
    })

    it('should save settings to localStorage when changed', async () => {
      const TestComponent = () => {
        const { updateTheme, updateLanguage } = useSettings()
        
        return (
          <div>
            <button onClick={() => updateTheme('light')}>Change to Light</button>
            <button onClick={() => updateLanguage('es')}>Change to Spanish</button>
            <DashboardHeader 
              onRefresh={() => {}} 
              lastUpdated={new Date()} 
              transactions={sampleTransactions}
            />
          </div>
        )
      }

      render(
        <SettingsProvider>
          <TestComponent />
        </SettingsProvider>
      )

      // Change theme
      fireEvent.click(screen.getByText('Change to Light'))
      
      // Wait for localStorage to be called
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'secureguard_settings',
          expect.stringContaining('"theme":"light"')
        )
      })

      // Change language
      fireEvent.click(screen.getByText('Change to Spanish'))
      
      // Wait for localStorage to be called again
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'secureguard_settings',
          expect.stringContaining('"language":"es"')
        )
      })
    })

    it('should handle localStorage unavailability gracefully', async () => {
      // Mock localStorage to throw an error
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available')
      })

      // Should not throw an error and use default settings
      expect(() => {
        render(
          <SettingsProvider>
            <DashboardHeader 
              onRefresh={() => {}} 
              lastUpdated={new Date()} 
              transactions={sampleTransactions}
            />
          </SettingsProvider>
        )
      }).not.toThrow()

      // Should display default English text
      await waitFor(() => {
        expect(screen.getByText('SecureGuard AI Fraud Detection')).toBeInTheDocument()
      })
    })

    it('should handle corrupted localStorage data gracefully', async () => {
      // Mock localStorage to return invalid JSON
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'secureguard_settings') {
          return 'invalid json data'
        }
        return null
      })

      // Should not throw an error and use default settings
      expect(() => {
        render(
          <SettingsProvider>
            <DashboardHeader 
              onRefresh={() => {}} 
              lastUpdated={new Date()} 
              transactions={sampleTransactions}
            />
          </SettingsProvider>
        )
      }).not.toThrow()

      // Should display default English text and theme
      await waitFor(() => {
        expect(screen.getByText('SecureGuard AI Fraud Detection')).toBeInTheDocument()
      })
      
      // Should apply default theme (system)
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBeTruthy()
      })
    })
  })
})