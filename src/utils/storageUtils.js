/**
 * Robust local storage utilities with comprehensive error handling
 * Provides fallback mechanisms when localStorage is unavailable
 */

// Storage availability check
let isStorageAvailable = false
let storageError = null

try {
  const testKey = '__storage_test__'
  localStorage.setItem(testKey, 'test')
  localStorage.removeItem(testKey)
  isStorageAvailable = true
} catch (error) {
  isStorageAvailable = false
  storageError = error
  console.warn('localStorage is not available:', error.message)
}

// In-memory fallback storage for when localStorage is unavailable
const memoryStorage = new Map()

/**
 * Storage interface with error handling and fallback
 */
export const storage = {
  /**
   * Check if storage is available
   * @returns {boolean} True if localStorage is available
   */
  isAvailable: () => isStorageAvailable,

  /**
   * Get storage error if any
   * @returns {Error|null} Storage error or null if no error
   */
  getError: () => storageError,

  /**
   * Get item from storage with fallback
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist or parsing fails
   * @returns {*} Parsed value or default value
   */
  get: (key, defaultValue = null) => {
    if (!key || typeof key !== 'string') {
      console.warn('Invalid storage key provided:', key)
      return defaultValue
    }

    try {
      if (isStorageAvailable) {
        const item = localStorage.getItem(key)
        if (item === null) {
          return defaultValue
        }
        return JSON.parse(item)
      } else {
        // Use memory storage fallback
        return memoryStorage.has(key) ? memoryStorage.get(key) : defaultValue
      }
    } catch (error) {
      console.warn(`Failed to get "${key}" from storage:`, error.message)
      // Try to recover from corrupted data
      if (isStorageAvailable) {
        try {
          localStorage.removeItem(key)
          console.info(`Removed corrupted data for key "${key}"`)
        } catch (removeError) {
          console.warn(`Failed to remove corrupted key "${key}":`, removeError.message)
        }
      }
      return defaultValue
    }
  },

  /**
   * Set item in storage with fallback
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} True if successful, false otherwise
   */
  set: (key, value) => {
    if (!key || typeof key !== 'string') {
      console.warn('Invalid storage key provided:', key)
      return false
    }

    try {
      const serializedValue = JSON.stringify(value)
      
      if (isStorageAvailable) {
        localStorage.setItem(key, serializedValue)
      } else {
        // Use memory storage fallback
        memoryStorage.set(key, value)
      }
      return true
    } catch (error) {
      console.warn(`Failed to set "${key}" in storage:`, error.message)
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn('Storage quota exceeded. Attempting to clear old data...')
        try {
          // Try to clear some space by removing old entries
          storage.clearOldEntries()
          // Retry the operation
          if (isStorageAvailable) {
            localStorage.setItem(key, JSON.stringify(value))
            return true
          }
        } catch (retryError) {
          console.warn('Failed to retry storage operation:', retryError.message)
        }
      }
      
      return false
    }
  },

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   * @returns {boolean} True if successful, false otherwise
   */
  remove: (key) => {
    if (!key || typeof key !== 'string') {
      console.warn('Invalid storage key provided:', key)
      return false
    }

    try {
      if (isStorageAvailable) {
        localStorage.removeItem(key)
      } else {
        memoryStorage.delete(key)
      }
      return true
    } catch (error) {
      console.warn(`Failed to remove "${key}" from storage:`, error.message)
      return false
    }
  },

  /**
   * Clear all storage
   * @returns {boolean} True if successful, false otherwise
   */
  clear: () => {
    try {
      if (isStorageAvailable) {
        localStorage.clear()
      } else {
        memoryStorage.clear()
      }
      return true
    } catch (error) {
      console.warn('Failed to clear storage:', error.message)
      return false
    }
  },

  /**
   * Get all keys from storage
   * @returns {string[]} Array of storage keys
   */
  keys: () => {
    try {
      if (isStorageAvailable) {
        return Object.keys(localStorage)
      } else {
        return Array.from(memoryStorage.keys())
      }
    } catch (error) {
      console.warn('Failed to get storage keys:', error.message)
      return []
    }
  },

  /**
   * Clear old entries to free up space (removes non-app entries first)
   * @param {string} appPrefix - App-specific key prefix to preserve
   */
  clearOldEntries: (appPrefix = 'secureguard_') => {
    if (!isStorageAvailable) return

    try {
      const keys = Object.keys(localStorage)
      const appKeys = keys.filter(key => key.startsWith(appPrefix))
      const otherKeys = keys.filter(key => !key.startsWith(appPrefix))

      // Remove non-app keys first
      otherKeys.forEach(key => {
        try {
          localStorage.removeItem(key)
        } catch (error) {
          console.warn(`Failed to remove key "${key}":`, error.message)
        }
      })

      // If still need space, remove oldest app keys (keep most recent)
      if (appKeys.length > 10) {
        const keysToRemove = appKeys.slice(0, appKeys.length - 10)
        keysToRemove.forEach(key => {
          try {
            localStorage.removeItem(key)
          } catch (error) {
            console.warn(`Failed to remove app key "${key}":`, error.message)
          }
        })
      }
    } catch (error) {
      console.warn('Failed to clear old entries:', error.message)
    }
  },

  /**
   * Get storage usage information
   * @returns {object} Storage usage stats
   */
  getUsageInfo: () => {
    const info = {
      available: isStorageAvailable,
      error: storageError?.message || null,
      usingFallback: !isStorageAvailable,
      totalKeys: 0,
      estimatedSize: 0
    }

    try {
      if (isStorageAvailable) {
        const keys = Object.keys(localStorage)
        info.totalKeys = keys.length
        
        // Estimate storage size
        let totalSize = 0
        keys.forEach(key => {
          try {
            const value = localStorage.getItem(key)
            totalSize += key.length + (value ? value.length : 0)
          } catch (error) {
            // Skip corrupted entries
          }
        })
        info.estimatedSize = totalSize
      } else {
        info.totalKeys = memoryStorage.size
        // Memory storage size estimation
        let totalSize = 0
        memoryStorage.forEach((value, key) => {
          totalSize += key.length + JSON.stringify(value).length
        })
        info.estimatedSize = totalSize
      }
    } catch (error) {
      console.warn('Failed to get storage usage info:', error.message)
    }

    return info
  }
}

/**
 * Data validation utilities
 */
export const validator = {
  /**
   * Validate that a value is a non-empty string
   * @param {*} value - Value to validate
   * @returns {boolean} True if valid
   */
  isNonEmptyString: (value) => {
    return typeof value === 'string' && value.trim().length > 0
  },

  /**
   * Validate that a value is a boolean
   * @param {*} value - Value to validate
   * @returns {boolean} True if valid
   */
  isBoolean: (value) => {
    return typeof value === 'boolean'
  },

  /**
   * Validate that a value is a positive number
   * @param {*} value - Value to validate
   * @param {number} min - Minimum value (optional)
   * @param {number} max - Maximum value (optional)
   * @returns {boolean} True if valid
   */
  isPositiveNumber: (value, min = 0, max = Infinity) => {
    return typeof value === 'number' && 
           !isNaN(value) && 
           value >= min && 
           value <= max
  },

  /**
   * Validate that a value is one of the allowed options
   * @param {*} value - Value to validate
   * @param {Array} allowedValues - Array of allowed values
   * @returns {boolean} True if valid
   */
  isOneOf: (value, allowedValues) => {
    return Array.isArray(allowedValues) && allowedValues.includes(value)
  },

  /**
   * Validate that a value is a plain object
   * @param {*} value - Value to validate
   * @returns {boolean} True if valid
   */
  isPlainObject: (value) => {
    return value !== null && 
           typeof value === 'object' && 
           !Array.isArray(value) &&
           Object.prototype.toString.call(value) === '[object Object]'
  },

  /**
   * Deep validate an object against a schema
   * @param {*} value - Value to validate
   * @param {object} schema - Validation schema
   * @returns {object} Validation result with isValid and errors
   */
  validateSchema: (value, schema) => {
    const errors = []
    
    if (!validator.isPlainObject(value)) {
      return { isValid: false, errors: ['Value must be an object'] }
    }

    const validateProperty = (obj, key, rules, path = '') => {
      const fullPath = path ? `${path}.${key}` : key
      const val = obj[key]

      if (rules.required && (val === undefined || val === null)) {
        errors.push(`${fullPath} is required`)
        return
      }

      if (val === undefined || val === null) {
        return // Optional property not provided
      }

      if (rules.type) {
        switch (rules.type) {
          case 'string':
            if (!validator.isNonEmptyString(val)) {
              errors.push(`${fullPath} must be a non-empty string`)
            }
            break
          case 'boolean':
            if (!validator.isBoolean(val)) {
              errors.push(`${fullPath} must be a boolean`)
            }
            break
          case 'number':
            if (!validator.isPositiveNumber(val, rules.min, rules.max)) {
              errors.push(`${fullPath} must be a valid number${rules.min !== undefined ? ` >= ${rules.min}` : ''}${rules.max !== undefined ? ` <= ${rules.max}` : ''}`)
            }
            break
          case 'object':
            if (!validator.isPlainObject(val)) {
              errors.push(`${fullPath} must be an object`)
            } else if (rules.properties) {
              Object.keys(rules.properties).forEach(subKey => {
                validateProperty(val, subKey, rules.properties[subKey], fullPath)
              })
            }
            break
        }
      }

      if (rules.oneOf && !validator.isOneOf(val, rules.oneOf)) {
        errors.push(`${fullPath} must be one of: ${rules.oneOf.join(', ')}`)
      }
    }

    Object.keys(schema).forEach(key => {
      validateProperty(value, key, schema[key])
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default storage