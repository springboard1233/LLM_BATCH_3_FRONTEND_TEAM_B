import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, RotateCcw } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { useTranslation } from '../hooks/useTranslation'
import ThemeSelector from './ThemeSelector'
import LanguageSelector from './LanguageSelector'

const SettingsPanel = ({ isOpen, onClose }) => {
  const {
    preferences,
    updatePreferences,
    resetToDefaults,
    getStorageInfo,
    isStorageAvailable
  } = useSettings()

  const { t } = useTranslation()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [resetError, setResetError] = useState(null)
  const modalRef = useRef(null)
  const firstFocusableRef = useRef(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      
      // Focus management
      setTimeout(() => {
        if (firstFocusableRef.current) {
          firstFocusableRef.current.focus()
        }
      }, 100)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Handle reset confirmation with error handling
  const handleReset = async () => {
    setIsResetting(true)
    setResetError(null)
    
    try {
      // Get storage info before reset for debugging
      const storageInfo = getStorageInfo()
      console.info('Storage info before reset:', storageInfo)
      
      // Perform reset
      resetToDefaults()
      
      // Verify reset was successful by checking if storage is available
      if (!isStorageAvailable()) {
        console.warn('Storage not available after reset, settings will not persist')
      }
      
      // Close confirmation dialog
      setShowResetConfirm(false)
      
      // Show success feedback (could be enhanced with toast notification)
      console.info('Settings successfully reset to defaults')
      
    } catch (error) {
      console.error('Error during settings reset:', error)
      setResetError(error.message || 'Failed to reset settings')
    } finally {
      setIsResetting(false)
    }
  }

  // Handle reset dialog close
  const handleResetCancel = () => {
    setShowResetConfirm(false)
    setResetError(null)
  }

  if (!isOpen) return null

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] bg-black/80 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl overflow-hidden animate-modal-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <h2 
            id="settings-title"
            className="text-xl sm:text-2xl font-bold text-white"
          >
            {t('settings.title')}
          </h2>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-140px)]">
          <div className="space-y-6 sm:space-y-8">
            
            {/* Theme Selection */}
            <ThemeSelector />

            {/* Language Selection */}
            <LanguageSelector />

            {/* Storage Status (if there are issues) */}
            {(!isStorageAvailable() || getStorageInfo().error) && (
              <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <h4 className="text-orange-300 font-medium mb-2 text-sm sm:text-base">⚠️ Storage Notice</h4>
                <div className="text-xs sm:text-sm text-orange-200 space-y-1">
                  {!isStorageAvailable() && (
                    <p>Local storage is not available. Your settings will not persist after closing the browser.</p>
                  )}
                  {getStorageInfo().error && (
                    <p>Storage error: {getStorageInfo().error}</p>
                  )}
                  <p className="text-xs text-orange-300 mt-2">
                    Settings will still work during this session but may reset when you reload the page.
                  </p>
                </div>
              </div>
            )}

            {/* Preferences */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                {t('settings.preferences')}
              </h3>
              <div className="space-y-4 sm:space-y-5">
                
                {/* Notifications */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="text-white font-medium text-sm sm:text-base block">{t('settings.preferences.notifications')}</label>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{t('settings.preferences.notificationsDesc')}</p>
                  </div>
                  <button
                    onClick={() => updatePreferences({ notifications: !preferences.notifications })}
                    className={`relative inline-flex h-7 w-12 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      preferences.notifications ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                    role="switch"
                    aria-checked={preferences.notifications}
                    aria-label="Toggle notifications"
                  >
                    <span
                      className={`inline-block h-5 w-5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                        preferences.notifications ? 'translate-x-6 sm:translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Refresh */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="text-white font-medium text-sm sm:text-base block">{t('settings.preferences.autoRefresh')}</label>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{t('settings.preferences.autoRefreshDesc')}</p>
                  </div>
                  <button
                    onClick={() => updatePreferences({ autoRefresh: !preferences.autoRefresh })}
                    className={`relative inline-flex h-7 w-12 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      preferences.autoRefresh ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                    role="switch"
                    aria-checked={preferences.autoRefresh}
                    aria-label="Toggle auto refresh"
                  >
                    <span
                      className={`inline-block h-5 w-5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                        preferences.autoRefresh ? 'translate-x-6 sm:translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Refresh Interval */}
                {preferences.autoRefresh && (
                  <div className="pt-2">
                    <label className="block text-white font-medium mb-3 text-sm sm:text-base">
                      {t('settings.preferences.refreshInterval')}: {preferences.refreshInterval / 1000}s
                    </label>
                    <input
                      type="range"
                      min="5000"
                      max="300000"
                      step="5000"
                      value={preferences.refreshInterval}
                      onChange={(e) => updatePreferences({ refreshInterval: parseInt(e.target.value) })}
                      className="w-full h-3 sm:h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      aria-label="Refresh interval in seconds"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>5s</span>
                      <span>5min</span>
                    </div>
                  </div>
                )}

                {/* Compact Mode */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="text-white font-medium text-sm sm:text-base block">{t('settings.preferences.compactMode')}</label>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{t('settings.preferences.compactModeDesc')}</p>
                  </div>
                  <button
                    onClick={() => updatePreferences({ compactMode: !preferences.compactMode })}
                    className={`relative inline-flex h-7 w-12 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      preferences.compactMode ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                    role="switch"
                    aria-checked={preferences.compactMode}
                    aria-label="Toggle compact mode"
                  >
                    <span
                      className={`inline-block h-5 w-5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                        preferences.compactMode ? 'translate-x-6 sm:translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4 p-4 sm:p-6 border-t border-white/10 bg-black/20">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center justify-center space-x-2 px-4 py-3 sm:py-2 min-h-[44px] text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
            <span>{t('settings.resetToDefaults')}</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-3 sm:py-2 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {t('settings.done')}
          </button>
        </div>

        {/* Enhanced Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full border border-white/20 max-h-[90vh] overflow-y-auto">
              <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
                {t('settings.resetConfirmTitle')}
              </h4>
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-300 mb-3 text-sm sm:text-base">
                  {t('settings.resetConfirmMessage')}
                </p>
                <div className="bg-gray-700/50 rounded-lg p-3 text-xs sm:text-sm text-gray-300">
                  <p className="font-medium text-yellow-400 mb-2">This will reset:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Theme preference (back to System Default)</li>
                    <li>Language preference (back to English)</li>
                    <li>All notification settings</li>
                    <li>Auto-refresh settings</li>
                    <li>Display preferences</li>
                  </ul>
                </div>
                {!isStorageAvailable() && (
                  <div className="mt-3 bg-orange-500/20 border border-orange-500/30 rounded-lg p-3">
                    <p className="text-orange-300 text-xs sm:text-sm">
                      ⚠️ Storage is not available. Settings will reset but may not persist after page reload.
                    </p>
                  </div>
                )}
                {resetError && (
                  <div className="mt-3 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-300 text-xs sm:text-sm">
                      ❌ Error: {resetError}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleResetCancel}
                  disabled={isResetting}
                  className="flex-1 px-4 py-3 sm:py-2 min-h-[44px] bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  {t('settings.cancel')}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  className="flex-1 px-4 py-3 sm:py-2 min-h-[44px] bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  {isResetting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Resetting...
                    </>
                  ) : (
                    t('settings.reset')
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default SettingsPanel