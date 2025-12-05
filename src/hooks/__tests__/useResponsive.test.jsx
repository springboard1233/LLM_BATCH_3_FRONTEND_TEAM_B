import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import useResponsive from '../useResponsive';

describe('useResponsive', () => {
  let originalInnerWidth;

  beforeEach(() => {
    // Store original window.innerWidth
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    // Restore original window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    });
    vi.clearAllTimers();
  });

  it('detects mobile viewport correctly', () => {
    // Set window width to mobile size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });

    const { result } = renderHook(() => useResponsive());

    expect(result.current.viewport).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('detects tablet viewport correctly', () => {
    // Set window width to tablet size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768
    });

    const { result } = renderHook(() => useResponsive());

    expect(result.current.viewport).toBe('md');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('detects desktop viewport correctly', () => {
    // Set window width to desktop size (lg breakpoint: 1024-1279)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1100
    });

    const { result } = renderHook(() => useResponsive());

    expect(result.current.viewport).toBe('lg');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('detects sm viewport correctly', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640
    });

    const { result } = renderHook(() => useResponsive());

    expect(result.current.viewport).toBe('sm');
    expect(result.current.isMobile).toBe(true); // sm is considered mobile
  });

  it('detects xl viewport correctly', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1536
    });

    const { result } = renderHook(() => useResponsive());

    expect(result.current.viewport).toBe('2xl');
    expect(result.current.isDesktop).toBe(true);
  });

  it('updates viewport on window resize with debouncing', async () => {
    vi.useFakeTimers();

    // Start with mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });

    const { result } = renderHook(() => useResponsive());
    expect(result.current.viewport).toBe('mobile');

    // Resize to desktop
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1100
      });
      window.dispatchEvent(new Event('resize'));
    });

    // Should not update immediately (debounced)
    expect(result.current.viewport).toBe('mobile');

    // Fast-forward time past debounce delay
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Now should be updated
    expect(result.current.viewport).toBe('lg');
    expect(result.current.isDesktop).toBe(true);

    vi.useRealTimers();
  });

  it('provides width property', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });

    const { result } = renderHook(() => useResponsive());

    expect(result.current.width).toBe(1024);
  });
});
