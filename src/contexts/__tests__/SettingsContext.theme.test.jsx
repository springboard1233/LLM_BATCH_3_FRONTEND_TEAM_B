import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { SettingsProvider, useSettings } from '../SettingsContext'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Mock window.matchMedia
const mockMatchMedia = vi.fn()

// Mock custom event dispatch
const mockDispatchEvent = vi.fn()

describe('SettingsContext Theme Functionality', () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    // Mock window.matchMedia
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
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })

    // Mock document.documentElement methods
    vi.spyOn(document.documentElement, 'setAttribute')
    vi.spyOn(document.documentElement, 'removeAttribute')

    // Mock window.dispatchEvent
    Object.defineProperty(window, 'dispatchEvent', {
      value: mockDispatchEvent,
      writable: true,
    })

    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Theme State Management', () => {
    it('should initialize with system theme by default', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      expect(result.current.theme).toBe('system')
    })

    it('should update theme when updateTheme is called', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('light')
      })

      expect(result.current.theme).toBe('light')
    })

    it('should update theme to dark', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('dark')
      })

      expect(result.current.theme).toBe('dark')
    })

    it('should return to system theme', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('light')
      })

      act(() => {
        result.current.updateTheme('system')
      })

      expect(result.current.theme).toBe('system')
    })
  })

  describe('Theme Application to DOM', () => {
    it('should apply light theme to document element', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('light')
      })

      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme')
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light')
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme-source', 'manual')
    })

    it('should apply dark theme to document element', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('dark')
      })

      expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme')
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme-source', 'manual')
    })

    it('should apply system theme based on OS preference (light)', () => {
      // Mock system preference as light
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('system')
      })

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light')
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme-source', 'system')
    })

    it('should apply system theme based on OS preference (dark)', () => {
      // Mock system preference as dark
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

      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('system')
      })

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme-source', 'system')
    })

    it('should dispatch custom theme change event', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('light')
      })

      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'themeChanged',
          detail: {
            theme: 'light',
            source: 'manual'
          }
        })
      )
    })
  })

  describe('System Theme Detection', () => {
    it('should listen for system theme changes when using system theme', () => {
      const mockAddEventListener = vi.fn()
      const mockRemoveEventListener = vi.fn()
      
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: vi.fn(),
      }))

      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result, unmount } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('system')
      })

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

      // Cleanup should remove listener
      unmount()
      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('should use fallback addListener for older browsers', () => {
      const mockAddListener = vi.fn()
      const mockRemoveListener = vi.fn()
      
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: mockAddListener,
        removeListener: mockRemoveListener,
        addEventListener: undefined, // Simulate older browser
        removeEventListener: undefined,
        dispatchEvent: vi.fn(),
      }))

      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result, unmount } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('system')
      })

      expect(mockAddListener).toHaveBeenCalledWith(expect.any(Function))

      // Cleanup should remove listener
      unmount()
      expect(mockRemoveListener).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should get effective theme correctly', () => {
      // Mock system preference as dark
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

      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      // System theme should resolve to dark
      expect(result.current.effectiveTheme).toBe('dark')

      // Switch to light theme
      act(() => {
        result.current.updateTheme('light')
      })

      expect(result.current.effectiveTheme).toBe('light')
    })
  })

  describe('Theme Persistence', () => {
    it('should save theme to localStorage when changed', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      act(() => {
        result.current.updateTheme('light')
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'secureguard_settings',
        expect.stringContaining('"theme":"light"')
      )
    })

    it('should load theme from localStorage on initialization', () => {
      const storedSettings = {
        theme: 'dark',
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

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedSettings))

      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      expect(result.current.theme).toBe('dark')
    })

    it('should handle corrupted localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json')

      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      // Should fall back to default theme
      expect(result.current.theme).toBe('system')
    })

    it('should validate theme values from localStorage', () => {
      const invalidSettings = {
        theme: 'invalid-theme',
        language: 'en',
        preferences: {}
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(invalidSettings))

      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      // Should fall back to default theme
      expect(result.current.theme).toBe('system')
    })
  })

  describe('Theme Reset Functionality', () => {
    it('should reset theme to default when resetToDefaults is called', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      // Change theme first
      act(() => {
        result.current.updateTheme('light')
      })

      expect(result.current.theme).toBe('light')

      // Reset to defaults
      act(() => {
        result.current.resetToDefaults()
      })

      expect(result.current.theme).toBe('system')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('secureguard_settings')
    })
  })

  describe('Theme Options and Utilities', () => {
    it('should provide theme options', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      expect(result.current.themeOptions).toEqual([
        { value: 'light', label: 'Light Mode', icon: 'Sun' },
        { value: 'dark', label: 'Dark Mode', icon: 'Moon' },
        { value: 'system', label: 'System Default', icon: 'Monitor' }
      ])
    })

    it('should provide getEffectiveTheme utility function', () => {
      const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>
      const { result } = renderHook(() => useSettings(), { wrapper })

      expect(typeof result.current.getEffectiveTheme).toBe('function')
      
      // Should return resolved theme
      const effectiveTheme = result.current.getEffectiveTheme()
      expect(['light', 'dark']).toContain(effectiveTheme)
    })
  })
})