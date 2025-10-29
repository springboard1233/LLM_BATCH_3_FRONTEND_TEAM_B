import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTranslation } from '../useTranslation'
import { SettingsProvider } from '../../contexts/SettingsContext'

// Mock the settings context
const mockUseSettings = vi.fn()
vi.mock('../../contexts/SettingsContext', async () => {
  const actual = await vi.importActual('../../contexts/SettingsContext')
  return {
    ...actual,
    useSettings: () => mockUseSettings()
  }
})

const wrapper = ({ children }) => (
  <SettingsProvider>{children}</SettingsProvider>
)

describe('useTranslation', () => {
  beforeEach(() => {
    mockUseSettings.mockReturnValue({
      language: 'en'
    })
  })

  it('returns translation function and current language', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    expect(result.current.t).toBeInstanceOf(Function)
    expect(result.current.language).toBe('en')
    expect(result.current.hasTranslation).toBeInstanceOf(Function)
  })

  it('translates keys correctly for English', () => {
    mockUseSettings.mockReturnValue({ language: 'en' })
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    expect(result.current.t('app.title')).toBe('SecureGuard AI Fraud Detection')
    expect(result.current.t('settings.title')).toBe('Settings')
    expect(result.current.t('navigation.dashboard')).toBe('Dashboard')
  })

  it('translates keys correctly for Spanish', () => {
    mockUseSettings.mockReturnValue({ language: 'es' })
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    expect(result.current.t('app.title')).toBe('SecureGuard AI Detección de Fraude')
    expect(result.current.t('settings.title')).toBe('Configuración')
    expect(result.current.t('navigation.dashboard')).toBe('Panel de Control')
  })

  it('falls back to English when translation key not found in current language', () => {
    mockUseSettings.mockReturnValue({ language: 'es' })
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    // Test with a key that might not exist in Spanish
    const translation = result.current.t('some.missing.key', 'fallback')
    expect(translation).toBe('fallback')
  })

  it('returns fallback when key does not exist in any language', () => {
    mockUseSettings.mockReturnValue({ language: 'en' })
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    expect(result.current.t('nonexistent.key', 'default')).toBe('default')
    expect(result.current.t('nonexistent.key')).toBe('nonexistent.key')
  })

  it('handles nested translation keys', () => {
    mockUseSettings.mockReturnValue({ language: 'en' })
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    expect(result.current.t('settings.preferences.notifications')).toBe('Notifications')
    expect(result.current.t('navigation.fraudDetection')).toBe('Fraud Detection')
  })

  it('checks if translation key exists', () => {
    mockUseSettings.mockReturnValue({ language: 'en' })
    const { result } = renderHook(() => useTranslation(), { wrapper })
    
    expect(result.current.hasTranslation('app.title')).toBe(true)
    expect(result.current.hasTranslation('nonexistent.key')).toBe(false)
  })

  it('handles language switching', () => {
    const { result, rerender } = renderHook(() => useTranslation(), { wrapper })
    
    // Start with English
    mockUseSettings.mockReturnValue({ language: 'en' })
    rerender()
    expect(result.current.t('app.connected')).toBe('Connected')
    
    // Switch to Spanish
    mockUseSettings.mockReturnValue({ language: 'es' })
    rerender()
    expect(result.current.t('app.connected')).toBe('Conectado')
  })
})