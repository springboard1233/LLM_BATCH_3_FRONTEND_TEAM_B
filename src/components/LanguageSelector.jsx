import { Globe, ChevronDown } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { useTranslation } from '../hooks/useTranslation'

const LanguageSelector = () => {
  const { language, updateLanguage, supportedLanguages } = useSettings()
  const { t } = useTranslation()

  const currentLanguage = supportedLanguages.find(lang => lang.code === language)

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        {t('settings.language')}
      </h3>
      
      <div className="relative">
        <select
          value={language}
          onChange={(e) => updateLanguage(e.target.value)}
          className="w-full p-3 sm:p-3.5 text-base bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-10 min-h-[44px]"
          aria-label={t('settings.language')}
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
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      {/* Current selection display */}
      <div className="mt-2 text-sm text-gray-400">
        {t('settings.language')}: {currentLanguage?.nativeName}
      </div>
    </div>
  )
}

export default LanguageSelector