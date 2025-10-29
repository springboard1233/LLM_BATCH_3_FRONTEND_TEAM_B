import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LanguageSelector from '../LanguageSelector'
import { SettingsProvider } from '../../contexts/SettingsContext'

// Mock the translation hook
vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key) => key // Return the key as the translation for testing
  })
}))

const renderWithProvider = (component) => {
  return render(
    <SettingsProvider>
      {component}
    </SettingsProvider>
  )
}

describe('LanguageSelector', () => {
  it('renders language selector component', () => {
    renderWithProvider(<LanguageSelector />)
    
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('shows all supported languages in dropdown', () => {
    renderWithProvider(<LanguageSelector />)
    
    const englishOption = screen.getByText('English')
    const spanishOption = screen.getByText('Español')
    
    expect(englishOption).toBeInTheDocument()
    expect(spanishOption).toBeInTheDocument()
  })

  it('changes language when option is selected', () => {
    renderWithProvider(<LanguageSelector />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'es' } })
    
    expect(select.value).toBe('es')
  })

  it('displays current language selection', () => {
    renderWithProvider(<LanguageSelector />)
    
    // Check that a language is selected
    const select = screen.getByRole('combobox')
    expect(['en', 'es']).toContain(select.value)
  })

  it('has proper accessibility attributes', () => {
    renderWithProvider(<LanguageSelector />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('aria-label')
  })
})