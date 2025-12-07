import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'

const ThemeSelector = () => {
  const { theme, updateTheme, themeOptions } = useSettings()

  // Theme preview colors for visual cards
  const themePreviewColors = {
    light: {
      bg: '#ffffff',
      secondary: '#f9fafb',
      text: '#111827',
      accent: '#3b82f6'
    },
    dark: {
      bg: '#111827',
      secondary: '#1f2937',
      text: '#ffffff',
      accent: '#3b82f6'
    },
    system: {
      bg: 'linear-gradient(135deg, #ffffff 50%, #111827 50%)',
      secondary: 'linear-gradient(135deg, #f9fafb 50%, #1f2937 50%)',
      text: '#6b7280',
      accent: '#3b82f6'
    }
  }

  const getThemeIcon = (iconName) => {
    switch (iconName) {
      case 'Sun':
        return Sun
      case 'Moon':
        return Moon
      case 'Monitor':
        return Monitor
      default:
        return Monitor
    }
  }

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Theme
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {themeOptions.map((option) => {
          const IconComponent = getThemeIcon(option.icon)
          const colors = themePreviewColors[option.value]
          const isSelected = theme === option.value
          
          return (
            <button
              key={option.value}
              onClick={() => updateTheme(option.value)}
              className={`relative p-3 sm:p-4 rounded-lg border transition-all duration-200 min-h-[100px] sm:min-h-[120px] ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 active:bg-white/15'
              }`}
              aria-pressed={isSelected}
              aria-label={`Select ${option.label} theme`}
            >
              {/* Theme Preview Card */}
              <div className="mb-3 relative overflow-hidden rounded-md">
                <div 
                  className="h-16 w-full rounded-md border border-white/10"
                  style={{ 
                    background: colors.bg,
                    backgroundSize: option.value === 'system' ? '100% 100%' : 'auto'
                  }}
                >
                  {/* Preview content elements */}
                  <div className="p-2 h-full flex flex-col justify-between">
                    {/* Header bar */}
                    <div 
                      className="h-2 w-full rounded-sm"
                      style={{ 
                        background: colors.secondary,
                        backgroundSize: option.value === 'system' ? '100% 100%' : 'auto'
                      }}
                    />
                    
                    {/* Content area */}
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div 
                          className="h-1 w-8 rounded-sm"
                          style={{ backgroundColor: colors.text }}
                        />
                        <div 
                          className="h-1 w-6 rounded-sm opacity-60"
                          style={{ backgroundColor: colors.text }}
                        />
                      </div>
                      <div 
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: colors.accent }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              <div className="flex flex-col items-center space-y-2">
                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {option.label}
                </span>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Hover effect overlay */}
              <div className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                isSelected 
                  ? 'bg-blue-500/10 opacity-100' 
                  : 'bg-white/5 opacity-0 hover:opacity-100'
              }`} />
            </button>
          )
        })}
      </div>
      
      {/* Theme description */}
      <div className="mt-3 text-sm text-gray-400">
        {theme === 'system' && (
          <p>Automatically matches your system's appearance preference</p>
        )}
        {theme === 'light' && (
          <p>Light theme with bright backgrounds and dark text</p>
        )}
        {theme === 'dark' && (
          <p>Dark theme with dark backgrounds and light text</p>
        )}
      </div>
    </div>
  )
}

export default ThemeSelector