import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SettingsProvider, useSettings } from '../SettingsContext'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

const wrapper = ({ children }) => (
  <SettingsProvider>{children}</SettingsProvider>
)

describe('SettingsContext - Language Functionality', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  it('initializes with default language', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useSettings(), { wrapper })
    
    expect(result.current.language).toBe('en')
  })

  it('updates language correctly', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useSettings(), { wrapper })
    
    act(() => {
      result.current.updateLanguage('es')
    })
    
    expect(result.current.language).toBe('es')
  })

  it('provides supported languages list', () => {
    const { result } = renderHook(() => useSettings(), { wrapper })
    
    expect(result.current.supportedLanguages).toEqual([
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' }
    ])
  })

  it('supports switching between languages', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useSettings(), { wrapper })
    
    // Test English
    act(() => {
      result.current.updateLanguage('en')
    })
    expect(result.current.language).toBe('en')
    
    // Test Spanish
    act(() => {
      result.current.updateLanguage('es')
    })
    expect(result.current.language).toBe('es')
  })

  it('resets language to default when resetting all settings', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useSettings(), { wrapper })
    
    // Change language first
    act(() => {
      result.current.updateLanguage('es')
    })
    expect(result.current.language).toBe('es')
    
    // Reset all settings
    act(() => {
      result.current.resetToDefaults()
    })
    
    expect(result.current.language).toBe('en')
  })
})