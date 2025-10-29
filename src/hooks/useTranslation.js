import { useSettings } from '../contexts/SettingsContext'
import enTranslations from '../locales/en.json'
import esTranslations from '../locales/es.json'

const translations = {
  en: enTranslations,
  es: esTranslations
}

export const useTranslation = () => {
  const { language } = useSettings()

  const t = (key, fallback = key) => {
    const keys = key.split('.')
    
    // First try to get value from current language
    let value = translations[language] || translations.en
    let found = true

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        found = false
        break
      }
    }

    // If found in current language and it's a string, return it
    if (found && typeof value === 'string') {
      return value
    }

    // Fallback to English if key not found in current language or current language is not English
    if (language !== 'en') {
      value = translations.en
      found = true

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          found = false
          break
        }
      }

      // If found in English and it's a string, return it
      if (found && typeof value === 'string') {
        return value
      }
    }

    // If still not found, return the fallback (which defaults to the key)
    return fallback
  }

  // Helper function to check if a translation key exists
  const hasTranslation = (key) => {
    const keys = key.split('.')
    let value = translations[language] || translations.en

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return false
      }
    }

    return typeof value === 'string'
  }

  return { t, language, hasTranslation }
}

export default useTranslation