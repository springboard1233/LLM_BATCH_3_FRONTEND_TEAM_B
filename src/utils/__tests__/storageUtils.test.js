import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { storage, validator } from '../storageUtils'

describe('Storage Utils', () => {
  // Mock localStorage
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0
  }

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('storage.get', () => {
    it('should return parsed value when localStorage is available and has valid data', () => {
      mockLocalStorage.getItem.mockReturnValue('{"test": "value"}')
      
      const result = storage.get('testKey', 'default')
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('testKey')
      expect(result).toEqual({ test: 'value' })
    })

    it('should return default value when key does not exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const result = storage.get('nonexistent', 'default')
      
      expect(result).toBe('default')
    })

    it('should return default value and remove corrupted data when JSON parsing fails', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json')
      mockLocalStorage.removeItem.mockImplementation(() => {})
      
      const result = storage.get('corruptedKey', 'default')
      
      expect(result).toBe('default')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('corruptedKey')
    })

    it('should handle localStorage unavailable gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage not available')
      })
      
      const result = storage.get('testKey', 'fallback')
      
      expect(result).toBe('fallback')
    })

    it('should return default value for invalid key', () => {
      const result = storage.get(null, 'default')
      expect(result).toBe('default')
      
      const result2 = storage.get('', 'default')
      expect(result2).toBe('default')
    })
  })

  describe('storage.set', () => {
    it('should successfully store data when localStorage is available', () => {
      mockLocalStorage.setItem.mockImplementation(() => {})
      
      const result = storage.set('testKey', { test: 'value' })
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('testKey', '{"test":"value"}')
      expect(result).toBe(true)
    })

    it('should return false when localStorage throws error', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      const result = storage.set('testKey', 'value')
      
      expect(result).toBe(false)
    })

    it('should handle quota exceeded error by attempting to clear old entries', () => {
      const quotaError = new Error('QuotaExceededError')
      quotaError.name = 'QuotaExceededError'
      
      mockLocalStorage.setItem
        .mockImplementationOnce(() => { throw quotaError })
        .mockImplementationOnce(() => {}) // Success on retry
      
      // Mock Object.keys to return some keys for clearing
      Object.defineProperty(mockLocalStorage, 'length', { value: 2 })
      const mockKeys = vi.spyOn(Object, 'keys').mockReturnValue(['old_key', 'secureguard_settings'])
      
      const result = storage.set('testKey', 'value')
      
      expect(result).toBe(true)
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2)
      
      mockKeys.mockRestore()
    })

    it('should return false for invalid key', () => {
      const result = storage.set(null, 'value')
      expect(result).toBe(false)
      
      const result2 = storage.set('', 'value')
      expect(result2).toBe(false)
    })
  })

  describe('storage.remove', () => {
    it('should successfully remove item when localStorage is available', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {})
      
      const result = storage.remove('testKey')
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('testKey')
      expect(result).toBe(true)
    })

    it('should return false when localStorage throws error', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Remove failed')
      })
      
      const result = storage.remove('testKey')
      
      expect(result).toBe(false)
    })

    it('should return false for invalid key', () => {
      const result = storage.remove(null)
      expect(result).toBe(false)
    })
  })

  describe('storage.getUsageInfo', () => {
    it('should return usage information structure', () => {
      const info = storage.getUsageInfo()
      
      expect(info).toHaveProperty('available')
      expect(info).toHaveProperty('error')
      expect(info).toHaveProperty('usingFallback')
      expect(info).toHaveProperty('totalKeys')
      expect(info).toHaveProperty('estimatedSize')
      expect(typeof info.totalKeys).toBe('number')
      expect(typeof info.estimatedSize).toBe('number')
    })

    it('should handle storage access gracefully', () => {
      // This test just ensures the function doesn't throw
      expect(() => storage.getUsageInfo()).not.toThrow()
    })
  })
})

describe('Validator Utils', () => {
  describe('validator.isNonEmptyString', () => {
    it('should return true for valid non-empty strings', () => {
      expect(validator.isNonEmptyString('hello')).toBe(true)
      expect(validator.isNonEmptyString('  test  ')).toBe(true)
    })

    it('should return false for invalid inputs', () => {
      expect(validator.isNonEmptyString('')).toBe(false)
      expect(validator.isNonEmptyString('   ')).toBe(false)
      expect(validator.isNonEmptyString(null)).toBe(false)
      expect(validator.isNonEmptyString(undefined)).toBe(false)
      expect(validator.isNonEmptyString(123)).toBe(false)
    })
  })

  describe('validator.isBoolean', () => {
    it('should return true for boolean values', () => {
      expect(validator.isBoolean(true)).toBe(true)
      expect(validator.isBoolean(false)).toBe(true)
    })

    it('should return false for non-boolean values', () => {
      expect(validator.isBoolean('true')).toBe(false)
      expect(validator.isBoolean(1)).toBe(false)
      expect(validator.isBoolean(0)).toBe(false)
      expect(validator.isBoolean(null)).toBe(false)
    })
  })

  describe('validator.isPositiveNumber', () => {
    it('should return true for valid positive numbers', () => {
      expect(validator.isPositiveNumber(5)).toBe(true)
      expect(validator.isPositiveNumber(0)).toBe(true)
      expect(validator.isPositiveNumber(10, 5, 15)).toBe(true)
    })

    it('should return false for invalid numbers', () => {
      expect(validator.isPositiveNumber(-1)).toBe(false)
      expect(validator.isPositiveNumber(NaN)).toBe(false)
      expect(validator.isPositiveNumber('5')).toBe(false)
      expect(validator.isPositiveNumber(20, 5, 15)).toBe(false) // Outside range
    })
  })

  describe('validator.isOneOf', () => {
    it('should return true when value is in allowed array', () => {
      expect(validator.isOneOf('apple', ['apple', 'banana', 'orange'])).toBe(true)
      expect(validator.isOneOf(2, [1, 2, 3])).toBe(true)
    })

    it('should return false when value is not in allowed array', () => {
      expect(validator.isOneOf('grape', ['apple', 'banana', 'orange'])).toBe(false)
      expect(validator.isOneOf(4, [1, 2, 3])).toBe(false)
      expect(validator.isOneOf('test', null)).toBe(false)
    })
  })

  describe('validator.validateSchema', () => {
    const testSchema = {
      name: { type: 'string', required: true },
      age: { type: 'number', min: 0, max: 150 },
      active: { type: 'boolean', required: true },
      role: { oneOf: ['admin', 'user', 'guest'] }
    }

    it('should validate correct object successfully', () => {
      const validObject = {
        name: 'John',
        age: 30,
        active: true,
        role: 'admin'
      }

      const result = validator.validateSchema(validObject, testSchema)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return errors for invalid object', () => {
      const invalidObject = {
        name: '',
        age: -5,
        active: 'yes',
        role: 'invalid'
      }

      const result = validator.validateSchema(invalidObject, testSchema)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors.some(error => error.includes('name'))).toBe(true)
      expect(result.errors.some(error => error.includes('age'))).toBe(true)
      expect(result.errors.some(error => error.includes('active'))).toBe(true)
      expect(result.errors.some(error => error.includes('role'))).toBe(true)
    })

    it('should handle missing required fields', () => {
      const incompleteObject = {
        age: 25
      }

      const result = validator.validateSchema(incompleteObject, testSchema)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('name') && error.includes('required'))).toBe(true)
      expect(result.errors.some(error => error.includes('active') && error.includes('required'))).toBe(true)
    })

    it('should return error for non-object input', () => {
      const result = validator.validateSchema('not an object', testSchema)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Value must be an object')
    })
  })
})