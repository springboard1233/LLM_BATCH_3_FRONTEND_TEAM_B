import { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const ThemeDebug = () => {
  const { theme, effectiveTheme } = useSettings();
  const [htmlTheme, setHtmlTheme] = useState('');

  useEffect(() => {
    const checkTheme = () => {
      const dataTheme = document.documentElement.getAttribute('data-theme');
      setHtmlTheme(dataTheme || 'not set');
    };

    checkTheme();
    const interval = setInterval(checkTheme, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div>Theme Setting: {theme}</div>
      <div>Effective Theme: {effectiveTheme}</div>
      <div>HTML data-theme: {htmlTheme}</div>
    </div>
  );
};

export default ThemeDebug;
