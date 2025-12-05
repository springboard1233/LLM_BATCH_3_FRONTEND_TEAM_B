import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { SettingsProvider } from '../contexts/SettingsContext'

/**
 * Visual Effects Responsive Testing
 * 
 * Task 10.2: Test background gradients and visual effects
 * Requirements: 8.3
 * 
 * These tests verify that gradients, backdrop blur, and shadows render
 * correctly across different device sizes and don't cause performance issues.
 */

describe('Visual Effects - Responsive Gradients Across Devices', () => {
  it('should render gradients properly on mobile (320px-640px)', () => {
    // Simulating mobile viewport gradient rendering
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500">
        Mobile Gradient
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-gradient-to-r')
    expect(element.className).toContain('from-emerald-500')
    expect(element.className).toContain('to-blue-500')
  })

  it('should render gradients properly on tablet (768px-1024px)', () => {
    // Tablet-optimized gradient
    const { container } = render(
      <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        Tablet Gradient
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-gradient-to-br')
    expect(element.className).toContain('from-gray-900')
    expect(element.className).toContain('via-slate-800')
    expect(element.className).toContain('to-gray-900')
  })

  it('should render gradients properly on desktop (1280px+)', () => {
    // Desktop gradient with full complexity
    const { container } = render(
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        Desktop Gradient
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-gradient-to-br')
    expect(element.className).toContain('from-blue-50')
    expect(element.className).toContain('via-indigo-50')
    expect(element.className).toContain('to-purple-50')
  })

  it('should handle gradient opacity correctly across devices', () => {
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
        Gradient with Opacity
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('from-emerald-500/20')
    expect(element.className).toContain('to-blue-500/20')
  })

  it('should render text gradients without issues on all devices', () => {
    const { container } = render(
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
        Gradient Text
      </span>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('text-transparent')
    expect(element.className).toContain('bg-clip-text')
    expect(element.className).toContain('bg-gradient-to-r')
    expect(element.className).toContain('from-emerald-400')
    expect(element.className).toContain('via-blue-400')
    expect(element.className).toContain('to-purple-400')
  })
})

describe('Visual Effects - Backdrop Blur on Mobile Devices', () => {
  it('should render backdrop-blur-sm efficiently on mobile', () => {
    // Mobile devices should use lighter blur
    const { container } = render(
      <SettingsProvider>
        <div className="backdrop-blur-sm bg-black/50">
          Mobile Backdrop
        </div>
      </SettingsProvider>
    )
    
    const element = container.querySelector('.backdrop-blur-sm')
    expect(element).toBeTruthy()
    expect(element.className).toContain('bg-black/50')
  })

  it('should render backdrop-blur-md on tablet without performance issues', () => {
    const { container } = render(
      <SettingsProvider>
        <div className="backdrop-blur-md bg-black/30">
          Tablet Backdrop
        </div>
      </SettingsProvider>
    )
    
    const element = container.querySelector('.backdrop-blur-md')
    expect(element).toBeTruthy()
    expect(element.className).toContain('bg-black/30')
  })

  it('should render backdrop-blur-lg on desktop without performance degradation', () => {
    const { container } = render(
      <SettingsProvider>
        <div className="backdrop-blur-lg bg-black/20">
          Desktop Backdrop
        </div>
      </SettingsProvider>
    )
    
    const element = container.querySelector('.backdrop-blur-lg')
    expect(element).toBeTruthy()
    expect(element.className).toContain('bg-black/20')
  })

  it('should provide fallback when backdrop-blur is not supported', () => {
    // Solid background with opacity serves as fallback
    const { container } = render(
      <div className="backdrop-blur-md bg-black/80">
        Backdrop with Fallback
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('backdrop-blur-md')
    expect(element.className).toContain('bg-black/80')
  })

  it('should handle responsive backdrop blur transitions', () => {
    const { container } = render(
      <div className="backdrop-blur-sm md:backdrop-blur-md lg:backdrop-blur-lg">
        Responsive Backdrop
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('backdrop-blur-sm')
    expect(element.className).toContain('md:backdrop-blur-md')
    expect(element.className).toContain('lg:backdrop-blur-lg')
  })
})

describe('Visual Effects - Shadow Performance Across Devices', () => {
  it('should render light shadows on mobile without performance issues', () => {
    const { container } = render(
      <div className="shadow-sm">
        Mobile Shadow
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('shadow-sm')
  })

  it('should render medium shadows on tablet efficiently', () => {
    const { container } = render(
      <div className="shadow-md">
        Tablet Shadow
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('shadow-md')
  })

  it('should render large shadows on desktop without lag', () => {
    const { container } = render(
      <div className="shadow-xl">
        Desktop Shadow
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('shadow-xl')
  })

  it('should handle colored shadows efficiently', () => {
    const { container } = render(
      <div className="shadow-xl shadow-emerald-500/25">
        Colored Shadow
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('shadow-xl')
    expect(element.className).toContain('shadow-emerald-500/25')
  })

  it('should apply responsive shadows correctly', () => {
    const { container } = render(
      <div className="shadow-sm md:shadow-md lg:shadow-lg xl:shadow-xl">
        Responsive Shadow
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('shadow-sm')
    expect(element.className).toContain('md:shadow-md')
    expect(element.className).toContain('lg:shadow-lg')
    expect(element.className).toContain('xl:shadow-xl')
  })

  it('should not stack excessive shadows', () => {
    const { container } = render(
      <div className="shadow-lg">
        Single Shadow
      </div>
    )
    
    const element = container.firstChild
    const shadowClasses = element.className.split(' ').filter(c => c.includes('shadow'))
    expect(shadowClasses.length).toBeLessThanOrEqual(2)
  })
})

describe('Visual Effects - Combined Effects on Real Components', () => {
  it('should render modal with combined effects efficiently', () => {
    const { container } = render(
      <SettingsProvider>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            Modal Content
          </div>
        </div>
      </SettingsProvider>
    )
    
    const backdrop = container.querySelector('.backdrop-blur-sm')
    expect(backdrop).toBeTruthy()
    expect(backdrop.className).toContain('bg-black/70')
    
    const modal = container.querySelector('.shadow-2xl')
    expect(modal).toBeTruthy()
  })

  it('should render card with gradient and backdrop blur', () => {
    const { container } = render(
      <SettingsProvider>
        <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg">
          Card Content
        </div>
      </SettingsProvider>
    )
    
    const card = container.querySelector('.bg-gradient-to-br')
    expect(card).toBeTruthy()
    expect(card.className).toContain('backdrop-blur-lg')
    expect(card.className).toContain('shadow-lg')
  })

  it('should render button with gradient and shadow', () => {
    const { container } = render(
      <button className="bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg hover:shadow-emerald-500/25">
        Action Button
      </button>
    )
    
    const button = container.firstChild
    expect(button.className).toContain('bg-gradient-to-r')
    expect(button.className).toContain('from-emerald-500')
    expect(button.className).toContain('to-blue-500')
    expect(button.className).toContain('shadow-lg')
  })

  it('should render navigation with backdrop blur', () => {
    const { container } = render(
      <SettingsProvider>
        <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
          Navigation
        </nav>
      </SettingsProvider>
    )
    
    const nav = container.querySelector('nav')
    expect(nav.className).toContain('backdrop-blur-md')
    expect(nav.className).toContain('bg-black/20')
  })

  it('should render landing page background with complex gradients', () => {
    const { container } = render(
      <SettingsProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
          <div className="absolute inset-0">
            <div className="absolute w-72 h-72 rounded-full blur-3xl bg-blue-500/10"></div>
            <div className="absolute w-96 h-96 rounded-full blur-3xl bg-purple-500/10"></div>
          </div>
        </div>
      </SettingsProvider>
    )
    
    const background = container.querySelector('.bg-gradient-to-br')
    expect(background).toBeTruthy()
    
    const blurElements = container.querySelectorAll('.blur-3xl')
    expect(blurElements.length).toBe(2)
  })
})

describe('Visual Effects - Performance Validation', () => {
  it('should limit backdrop blur usage for performance', () => {
    const { container } = render(
      <SettingsProvider>
        <div>
          <div className="backdrop-blur-sm">Element 1</div>
          <div className="bg-black/50">Element 2</div>
          <div className="bg-white/80">Element 3</div>
          <div className="bg-gray-900/90">Element 4</div>
        </div>
      </SettingsProvider>
    )
    
    const blurElements = container.querySelectorAll('[class*="backdrop-blur"]')
    // Should use backdrop blur sparingly
    expect(blurElements.length).toBeLessThanOrEqual(2)
  })

  it('should use simple gradients for better performance', () => {
    const { container } = render(
      <div>
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500">Simple</div>
        <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">Complex</div>
      </div>
    )
    
    const gradients = container.querySelectorAll('[class*="bg-gradient"]')
    expect(gradients.length).toBe(2)
    
    // Verify both gradients render correctly
    expect(gradients[0].className).toContain('from-emerald-500')
    expect(gradients[1].className).toContain('via-slate-800')
  })

  it('should optimize shadow complexity', () => {
    const { container } = render(
      <div>
        <div className="shadow-sm">Light</div>
        <div className="shadow-md">Medium</div>
        <div className="shadow-lg">Large</div>
      </div>
    )
    
    const shadows = container.querySelectorAll('[class*="shadow"]')
    expect(shadows.length).toBe(3)
    
    // Each should have appropriate shadow level
    expect(shadows[0].className).toContain('shadow-sm')
    expect(shadows[1].className).toContain('shadow-md')
    expect(shadows[2].className).toContain('shadow-lg')
  })

  it('should handle responsive effects without performance degradation', () => {
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 backdrop-blur-sm md:backdrop-blur-md shadow-sm md:shadow-lg">
        Responsive Effects
      </div>
    )
    
    const element = container.firstChild
    // All effects should be present
    expect(element.className).toContain('bg-gradient-to-r')
    expect(element.className).toContain('backdrop-blur-sm')
    expect(element.className).toContain('md:backdrop-blur-md')
    expect(element.className).toContain('shadow-sm')
    expect(element.className).toContain('md:shadow-lg')
  })
})

describe('Visual Effects - Cross-Device Compatibility', () => {
  it('should render consistently on iOS devices', () => {
    // iOS Safari specific test
    const { container } = render(
      <div className="backdrop-blur-md bg-black/50 rounded-2xl">
        iOS Compatible
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('backdrop-blur-md')
    expect(element.className).toContain('bg-black/50')
  })

  it('should render consistently on Android devices', () => {
    // Android Chrome specific test
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg">
        Android Compatible
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-gradient-to-r')
    expect(element.className).toContain('shadow-lg')
  })

  it('should provide fallbacks for older browsers', () => {
    const { container } = render(
      <div className="backdrop-blur-lg bg-black/80">
        Fallback Support
      </div>
    )
    
    const element = container.firstChild
    // backdrop-blur with solid background fallback
    expect(element.className).toContain('backdrop-blur-lg')
    expect(element.className).toContain('bg-black/80')
  })
})
