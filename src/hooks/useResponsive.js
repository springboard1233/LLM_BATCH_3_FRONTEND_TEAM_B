import { useState, useEffect } from 'react';

/**
 * Custom hook to detect viewport size and provide responsive utilities
 * Implements debounced resize handler for optimal performance
 * 
 * Breakpoints (Tailwind CSS defaults):
 * - mobile: < 640px
 * - sm: >= 640px
 * - md: >= 768px (tablet)
 * - lg: >= 1024px (desktop)
 * - xl: >= 1280px
 * - 2xl: >= 1536px
 */
const useResponsive = () => {
  const [viewport, setViewport] = useState(() => {
    // Initialize with current viewport on mount
    if (typeof window === 'undefined') return 'mobile';
    return getViewportSize(window.innerWidth);
  });

  useEffect(() => {
    // Debounce timer
    let timeoutId = null;

    const handleResize = () => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout to debounce resize events
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const newViewport = getViewportSize(width);
        setViewport(newViewport);
      }, 150); // 150ms debounce delay
    };

    // Set initial viewport
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    viewport,
    isMobile: viewport === 'mobile' || viewport === 'sm',
    isTablet: viewport === 'md',
    isDesktop: viewport === 'lg' || viewport === 'xl' || viewport === '2xl',
    width: typeof window !== 'undefined' ? window.innerWidth : 0
  };
};

/**
 * Helper function to determine viewport size based on width
 * @param {number} width - Window width in pixels
 * @returns {string} Viewport size identifier
 */
function getViewportSize(width) {
  if (width < 640) return 'mobile';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  if (width < 1536) return 'xl';
  return '2xl';
}

export default useResponsive;
