import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, renderHook, act, waitFor } from '@testing-library/react'
import { SettingsProvider, useSettings } from '../SettingsContext'

// Mock the storage utilities
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
    })),
    clearOldEntries: vi.fn()
  },
  validator: {
    validateSchema: vi.fn(),
    isOneOf: vi.fn(),
    isPlainObject: vi.fn(),
    isBoolean: vi.fn(),
    isPositiveNumber: vi.fn()
  }
}))

import { storage, validator } from '../../utils/storageUtils'

describe('SettingsContext Error Handling', () => {
  const defaultSettings = {
    theme: 'system',
    language: 'en',
    preferences: {
      notifications: true,
      autoRefresh: true,
      refreshInterval: 30000,
      compactMode: false,
      fraudAlerts: true,
      realTimeUpdates: true,
      autoLogout: false,
      enhancedEncryption: true
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    storage.isAvailable.mockReturnValue(true)
    storage.getError.mockReturnValue(null)
    storage.get.mockReturnValue(null)
    storage.set.mockReturnValue(true)
    storage.remove.mockReturnValue(true)
    
    validator.validateSchema.mockReturnValue({
      isValid: true,
      errors: []
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Storage Unavailable Scenarios', () => {
    it('should handle storage unavailable on initialization', async () => {
      storage.isAvailable.mockReturnValue(false)
      storage.getError.mockReturnValue(new Error('localStorage not supported'))

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      await waitFor(() => {
        expect(result.current.settings).toEqual(defaultSettings)
        expect(result.current.isStorageAvailable()).toBe(false)
        expect(result.current.getStorageError()).toEqual(expect.any(Error))
      })
    })

    it('should handle storage errors during save operations', async () => {
      storage.set.mockReturnValue(false) // Simulate save failure

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('dark')
      })

      await waitFor(() => {
        expect(result.current.theme).toBe('dark')
        expect(storage.set).toHaveBeenCalled()
      })
    })

    it('should attempt to clear old entries when storage is full', async () => {
      storage.set.mockReturnValueOnce(false) // First save fails
      storage.getUsageInfo.mockReturnValue({
        available: true,
        estimatedSize: 5000000 // > 4MB threshold
      })
      storage.set.mockReturnValueOnce(true) // Retry succeeds

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updatePreferences({ notifications: false })
      })

      await waitFor(() => {
        expect(storage.clearOldEntries).toHaveBeenCalled()
        expect(storage.set).toHaveBeenCalledTimes(2) // Initial fail + retry
      })
    })
  })

  describe('Data Validation Scenarios', () => {
    it('should handle corrupted settings data', async () => {
      const corruptedSettings = {
        theme: 'invalid-theme',
        language: 123,
        preferences: 'not-an-object'
      }

      storage.get.mockReturnValue(corruptedSettings)
      validator.validateSchema.mockReturnValue({
        isValid: false,
        errors: ['Invalid theme', 'Invalid language', 'Invalid preferences']
      })

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      await waitFor(() => {
        // Should fall back to default settings
        expect(result.current.settings).toEqual(defaultSettings)
        expect(storage.set).toHaveBeenCalledWith('secureguard_settings', defaultSettings)
      })
    })

    it('should validate current settings and return errors', async () => {
      validator.validateSchema.mockReturnValue({
        isValid: false,
        errors: ['Theme is invalid', 'Language not supported']
      })

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        const validation = result.current.validateCurrentSettings()
        expect(validation.isValid).toBe(false)
        expect(validation.errors).toHaveLength(2)
      })
    })

    it('should repair invalid settings', async () => {
      const invalidSettings = {
        theme: 'dark',
        language: 'en',
        preferences: defaultSettings.preferences
      }

      validator.validateSchema
        .mockReturnValueOnce({
          isValid: false,
          errors: ['Some validation error']
        })
        .mockReturnValueOnce({
          isValid: true,
          errors: []
        })

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        const errors = result.current.repairSettings()
        expect(errors).toHaveLength(1)
        expect(errors[0]).toBe('Some validation error')
      })
    })
  })

  describe('Reset Functionality Error Handling', () => {
    it('should handle reset when storage removal fails', async () => {
      storage.remove.mockReturnValue(false) // Simulate removal failure

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.resetToDefaults()
      })

      await waitFor(() => {
        expect(result.current.settings).toEqual(defaultSettings)
        expect(storage.remove).toHaveBeenCalledWith('secureguard_settings')
      })
    })

    it('should handle reset when storage throws error', async () => {
      storage.remove.mockImplementation(() => {
        throw new Error('Storage access denied')
      })

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.resetToDefaults()
      })

      await waitFor(() => {
        // Should still reset settings even if storage removal fails
        expect(result.current.settings).toEqual(defaultSettings)
      })
    })
  })

  describe('Storage Utility Functions', () => {
    it('should provide storage information', async () => {
      const mockUsageInfo = {
        available: true,
        error: null,
        usingFallback: false,
        totalKeys: 10,
        estimatedSize: 2048
      }

      storage.getUsageInfo.mockReturnValue(mockUsageInfo)

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      expect(result.current.getStorageInfo()).toEqual(mockUsageInfo)
      expect(result.current.isStorageAvailable()).toBe(true)
      expect(result.current.getStorageError()).toBe(null)
    })

    it('should clear storage cache', async () => {
      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.clearStorageCache()
      })

      expect(storage.clearOldEntries).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null/undefined settings gracefully', async () => {
      storage.get.mockReturnValue(null)

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      await waitFor(() => {
        expect(result.current.settings).toEqual(defaultSettings)
      })
    })

    it('should handle partial settings data', async () => {
      const partialSettings = {
        theme: 'dark'
        // Missing language and preferences
      }

      storage.get.mockReturnValue(partialSettings)
      validator.validateSchema.mockReturnValue({
        isValid: false,
        errors: ['Missing required fields']
      })

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      await waitFor(() => {
        // Should merge with defaults
        expect(result.current.settings.theme).toBe('system') // Falls back to default
        expect(result.current.settings.language).toBe('en')
        expect(result.current.settings.preferences).toEqual(defaultSettings.preferences)
      })
    })

    it('should handle storage quota exceeded during initialization', async () => {
      const quotaError = new Error('QuotaExceededError')
      quotaError.name = 'QuotaExceededError'
      
      storage.set.mockImplementation(() => {
        throw quotaError
      })

      const wrapper = ({ children }) => (
        <SettingsProvider>{children}</SettingsProvider>
      )

      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('light')
      })

      await waitFor(() => {
        expect(result.current.theme).toBe('light')
        // Should still work even if save fails
      })
    })
  })
})