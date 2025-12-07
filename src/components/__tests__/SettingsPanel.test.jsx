import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsPanel from '../SettingsPanel'
import { SettingsProvider } from '../../contexts/SettingsContext'

// Mock the translation hook
vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'settings.title': 'Settings',
        'settings.preferences': 'Preferences',
        'settings.resetToDefaults': 'Reset to Defaults',
        'settings.done': 'Done',
        'settings.cancel': 'Cancel',
        'settings.reset': 'Reset',
        'settings.resetConfirmTitle': 'Reset All Settings?',
        'settings.resetConfirmMessage': 'This will reset all your preferences to their default values.',
        'settings.preferences.notifications': 'Notifications',
        'settings.preferences.notificationsDesc': 'Receive system notifications',
        'settings.preferences.autoRefresh': 'Auto Refresh',
        'settings.preferences.autoRefreshDesc': 'Automatically refresh data',
        'settings.preferences.refreshInterval': 'Refresh Interval',
        'settings.preferences.compactMode': 'Compact Mode',
        'settings.preferences.compactModeDesc': 'Use compact display layout'
      }
      return translations[key] || key
    }
  })
}))

// Mock storage utilities
vi.mock('../../utils/storageUtils', () => ({
  storage: {
    isAvailable: vi.fn(() => true),
    getError: vi.fn(() => null),
    get: vi.fn(),
    set: vi.fn(() => true),
    remove: vi.fn(() => true),
    getUsageInfo: vi.fn(() => ({
      available: true,
      error: null,
      usingFallback: false,
      totalKeys: 5,
      estimatedSize: 1024
    }))
  },
  validator: {
    validateSchema: vi.fn(() => ({ isValid: true, errors: [] }))
  }
}))

import { storage } from '../../utils/storageUtils'

describe('SettingsPanel Reset Functionality', () => {
  const mockOnClose = vi.fn()
  
  const renderSettingsPanel = (isOpen = true) => {
    return render(
      <SettingsProvider>
        <SettingsPanel isOpen={isOpen} onClose={mockOnClose} />
      </SettingsProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock createPortal to render in place
    vi.mock('react-dom', async () => {
      const actual = await vi.importActual('react-dom')
      return {
        ...actual,
        createPortal: (element) => element
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Reset Button and Confirmation', () => {
    it('should show reset confirmation dialog when reset button is clicked', async () => {
      const user = userEvent.setup()
      renderSettingsPanel()

      const resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)

      expect(screen.getByText('Reset All Settings?')).toBeInTheDocument()
      expect(screen.getByText(/This will reset all your preferences/)).toBeInTheDocument()
    })

    it('should close confirmation dialog when cancel is clicked', async () => {
      const user = userEvent.setup()
      renderSettingsPanel()

      // Open confirmation dialog
      const resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)

      // Click cancel
      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)

      expect(screen.queryByText('Reset All Settings?')).not.toBeInTheDocument()
    })

    it('should perform reset when confirmed', async () => {
      const user = userEvent.setup()
      renderSettingsPanel()

      // Open confirmation dialog
      const resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)

      // Click reset
      const confirmResetButton = screen.getByText('Reset')
      await user.click(confirmResetButton)

      await waitFor(() => {
        expect(storage.remove).toHaveBeenCalledWith('secureguard_settings')
        expect(screen.queryByText('Reset All Settings?')).not.toBeInTheDocument()
      })
    })
  })

  describe('Storage Error Handling', () => {
    it('should show storage warning when storage is unavailable', () => {
      storage.isAvailable.mockReturnValue(false)
      
      renderSettingsPanel()

      expect(screen.getByText('⚠️ Storage Notice')).toBeInTheDocument()
      expect(screen.getByText(/Local storage is not available/)).toBeInTheDocument()
    })

    it('should show storage error message when there is a storage error', () => {
      storage.getUsageInfo.mockReturnValue({
        available: true,
        error: 'Storage access denied',
        usingFallback: false,
        totalKeys: 0,
        estimatedSize: 0
      })
      
      renderSettingsPanel()

      expect(screen.getByText('⚠️ Storage Notice')).toBeInTheDocument()
      expect(screen.getByText('Storage error: Storage access denied')).toBeInTheDocument()
    })

    it('should show storage warning in reset confirmation when storage unavailable', async () => {
      const user = userEvent.setup()
      storage.isAvailable.mockReturnValue(false)
      
      renderSettingsPanel()

      const resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)

      expect(screen.getByText(/Storage is not available/)).toBeInTheDocument()
      expect(screen.getByText(/Settings will reset but may not persist/)).toBeInTheDocument()
    })
  })

  describe('Reset Process Error Handling', () => {
    it('should show loading state during reset', async () => {
      const user = userEvent.setup()
      
      // Mock a slow reset operation
      storage.remove.mockImplementation(() => {
        return new Promise(resolve => setTimeout(() => resolve(true), 100))
      })
      
      renderSettingsPanel()

      const resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)

      const confirmResetButton = screen.getByText('Reset')
      await user.click(confirmResetButton)

      // Should show loading state
      expect(screen.getByText('Resetting...')).toBeInTheDocument()
      expect(confirmResetButton).toBeDisabled()
    })

    it('should show error message when reset fails', async () => {
      const user = userEvent.setup()
      
      // Mock reset failure
      storage.remove.mockImplementation(() => {
        throw new Error('Reset operation failed')
      })
      
      renderSettingsPanel()

      const resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)

      const confirmResetButton = screen.getByText('Reset')
      await user.click(confirmResetButton)

      await waitFor(() => {
        expect(screen.getByText('❌ Error: Reset operation failed')).toBeInTheDocument()
      })
    })

    it('should disable buttons during reset operation', async () => {
      const user = userEvent.setup()
      
      // Mock a slow reset
      let resolveReset
      storage.remove.mockImplementation(() => {
        return new Promise(resolve => {
          resolveReset = resolve
        })
      })
      
      renderSettingsPanel()

      const resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)

      const confirmResetButton = screen.getByText('Reset')
      const cancelButton = screen.getByText('Cancel')
      
      await user.click(confirmResetButton)

      // Both buttons should be disabled during reset
      expect(confirmResetButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()

      // Resolve the reset
      resolveReset(true)
      
      await waitFor(() => {
        expect(screen.queryByText('Reset All Settings?')).not.toBeInTheDocument()
      })
    })
  })

  describe('Reset Confirmation Details', () => {
    it('should show detailed list of what will be reset', async () => {
      const user = userEvent.setup()
      renderSettingsPanel()

      const resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)

      expect(screen.getByText('This will reset:')).toBeInTheDocument()
      expect(screen.getByText(/Theme preference/)).toBeInTheDocument()
      expect(screen.getByText(/Language preference/)).toBeInTheDocument()
      expect(screen.getByText(/All notification settings/)).toBeInTheDocument()
      expect(screen.getByText(/Auto-refresh settings/)).toBeInTheDocument()
      expect(screen.getByText(/Display preferences/)).toBeInTheDocument()
    })

    it('should clear error state when confirmation dialog is reopened', async () => {
      const user = userEvent.setup()
      
      // First, cause an error
      storage.remove.mockImplementationOnce(() => {
        throw new Error('First error')
      })
      
      renderSettingsPanel()

      // Open dialog and cause error
      let resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)
      
      let confirmResetButton = screen.getByText('Reset')
      await user.click(confirmResetButton)

      await waitFor(() => {
        expect(screen.getByText('❌ Error: First error')).toBeInTheDocument()
      })

      // Close dialog
      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)

      // Reopen dialog - error should be cleared
      resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)

      expect(screen.queryByText('❌ Error: First error')).not.toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should handle escape key to close confirmation dialog', async () => {
      renderSettingsPanel()

      const resetButton = screen.getByText('Reset to Defaults')
      fireEvent.click(resetButton)

      expect(screen.getByText('Reset All Settings?')).toBeInTheDocument()

      // Press escape
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

      await waitFor(() => {
        expect(screen.queryByText('Reset All Settings?')).not.toBeInTheDocument()
      })
    })

    it('should maintain focus management during reset process', async () => {
      const user = userEvent.setup()
      renderSettingsPanel()

      const resetButton = screen.getByText('Reset to Defaults')
      await user.click(resetButton)

      const confirmResetButton = screen.getByText('Reset')
      expect(confirmResetButton).toBeInTheDocument()
      
      // Focus should be manageable
      confirmResetButton.focus()
      expect(document.activeElement).toBe(confirmResetButton)
    })
  })
})