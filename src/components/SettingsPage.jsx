import { useState } from 'react'
import { Sun, Moon, Monitor, Globe, RotateCcw, Check, User, Bell, Shield, Database, Palette, Languages } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { useTranslation } from '../hooks/useTranslation'

const SettingsPage = () => {
  const {
    theme,
    language,
    preferences,
    updateTheme,
    updateLanguage,
    updatePreferences,
    resetToDefaults,
    supportedLanguages,
    themeOptions
  } = useSettings()

  const { t } = useTranslation()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Handle reset confirmation
  const handleReset = () => {
    resetToDefaults()
    setShowResetConfirm(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h1 className="text-3xl font-bold text-white mb-2">{t('settings.title')}</h1>
        <p className="text-gray-300">Customize your SecureGuard AI experience</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Appearance Settings */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center mb-6">
            <Palette className="w-5 h-5 md:w-6 md:h-6 text-blue-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Appearance</h2>
          </div>
          
          {/* Theme Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Sun className="w-5 h-5 mr-2" />
              Theme
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const IconComponent = option.icon === 'Sun' ? Sun : 
                                    option.icon === 'Moon' ? Moon : Monitor
                
                return (
                  <button
                    key={option.value}
                    onClick={() => updateTheme(option.value)}
                    className={`p-4 rounded-lg border transition-all ${
                      theme === option.value
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/30'
                    }`}
                    aria-pressed={theme === option.value}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <IconComponent className="w-6 h-6" />
                      <span className="text-sm font-medium">{option.label}</span>
                      {theme === option.value && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Compact Mode</label>
              <p className="text-sm text-gray-400">Use smaller spacing and components</p>
            </div>
            <button
              onClick={() => updatePreferences({ compactMode: !preferences.compactMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.compactMode ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={preferences.compactMode}
              aria-label="Toggle compact mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.compactMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Language & Localization */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center mb-6">
            <Languages className="w-5 h-5 md:w-6 md:h-6 text-green-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Language & Localization</h2>
          </div>
          
          {/* Language Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Language
            </h3>
            <select
              value={language}
              onChange={(e) => updateLanguage(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select language"
            >
              {supportedLanguages.map((lang) => (
                <option 
                  key={lang.code} 
                  value={lang.code}
                  className="bg-gray-800 text-white"
                >
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center mb-6">
            <Bell className="w-6 h-6 text-yellow-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Notifications & Alerts</h2>
          </div>
          
          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">System Notifications</label>
                <p className="text-sm text-gray-400">Receive system alerts and updates</p>
              </div>
              <button
                onClick={() => updatePreferences({ notifications: !preferences.notifications })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.notifications ? 'bg-blue-600' : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={preferences.notifications}
                aria-label="Toggle notifications"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Fraud Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Fraud Alerts</label>
                <p className="text-sm text-gray-400">Get notified of high-risk transactions</p>
              </div>
              <button
                onClick={() => updatePreferences({ fraudAlerts: !preferences.fraudAlerts })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.fraudAlerts ? 'bg-red-600' : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={preferences.fraudAlerts}
                aria-label="Toggle fraud alerts"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.fraudAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data & Performance */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="flex items-center mb-6">
            <Database className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Data & Performance</h2>
          </div>
          
          <div className="space-y-6">
            {/* Auto Refresh */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Auto Refresh</label>
                <p className="text-sm text-gray-400">Automatically refresh dashboard data</p>
              </div>
              <button
                onClick={() => updatePreferences({ autoRefresh: !preferences.autoRefresh })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.autoRefresh ? 'bg-blue-600' : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={preferences.autoRefresh}
                aria-label="Toggle auto refresh"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Refresh Interval */}
            {preferences.autoRefresh && (
              <div>
                <label className="block text-white font-medium mb-2">
                  Refresh Interval: {preferences.refreshInterval / 1000}s
                </label>
                <input
                  type="range"
                  min="5000"
                  max="300000"
                  step="5000"
                  value={preferences.refreshInterval}
                  onChange={(e) => updatePreferences({ refreshInterval: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  aria-label="Refresh interval in seconds"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5s</span>
                  <span>5min</span>
                </div>
              </div>
            )}

            {/* Real-time Updates */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Real-time Updates</label>
                <p className="text-sm text-gray-400">Enable live data streaming</p>
              </div>
              <button
                onClick={() => updatePreferences({ realTimeUpdates: !preferences.realTimeUpdates })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.realTimeUpdates ? 'bg-green-600' : 'bg-gray-600'
                }`}
                role="switch"
                aria-checked={preferences.realTimeUpdates}
                aria-label="Toggle real-time updates"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.realTimeUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-red-400 mr-3" />
          <h2 className="text-xl font-semibold text-white">Security & Privacy</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Session Timeout */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Auto Logout</label>
              <p className="text-sm text-gray-400">Automatically logout after inactivity</p>
            </div>
            <button
              onClick={() => updatePreferences({ autoLogout: !preferences.autoLogout })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.autoLogout ? 'bg-red-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={preferences.autoLogout}
              aria-label="Toggle auto logout"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.autoLogout ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Data Encryption */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Enhanced Encryption</label>
              <p className="text-sm text-gray-400">Use additional data encryption</p>
            </div>
            <button
              onClick={() => updatePreferences({ enhancedEncryption: !preferences.enhancedEncryption })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.enhancedEncryption ? 'bg-green-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={preferences.enhancedEncryption}
              aria-label="Toggle enhanced encryption"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.enhancedEncryption ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-blue-400 mr-3" />
          <h2 className="text-xl font-semibold text-white">Account Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white">
              Admin User
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white">
              System Administrator
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Last Login</label>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white">
              {new Date().toLocaleString()}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Session Status</label>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-green-400">
              Active
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Reset Settings</h3>
            <p className="text-gray-300">Restore all settings to their default values</p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-2">Reset Settings</h4>
            <p className="text-gray-300 mb-6">
              Are you sure you want to reset all settings to their default values? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage