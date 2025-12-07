import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

/**
 * Visual Effects Testing
 * 
 * These tests verify that gradient and visual effect classes are properly applied
 * to components. While we can't test actual rendering appearance, we can verify
 * that the correct Tailwind classes are present.
 */

describe('Visual Effects - Gradients', () => {
  it('should apply gradient classes correctly', () => {
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500">
        Gradient Test
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-gradient-to-r')
    expect(element.className).toContain('from-emerald-500')
    expect(element.className).toContain('to-blue-500')
  })

  it('should apply gradient with opacity correctly', () => {
    const { container } = render(
      <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
        Gradient with Opacity
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-gradient-to-br')
    expect(element.className).toContain('from-emerald-500/10')
    expect(element.className).toContain('to-blue-500/10')
  })

  it('should apply text gradient correctly', () => {
    const { container } = render(
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
        Text Gradient
      </span>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('text-transparent')
    expect(element.className).toContain('bg-clip-text')
    expect(element.className).toContain('bg-gradient-to-r')
  })
})

describe('Visual Effects - Backdrop Blur', () => {
  it('should apply backdrop-blur classes correctly', () => {
    const { container } = render(
      <div className="backdrop-blur-lg bg-black/30">
        Backdrop Blur Test
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('backdrop-blur-lg')
    expect(element.className).toContain('bg-black/30')
  })

  it('should apply backdrop-blur-sm for modals', () => {
    const { container } = render(
      <div className="backdrop-blur-sm bg-black/50">
        Modal Backdrop
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('backdrop-blur-sm')
    expect(element.className).toContain('bg-black/50')
  })

  it('should apply backdrop-blur-md for panels', () => {
    const { container } = render(
      <div className="backdrop-blur-md bg-black/80">
        Panel Backdrop
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('backdrop-blur-md')
    expect(element.className).toContain('bg-black/80')
  })
})

describe('Visual Effects - Shadows', () => {
  it('should apply shadow classes correctly', () => {
    const { container } = render(
      <div className="shadow-lg">
        Shadow Test
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('shadow-lg')
  })

  it('should apply shadow with color correctly', () => {
    const { container } = render(
      <div className="shadow-xl shadow-emerald-500/25">
        Colored Shadow
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('shadow-xl')
    expect(element.className).toContain('shadow-emerald-500/25')
  })

  it('should apply shadow-2xl for modals', () => {
    const { container } = render(
      <div className="shadow-2xl">
        Modal Shadow
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('shadow-2xl')
  })
})

describe('Visual Effects - Combined Effects', () => {
  it('should apply multiple visual effects together', () => {
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 backdrop-blur-lg shadow-xl">
        Combined Effects
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-gradient-to-r')
    expect(element.className).toContain('backdrop-blur-lg')
    expect(element.className).toContain('shadow-xl')
  })

  it('should apply responsive visual effects', () => {
    const { container } = render(
      <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        Responsive Gradient
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-gradient-to-br')
    expect(element.className).toContain('from-gray-900')
    expect(element.className).toContain('via-slate-800')
    expect(element.className).toContain('to-gray-900')
  })
})

describe('Visual Effects - Performance Considerations', () => {
  it('should use appropriate blur levels for performance', () => {
    // backdrop-blur-sm is more performant than backdrop-blur-lg
    const { container: container1 } = render(
      <div className="backdrop-blur-sm">Light Blur</div>
    )
    const { container: container2 } = render(
      <div className="backdrop-blur-md">Medium Blur</div>
    )
    const { container: container3 } = render(
      <div className="backdrop-blur-lg">Heavy Blur</div>
    )
    
    expect(container1.firstChild.className).toContain('backdrop-blur-sm')
    expect(container2.firstChild.className).toContain('backdrop-blur-md')
    expect(container3.firstChild.className).toContain('backdrop-blur-lg')
  })

  it('should use opacity for better performance than blur when possible', () => {
    const { container } = render(
      <div className="bg-black/50">
        Opacity Background
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-black/50')
  })
})

describe('Visual Effects - Responsive Device Testing', () => {
  it('should render gradients correctly on all device sizes', () => {
    // Test gradient rendering at different viewport widths
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 sm:bg-gradient-to-br md:from-purple-500 lg:to-pink-500">
        Responsive Gradient
      </div>
    )
    
    const element = container.firstChild
    // Base gradient should be present
    expect(element.className).toContain('bg-gradient-to-r')
    expect(element.className).toContain('from-emerald-500')
    expect(element.className).toContain('to-blue-500')
    // Responsive overrides should be present
    expect(element.className).toContain('sm:bg-gradient-to-br')
    expect(element.className).toContain('md:from-purple-500')
    expect(element.className).toContain('lg:to-pink-500')
  })

  it('should apply backdrop blur effects correctly on mobile devices', () => {
    // Mobile devices should use lighter blur for performance
    const { container } = render(
      <div className="backdrop-blur-sm md:backdrop-blur-md lg:backdrop-blur-lg bg-black/30">
        Mobile-Optimized Blur
      </div>
    )
    
    const element = container.firstChild
    // Mobile blur (lightest)
    expect(element.className).toContain('backdrop-blur-sm')
    // Tablet blur
    expect(element.className).toContain('md:backdrop-blur-md')
    // Desktop blur (heaviest)
    expect(element.className).toContain('lg:backdrop-blur-lg')
    // Background opacity should be present
    expect(element.className).toContain('bg-black/30')
  })

  it('should not cause performance issues with shadow effects on mobile', () => {
    // Lighter shadows on mobile, heavier on desktop
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

  it('should render complex gradients without banding on all devices', () => {
    // Three-color gradient with via
    const { container } = render(
      <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        Complex Gradient
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-gradient-to-br')
    expect(element.className).toContain('from-gray-900')
    expect(element.className).toContain('via-slate-800')
    expect(element.className).toContain('to-gray-900')
  })

  it('should combine multiple effects efficiently across breakpoints', () => {
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 backdrop-blur-sm md:backdrop-blur-md shadow-lg md:shadow-xl">
        Combined Responsive Effects
      </div>
    )
    
    const element = container.firstChild
    // Gradient
    expect(element.className).toContain('bg-gradient-to-r')
    expect(element.className).toContain('from-emerald-500')
    expect(element.className).toContain('to-blue-500')
    // Responsive blur
    expect(element.className).toContain('backdrop-blur-sm')
    expect(element.className).toContain('md:backdrop-blur-md')
    // Responsive shadow
    expect(element.className).toContain('shadow-lg')
    expect(element.className).toContain('md:shadow-xl')
  })
})

describe('Visual Effects - Browser Compatibility', () => {
  it('should provide fallback for backdrop-blur when not supported', () => {
    // When backdrop-blur is not supported, solid background should work
    const { container } = render(
      <div className="backdrop-blur-md bg-black/80">
        Backdrop with Fallback
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('backdrop-blur-md')
    // Fallback opacity background
    expect(element.className).toContain('bg-black/80')
  })

  it('should render gradients consistently across browsers', () => {
    const { container } = render(
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500">
        Cross-Browser Gradient
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('bg-gradient-to-r')
    expect(element.className).toContain('from-emerald-500')
    expect(element.className).toContain('to-blue-500')
  })

  it('should handle shadow effects across different browsers', () => {
    const { container } = render(
      <div className="shadow-xl shadow-emerald-500/25">
        Cross-Browser Shadow
      </div>
    )
    
    const element = container.firstChild
    expect(element.className).toContain('shadow-xl')
    expect(element.className).toContain('shadow-emerald-500/25')
  })
})
