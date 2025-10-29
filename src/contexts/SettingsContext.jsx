import { createContext, useContext, useReducer, useEffect } from 'react'
import { storage, validator } from '../utils/storageUtils'

// Default settings configuration
const defaultSettings = {
  theme: 'system',
  language: 'en',
  preferences: {
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30000,
    compactMode: false,
    fraudAlerts: true,
    realTimeUpdates: true,
    autoLogout: false,
    enhancedEncryption: true
  }
}

// Supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' }
]

// Theme options
export const themeOptions = [
  { value: 'light', label: 'Light Mode', icon: 'Sun' },
  { value: 'dark', label: 'Dark Mode', icon: 'Moon' },
  { value: 'system', label: 'System Default', icon: 'Monitor' }
]

// Storage keys
const storageKeys = {
  SETTINGS: 'secureguard_settings',
  THEME: 'secureguard_theme',
  LANGUAGE: 'secureguard_language'
}

// Settings validation schema
const settingsSchema = {
  theme: {
    type: 'string',
    oneOf: ['light', 'dark', 'system'],
    required: true
  },
  language: {
    type: 'string',
    oneOf: ['en', 'es'],
    required: true
  },
  preferences: {
    type: 'object',
    required: true,
    properties: {
      notifications: { type: 'boolean', required: true },
      autoRefresh: { type: 'boolean', required: true },
      refreshInterval: { type: 'number', min: 5000, max: 300000, required: true },
      compactMode: { type: 'boolean', required: true },
      fraudAlerts: { type: 'boolean', required: true },
      realTimeUpdates: { type: 'boolean', required: true },
      autoLogout: { type: 'boolean', required: true },
      enhancedEncryption: { type: 'boolean', required: true }
    }
  }
}

// Settings reducer
const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'UPDATE_PREFERENCES':
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload } 
      }
    case 'RESET_SETTINGS':
      return { ...defaultSettings }
    case 'LOAD_SETTINGS':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// Enhanced settings validation with detailed error reporting
const validateSettings = (settings) => {
  // First check if we have any data at all
  if (!settings || typeof settings !== 'object') {
    console.info('No valid settings found, using defaults')
    return { settings: defaultSettings, errors: [], isValid: false }
  }

  // Use schema validation
  const validation = validator.validateSchema(settings, settingsSchema)
  
  if (validation.isValid) {
    console.info('Settings validation passed')
    return { settings, errors: [], isValid: true }
  }

  // If validation failed, create corrected settings
  console.warn('Settings validation failed:', validation.errors)
  
  const correctedSettings = { ...defaultSettings }
  
  // Apply valid values where possible
  if (validator.isOneOf(settings.theme, ['light', 'dark', 'system'])) {
    correctedSettings.theme = settings.theme
  }
  
  if (validator.isOneOf(settings.language, ['en', 'es'])) {
    correctedSettings.language = settings.language
  }
  
  if (validator.isPlainObject(settings.preferences)) {
    const prefs = settings.preferences
    
    if (validator.isBoolean(prefs.notifications)) {
      correctedSettings.preferences.notifications = prefs.notifications
    }
    if (validator.isBoolean(prefs.autoRefresh)) {
      correctedSettings.preferences.autoRefresh = prefs.autoRefresh
    }
    if (validator.isPositiveNumber(prefs.refreshInterval, 5000, 300000)) {
      correctedSettings.preferences.refreshInterval = prefs.refreshInterval
    }
    if (validator.isBoolean(prefs.compactMode)) {
      correctedSettings.preferences.compactMode = prefs.compactMode
    }
    if (validator.isBoolean(prefs.fraudAlerts)) {
      correctedSettings.preferences.fraudAlerts = prefs.fraudAlerts
    }
    if (validator.isBoolean(prefs.realTimeUpdates)) {
      correctedSettings.preferences.realTimeUpdates = prefs.realTimeUpdates
    }
    if (validator.isBoolean(prefs.autoLogout)) {
      correctedSettings.preferences.autoLogout = prefs.autoLogout
    }
    if (validator.isBoolean(prefs.enhancedEncryption)) {
      correctedSettings.preferences.enhancedEncryption = prefs.enhancedEncryption
    }
  }
  
  return { 
    settings: correctedSettings, 
    errors: validation.errors, 
    isValid: false 
  }
}

// Create context
const SettingsContext = createContext()

// Settings provider component
export const SettingsProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, defaultSettings)

  // Load settings from storage on mount with enhanced error handling
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Check storage availability
        if (!storage.isAvailable()) {
          console.warn('Storage not available, using defaults:', storage.getError()?.message)
          dispatch({ type: 'LOAD_SETTINGS', payload: defaultSettings })
          return
        }

        const storedSettings = storage.get(storageKeys.SETTINGS, null)
        const validation = validateSettings(storedSettings)
        
        if (!validation.isValid && validation.errors.length > 0) {
          console.warn('Settings validation errors found:', validation.errors)
          // Save corrected settings back to storage
          const saveSuccess = storage.set(storageKeys.SETTINGS, validation.settings)
          if (!saveSuccess) {
            console.warn('Failed to save corrected settings to storage')
          }
        }
        
        dispatch({ type: 'LOAD_SETTINGS', payload: validation.settings })
      } catch (error) {
        console.error('Failed to load settings:', error)
        dispatch({ type: 'LOAD_SETTINGS', payload: defaultSettings })
      }
    }

    loadSettings()
  }, [])

  // Save settings to storage whenever they change with error handling
  useEffect(() => {
    const saveSettings = async () => {
      try {
        // Validate settings before saving
        const validation = validateSettings(settings)
        if (!validation.isValid) {
          console.warn('Attempting to save invalid settings:', validation.errors)
          return
        }

        const saveSuccess = storage.set(storageKeys.SETTINGS, settings)
        if (!saveSuccess) {
          console.error('Failed to save settings to storage')
          
          // Try to get storage usage info for debugging
          const usageInfo = storage.getUsageInfo()
          console.info('Storage usage info:', usageInfo)
          
          // If storage is full, try to clear old entries
          if (usageInfo.available && usageInfo.estimatedSize > 4000000) { // ~4MB threshold
            console.info('Storage appears full, attempting to clear old entries')
            storage.clearOldEntries()
            
            // Retry save
            const retrySuccess = storage.set(storageKeys.SETTINGS, settings)
            if (!retrySuccess) {
              console.error('Failed to save settings even after clearing old entries')
            }
          }
        }
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    }

    // Don't save on initial load (when settings are default)
    if (settings !== defaultSettings) {
      saveSettings()
    }
  }, [settings])

  // Apply theme to document
  useEffect(() => {
    const applyTheme = (theme) => {
      const root = document.documentElement
      
      // Remove any existing theme attributes
      root.removeAttribute('data-theme')
      
      if (theme === 'system') {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
        
        // Add system theme indicator for CSS
        root.setAttribute('data-theme-source', 'system')
      } else {
        root.setAttribute('data-theme', theme)
        root.setAttribute('data-theme-source', 'manual')
      }
      
      // Dispatch custom event for theme change
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { 
          theme: theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme,
          source: theme === 'system' ? 'system' : 'manual'
        } 
      }))
    }

    applyTheme(settings.theme)

    // Listen for system theme changes when using system theme
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme('system')
      
      // Use both addEventListener and addListener for broader compatibility
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange)
      }
      
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange)
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handleChange)
        }
      }
    }
  }, [settings.theme])

  // Get effective theme (resolves 'system' to actual theme)
  const getEffectiveTheme = () => {
    if (settings.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return settings.theme
  }

  // Context value
  const value = {
    settings,
    theme: settings.theme,
    effectiveTheme: getEffectiveTheme(),
    language: settings.language,
    preferences: settings.preferences,
    
    updateTheme: (theme) => {
      dispatch({ type: 'SET_THEME', payload: theme })
    },
    
    updateLanguage: (language) => {
      dispatch({ type: 'SET_LANGUAGE', payload: language })
    },
    
    updatePreferences: (preferences) => {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences })
    },
    
    resetToDefaults: () => {
      try {
        dispatch({ type: 'RESET_SETTINGS' })
        // Clear storage with error handling
        const removeSuccess = storage.remove(storageKeys.SETTINGS)
        if (!removeSuccess) {
          console.warn('Failed to remove settings from storage during reset')
        }
        console.info('Settings reset to defaults')
      } catch (error) {
        console.error('Error resetting settings:', error)
        // Still dispatch the reset even if storage removal failed
        dispatch({ type: 'RESET_SETTINGS' })
      }
    },
    
    // Utility functions
    getEffectiveTheme,
    supportedLanguages,
    themeOptions,
    defaultSettings,
    
    // Storage utilities
    getStorageInfo: () => storage.getUsageInfo(),
    isStorageAvailable: () => storage.isAvailable(),
    getStorageError: () => storage.getError(),
    clearStorageCache: () => storage.clearOldEntries(),
    
    // Validation utilities
    validateCurrentSettings: () => validateSettings(settings),
    repairSettings: () => {
      const validation = validateSettings(settings)
      if (!validation.isValid) {
        dispatch({ type: 'LOAD_SETTINGS', payload: validation.settings })
        return validation.errors
      }
      return []
    }
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

// Custom hook to use settings context
export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export default SettingsContext