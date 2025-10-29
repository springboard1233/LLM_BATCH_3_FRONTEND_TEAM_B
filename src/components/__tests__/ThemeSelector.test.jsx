import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeSelector from '../ThemeSelector'
import { SettingsProvider } from '../../contexts/SettingsContext'

// Mock window.matchMedia for system theme detection
const mockMatchMedia = vi.fn()

// Test wrapper component
const TestWrapper = ({ children }) => (
  <SettingsProvider>
    {children}
  </SettingsProvider>
)

describe('ThemeSelector Component', () => {
  let user

  beforeEach(() => {
    user = userEvent.setup()
    
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

    // Mock document.documentElement.setAttribute
    vi.spyOn(document.documentElement, 'setAttribute')
    vi.spyOn(document.documentElement, 'removeAttribute')
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('Theme Selection Interface', () => {
    it('should render all theme options', () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      expect(screen.getByText('Theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Select Light Mode theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Select Dark Mode theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Select System Default theme')).toBeInTheDocument()
    })

    it('should show visual preview cards for each theme', () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const themeButtons = screen.getAllByRole('button')
      expect(themeButtons).toHaveLength(3)

      // Each button should have preview content
      themeButtons.forEach(button => {
        expect(button.querySelector('.h-16')).toBeInTheDocument() // Preview card
      })
    })

    it('should display theme icons correctly', () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      // Check for theme labels
      expect(screen.getByText('Light Mode')).toBeInTheDocument()
      expect(screen.getByText('Dark Mode')).toBeInTheDocument()
      expect(screen.getByText('System Default')).toBeInTheDocument()
    })
  })

  describe('Theme Switching Functionality', () => {
    it('should switch to light theme when light theme button is clicked', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const lightThemeButton = screen.getByLabelText('Select Light Mode theme')
      await user.click(lightThemeButton)

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light')
      })
    })

    it('should switch to dark theme when dark theme button is clicked', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const darkThemeButton = screen.getByLabelText('Select Dark Mode theme')
      await user.click(darkThemeButton)

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
      })
    })

    it('should switch to system theme when system theme button is clicked', async () => {
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

      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const systemThemeButton = screen.getByLabelText('Select System Default theme')
      await user.click(systemThemeButton)

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light')
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme-source', 'system')
      })
    })

    it('should apply dark theme when system preference is dark', async () => {
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

      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const systemThemeButton = screen.getByLabelText('Select System Default theme')
      await user.click(systemThemeButton)

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
      })
    })
  })

  describe('Visual Selection Indicators', () => {
    it('should show selection indicator for currently selected theme', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      // Default theme should be system, so system button should be selected
      const systemButton = screen.getByLabelText('Select System Default theme')
      expect(systemButton).toHaveAttribute('aria-pressed', 'true')

      // Switch to light theme
      const lightButton = screen.getByLabelText('Select Light Mode theme')
      await user.click(lightButton)

      await waitFor(() => {
        expect(lightButton).toHaveAttribute('aria-pressed', 'true')
        expect(systemButton).toHaveAttribute('aria-pressed', 'false')
      })
    })

    it('should show check icon for selected theme', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      // Find the currently selected theme button (could be any theme based on initial state)
      const selectedButton = screen.getByRole('button', { pressed: true })
      expect(selectedButton.querySelector('.absolute.top-2.right-2')).toBeInTheDocument()

      // Switch to dark theme
      const darkButton = screen.getByLabelText('Select Dark Mode theme')
      await user.click(darkButton)

      await waitFor(() => {
        expect(darkButton.querySelector('.absolute.top-2.right-2')).toBeInTheDocument()
        // Previous selection should no longer have check icon
        if (selectedButton !== darkButton) {
          expect(selectedButton.querySelector('.absolute.top-2.right-2')).not.toBeInTheDocument()
        }
      })
    })

    it('should apply correct styling for selected theme', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const lightButton = screen.getByLabelText('Select Light Mode theme')
      const darkButton = screen.getByLabelText('Select Dark Mode theme')

      // Click light theme to ensure it's selected
      await user.click(lightButton)

      await waitFor(() => {
        expect(lightButton).toHaveClass('border-blue-500', 'bg-blue-500/20', 'ring-2', 'ring-blue-500/30')
        expect(darkButton).not.toHaveClass('border-blue-500')
      })
    })
  })

  describe('Theme Descriptions', () => {
    it('should show appropriate description for system theme', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      // Click system theme to ensure it's selected
      const systemButton = screen.getByLabelText('Select System Default theme')
      await user.click(systemButton)

      await waitFor(() => {
        expect(screen.getByText("Automatically matches your system's appearance preference")).toBeInTheDocument()
      })
    })

    it('should show appropriate description for light theme', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const lightButton = screen.getByLabelText('Select Light Mode theme')
      await user.click(lightButton)

      await waitFor(() => {
        expect(screen.getByText('Light theme with bright backgrounds and dark text')).toBeInTheDocument()
      })
    })

    it('should show appropriate description for dark theme', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const darkButton = screen.getByLabelText('Select Dark Mode theme')
      await user.click(darkButton)

      await waitFor(() => {
        expect(screen.getByText('Dark theme with dark backgrounds and light text')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for theme buttons', () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Select Light Mode theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Select Dark Mode theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Select System Default theme')).toBeInTheDocument()
    })

    it('should have proper aria-pressed states', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const lightButton = screen.getByLabelText('Select Light Mode theme')
      const darkButton = screen.getByLabelText('Select Dark Mode theme')
      const systemButton = screen.getByLabelText('Select System Default theme')

      // Click light theme to ensure it's selected
      await user.click(lightButton)

      await waitFor(() => {
        expect(lightButton).toHaveAttribute('aria-pressed', 'true')
        expect(systemButton).toHaveAttribute('aria-pressed', 'false')
        expect(darkButton).toHaveAttribute('aria-pressed', 'false')
      })

      // Click dark theme
      await user.click(darkButton)

      await waitFor(() => {
        expect(darkButton).toHaveAttribute('aria-pressed', 'true')
        expect(lightButton).toHaveAttribute('aria-pressed', 'false')
        expect(systemButton).toHaveAttribute('aria-pressed', 'false')
      })
    })

    it('should be keyboard navigable', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const lightButton = screen.getByLabelText('Select Light Mode theme')
      const darkButton = screen.getByLabelText('Select Dark Mode theme')

      // Focus first button
      lightButton.focus()
      expect(lightButton).toHaveFocus()

      // Tab to next button
      await user.tab()
      expect(darkButton).toHaveFocus()

      // Activate with Enter key
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
      })
    })

    it('should activate theme with Space key', async () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const lightButton = screen.getByLabelText('Select Light Mode theme')
      lightButton.focus()

      await user.keyboard(' ')

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light')
      })
    })
  })

  describe('Visual Preview Cards', () => {
    it('should render preview cards with correct styling', () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const themeButtons = screen.getAllByRole('button')
      
      themeButtons.forEach(button => {
        const previewCard = button.querySelector('.h-16')
        expect(previewCard).toBeInTheDocument()
        expect(previewCard).toHaveClass('rounded-md', 'border', 'border-white/10')
      })
    })

    it('should show different preview styles for each theme', () => {
      render(
        <TestWrapper>
          <ThemeSelector />
        </TestWrapper>
      )

      const lightButton = screen.getByLabelText('Select Light Mode theme')
      const darkButton = screen.getByLabelText('Select Dark Mode theme')
      const systemButton = screen.getByLabelText('Select System Default theme')

      // Light theme preview should have light background
      const lightPreview = lightButton.querySelector('.h-16')
      expect(lightPreview).toHaveStyle({ background: '#ffffff' })

      // Dark theme preview should have dark background
      const darkPreview = darkButton.querySelector('.h-16')
      expect(darkPreview).toHaveStyle({ background: '#111827' })

      // System theme preview should have gradient
      const systemPreview = systemButton.querySelector('.h-16')
      expect(systemPreview).toHaveStyle({ 
        background: 'linear-gradient(135deg, #ffffff 50%, #111827 50%)' 
      })
    })
  })
})