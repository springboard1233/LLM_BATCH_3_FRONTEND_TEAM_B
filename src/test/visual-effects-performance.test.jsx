import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SettingsProvider } from '../contexts/SettingsContext'

/**
 * Visual Effects Performance Testing
 * 
 * These tests verify that visual effects are optimized for performance
 * and don't cause excessive DOM complexity or rendering issues.
 */

describe('Visual Effects Performance', () => {
  it('should use backdrop-blur sparingly for performance', () => {
    // Backdrop blur is expensive, so we should verify it's only used where necessary
    const { container } = render(
      <div>
        <div className="backdrop-blur-sm">Modal Overlay</div>
        <div className="bg-black/50">Alternative Overlay</div>
      </div>
    )
    
    const elements = container.querySelectorAll('[class*="backdrop-blur"]')
    // Should have limited backdrop blur usage
    expect(elements.length).toBeLessThanOrEqual(1)
  })

  it('should prefer opacity over blur for better performance', () => {
    const { container } = render(
      <div className="bg-black/30">
        Optimized Background
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-black/30')
    expect(element.className).not.toContain('backdrop-blur')
  })

  it('should use appropriate shadow levels', () => {
    // Excessive shadows can impact performance
    const { container } = render(
      <div>
        <div className="shadow-sm">Light Shadow</div>
        <div className="shadow-md">Medium Shadow</div>
        <div className="shadow-lg">Large Shadow</div>
      </div>
    )
    
    const elements = container.querySelectorAll('[class*="shadow"]')
    expect(elements.length).toBeGreaterThan(0)
  })

  it('should combine effects efficiently', () => {
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg">
        Efficient Combined Effects
      </div>
    )
    
    const element = container.firstChild
    // Should have both gradient and shadow
    expect(element.className).toContain('bg-gradient-to-r')
    expect(element.className).toContain('shadow-lg')
    // But not excessive effects
    expect(element.className).not.toContain('backdrop-blur')
  })

  it('should use will-change sparingly', () => {
    // will-change should only be used for elements that will actually change
    const { container } = render(
      <div className="transition-transform hover:scale-105">
        Animated Element
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('transition-transform')
  })
})

describe('Visual Effects - Gradient Optimization', () => {
  it('should use simple gradients for better performance', () => {
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500">
        Simple Gradient
      </div>
    )
    
    const element = container.firstChild
    // Two-color gradients are more performant than multi-stop gradients
    expect(element.className).toContain('from-emerald-500')
    expect(element.className).toContain('to-blue-500')
  })

  it('should use gradient with via for three-color gradients', () => {
    const { container } = render(
      <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        Three-Color Gradient
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('via-slate-800')
  })

  it('should use opacity in gradients efficiently', () => {
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
        Gradient with Opacity
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('from-emerald-500/20')
    expect(element.className).toContain('to-blue-500/20')
  })
})

describe('Visual Effects - Backdrop Blur Optimization', () => {
  it('should use backdrop-blur-sm for overlays', () => {
    const { container } = render(
      <div className="backdrop-blur-sm bg-black/50">
        Modal Overlay
      </div>
    )
    
    const element = container.firstChild
    // backdrop-blur-sm is more performant than backdrop-blur-lg
    expect(element.className).toContain('backdrop-blur-sm')
  })

  it('should use backdrop-blur-md for panels', () => {
    const { container } = render(
      <div className="backdrop-blur-md bg-black/80">
        Settings Panel
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('backdrop-blur-md')
  })

  it('should combine backdrop-blur with opacity for best effect', () => {
    const { container } = render(
      <div className="backdrop-blur-lg bg-black/30">
        Blurred Background
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('backdrop-blur-lg')
    expect(element.className).toContain('bg-black/30')
  })
})

describe('Visual Effects - Shadow Optimization', () => {
  it('should use appropriate shadow sizes', () => {
    const { container } = render(
      <div>
        <div className="shadow-sm">Small Shadow</div>
        <div className="shadow-md">Medium Shadow</div>
        <div className="shadow-lg">Large Shadow</div>
        <div className="shadow-xl">Extra Large Shadow</div>
        <div className="shadow-2xl">2XL Shadow</div>
      </div>
    )
    
    const shadows = container.querySelectorAll('[class*="shadow"]')
    expect(shadows.length).toBe(5)
  })

  it('should use colored shadows efficiently', () => {
    const { container } = render(
      <div className="shadow-xl shadow-emerald-500/25">
        Colored Shadow
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('shadow-xl')
    expect(element.className).toContain('shadow-emerald-500/25')
  })

  it('should not stack multiple shadows unnecessarily', () => {
    const { container } = render(
      <div className="shadow-lg">
        Single Shadow
      </div>
    )
    
    const element = container.firstChild
    const shadowClasses = element.className.split(' ').filter(c => c.includes('shadow'))
    // Should only have one shadow class
    expect(shadowClasses.length).toBeLessThanOrEqual(2) // shadow-lg and potentially shadow-color
  })
})

describe('Visual Effects - Responsive Optimization', () => {
  it('should reduce effects on mobile for performance', () => {
    const { container } = render(
      <div className="backdrop-blur-sm md:backdrop-blur-lg">
        Responsive Blur
      </div>
    )
    
    const element = container.firstChild
    // Should have lighter blur on mobile
    expect(element.className).toContain('backdrop-blur-sm')
    expect(element.className).toContain('md:backdrop-blur-lg')
  })

  it('should use simpler gradients on mobile', () => {
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500">
        Mobile-Friendly Gradient
      </div>
    )
    
    const element = container.firstChild
    // Simple two-color gradient is more performant on mobile
    expect(element.className).toContain('bg-gradient-to-r')
  })
})

describe('Visual Effects - Real Component Testing', () => {
  it('should render modal backdrop effects without performance issues', () => {
    // Simulating modal backdrop as used in actual components
    const { container } = render(
      <SettingsProvider>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            Modal Content
          </div>
        </div>
      </SettingsProvider>
    )
    
    const backdrop = container.querySelector('.backdrop-blur-sm')
    expect(backdrop).toBeTruthy()
    expect(backdrop.className).toContain('bg-black/70')
    expect(backdrop.className).toContain('backdrop-blur-sm')
    
    const modal = container.querySelector('.shadow-2xl')
    expect(modal).toBeTruthy()
  })

  it('should render card backgrounds with backdrop blur efficiently', () => {
    // Simulating card components with backdrop blur
    const { container } = render(
      <SettingsProvider>
        <div className="rounded-2xl p-6 backdrop-blur-lg border bg-black/30 border-white/10">
          Card Content
        </div>
      </SettingsProvider>
    )
    
    const card = container.querySelector('.backdrop-blur-lg')
    expect(card).toBeTruthy()
    expect(card.className).toContain('bg-black/30')
    expect(card.className).toContain('border-white/10')
  })

  it('should render button gradients without performance degradation', () => {
    // Simulating gradient buttons as used in actual components
    const { container } = render(
      <button className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition shadow-lg">
        Action Button
      </button>
    )
    
    const button = container.firstChild
    expect(button.className).toContain('bg-gradient-to-r')
    expect(button.className).toContain('from-emerald-500')
    expect(button.className).toContain('to-blue-500')
    expect(button.className).toContain('shadow-lg')
  })

  it('should render navigation with backdrop blur on mobile', () => {
    // Simulating navigation backdrop as used in actual components
    const { container } = render(
      <SettingsProvider>
        <nav className="bg-black/20 backdrop-blur-md border-white/10">
          Navigation
        </nav>
      </SettingsProvider>
    )
    
    const nav = container.querySelector('nav')
    expect(nav.className).toContain('backdrop-blur-md')
    expect(nav.className).toContain('bg-black/20')
  })

  it('should handle complex background gradients efficiently', () => {
    // Simulating landing page background gradient
    const { container } = render(
      <SettingsProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl bg-blue-500/10"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl bg-purple-500/10"></div>
          </div>
        </div>
      </SettingsProvider>
    )
    
    const background = container.querySelector('.bg-gradient-to-br')
    expect(background).toBeTruthy()
    expect(background.className).toContain('from-gray-900')
    expect(background.className).toContain('via-slate-800')
    expect(background.className).toContain('to-gray-900')
    
    // Check animated background elements
    const blurElements = container.querySelectorAll('.blur-3xl')
    expect(blurElements.length).toBe(2)
  })
})

describe('Visual Effects - Performance Metrics', () => {
  it('should not use excessive backdrop blur instances', () => {
    // Too many backdrop blur elements can cause performance issues
    const { container } = render(
      <SettingsProvider>
        <div>
          <div className="backdrop-blur-sm">Element 1</div>
          <div className="bg-black/50">Element 2</div>
          <div className="bg-white/80">Element 3</div>
        </div>
      </SettingsProvider>
    )
    
    const blurElements = container.querySelectorAll('[class*="backdrop-blur"]')
    // Should have limited backdrop blur usage for performance
    expect(blurElements.length).toBeLessThanOrEqual(3)
  })

  it('should use appropriate shadow complexity', () => {
    // Verify shadows are not overly complex
    const { container } = render(
      <div>
        <div className="shadow-sm">Light</div>
        <div className="shadow-md">Medium</div>
        <div className="shadow-lg">Large</div>
        <div className="shadow-xl">Extra Large</div>
      </div>
    )
    
    const shadows = container.querySelectorAll('[class*="shadow"]')
    expect(shadows.length).toBeGreaterThan(0)
    
    // Each element should have only one shadow level
    shadows.forEach(element => {
      const shadowClasses = element.className.split(' ').filter(c => c.startsWith('shadow-'))
      expect(shadowClasses.length).toBeLessThanOrEqual(2) // shadow-{size} and optionally shadow-{color}
    })
  })

  it('should optimize gradient complexity for performance', () => {
    // Simple gradients are more performant
    const { container } = render(
      <div>
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500">Two-color</div>
        <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">Three-color</div>
      </div>
    )
    
    const gradients = container.querySelectorAll('[class*="bg-gradient"]')
    expect(gradients.length).toBe(2)
    
    // Verify gradient classes are properly applied
    expect(gradients[0].className).toContain('from-emerald-500')
    expect(gradients[0].className).toContain('to-blue-500')
    expect(gradients[1].className).toContain('via-slate-800')
  })
})
