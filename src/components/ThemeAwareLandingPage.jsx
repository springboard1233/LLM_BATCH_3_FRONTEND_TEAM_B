import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import LandingPage from './LandingPage';

const ThemeAwareLandingPage = ({ onGetStarted }) => {
  const { effectiveTheme } = useSettings();

  // Apply theme-specific styles to the document root when landing page is active
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Add theme-specific classes to body for landing page
    document.body.classList.add('landing-page-active');
    
    // Apply theme-specific CSS variables if needed
    if (effectiveTheme === 'light') {
      root.style.setProperty('--landing-bg', 'linear-gradient(to bottom right, #f8fafc, #e2e8f0, #f1f5f9)');
      root.style.setProperty('--landing-text', '#111827');
      root.style.setProperty('--landing-text-secondary', '#374151');
      root.style.setProperty('--landing-text-tertiary', '#6b7280');
      root.style.setProperty('--landing-glass', 'rgba(255, 255, 255, 0.8)');
      root.style.setProperty('--landing-border', 'rgba(0, 0, 0, 0.1)');
    } else {
      root.style.setProperty('--landing-bg', 'linear-gradient(to bottom right, #111827, #1e293b, #111827)');
      root.style.setProperty('--landing-text', '#ffffff');
      root.style.setProperty('--landing-text-secondary', '#d1d5db');
      root.style.setProperty('--landing-text-tertiary', '#9ca3af');
      root.style.setProperty('--landing-glass', 'rgba(17, 24, 39, 0.8)');
      root.style.setProperty('--landing-border', 'rgba(255, 255, 255, 0.1)');
    }

    return () => {
      document.body.classList.remove('landing-page-active');
    };
  }, [effectiveTheme]);

  return <LandingPage onGetStarted={onGetStarted} />;
};

export default ThemeAwareLandingPage;