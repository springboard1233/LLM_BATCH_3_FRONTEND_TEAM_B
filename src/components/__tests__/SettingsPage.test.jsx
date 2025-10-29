import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsPage from '../SettingsPage'
import { SettingsProvider } from '../../contexts/SettingsContext'

// Mock the translation hook
vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key) => key, // Return the key as the translation for testing
    language: 'en'
  })
}))

// Test wrapper component
const TestWrapper = ({ children }) => (
  <SettingsProvider>
    {children}
  </SettingsProvider>
)

describe('SettingsPage', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
    
    // Mock window.matchMedia for system theme detection
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('should render the settings page with all sections', () => {
    render(
      <TestWrapper>
        <SettingsPage />
      </TestWrapper>
    )

    // Check main title
    expect(screen.getByText('settings.title')).toBeInTheDocument()

    // Check section headers
    expect(screen.getByText('Appearance')).toBeInTheDocument()
    expect(screen.getByText('Language & Localization')).toBeInTheDocument()
    expect(screen.getByText('Notifications & Alerts')).toBeInTheDocument()
    expect(screen.getByText('Data & Performance')).toBeInTheDocument()
    expect(screen.getByText('Security & Privacy')).toBeInTheDocument()
    expect(screen.getByText('Account Information')).toBeInTheDocument()
  })

  it('should render theme selection buttons', () => {
    render(
      <TestWrapper>
        <SettingsPage />
      </TestWrapper>
    )

    expect(screen.getByText('Light Mode')).toBeInTheDocument()
    expect(screen.getByText('Dark Mode')).toBeInTheDocument()
    expect(screen.getByText('System Default')).toBeInTheDocument()
  })

  it('should render language selection dropdown', () => {
    render(
      <TestWrapper>
        <SettingsPage />
      </TestWrapper>
    )

    const languageSelect = screen.getByLabelText('Select language')
    expect(languageSelect).toBeInTheDocument()
    expect(languageSelect).toHaveValue('en')
  })

  it('should render all toggle switches', () => {
    render(
      <TestWrapper>
        <SettingsPage />
      </TestWrapper>
    )

    // Check for various toggle switches
    expect(screen.getByLabelText('Toggle compact mode')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle notifications')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle fraud alerts')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle auto refresh')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle real-time updates')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle auto logout')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle enhanced encryption')).toBeInTheDocument()
  })

  it('should show refresh interval slider when auto refresh is enabled', () => {
    render(
      <TestWrapper>
        <SettingsPage />
      </TestWrapper>
    )

    // Auto refresh should be enabled by default, so slider should be visible
    expect(screen.getByLabelText('Refresh interval in seconds')).toBeInTheDocument()
    expect(screen.getByText(/Refresh Interval:/)).toBeInTheDocument()
  })

  it('should render account information fields', () => {
    render(
      <TestWrapper>
        <SettingsPage />
      </TestWrapper>
    )

    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Last Login')).toBeInTheDocument()
    expect(screen.getByText('Session Status')).toBeInTheDocument()
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('System Administrator')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('should render reset settings button', () => {
    render(
      <TestWrapper>
        <SettingsPage />
      </TestWrapper>
    )

    const resetButton = screen.getByText('Reset to Defaults')
    expect(resetButton).toBeInTheDocument()
  })

  it('should show reset confirmation modal when reset button is clicked', async () => {
    render(
      <TestWrapper>
        <SettingsPage />
      </TestWrapper>
    )

    const resetButton = screen.getByText('Reset to Defaults')
    await user.click(resetButton)

    expect(screen.getAllByText('Reset Settings')).toHaveLength(2) // One in section, one in modal
    expect(screen.getByText(/Are you sure you want to reset/)).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Reset')).toBeInTheDocument()
  })

  it('should allow theme selection', async () => {
    render(
      <TestWrapper>
        <SettingsPage />
      </TestWrapper>
    )

    const lightModeButton = screen.getByText('Light Mode').closest('button')
    await user.click(lightModeButton)

    // The button should be pressed after clicking (light mode is now selected)
    expect(lightModeButton).toHaveAttribute('aria-pressed', 'true')
  })
})