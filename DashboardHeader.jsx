import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Settings,
  User,
  RefreshCw,
  Wifi,
  WifiOff,
  X,
  AlertTriangle,
  CheckCircle,
  Info,
  Home,
  Menu,
  LogOut,
} from "lucide-react";
import SettingsPanel from './src/components/SettingsPanel'
import { useTranslation } from './src/hooks/useTranslation'
import { useSettings } from './src/contexts/SettingsContext'
import { useAuth } from './src/contexts/AuthContext'
import useResponsive from './src/hooks/useResponsive'

export default function DashboardHeader({
  onRefresh,
  lastUpdated,
  transactions = [],
  onBackToLanding,
  onMobileMenuToggle, // ✅ New prop for mobile menu toggle
  rightContent, // ✅ Merged new prop
}) {
  const { t } = useTranslation();
  const { effectiveTheme } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isDarkTheme = effectiveTheme === 'dark';
  const { isMobile } = useResponsive();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const [notifications, setNotifications] = useState(() => {
    const baseNotifications = [
      {
        id: 1,
        type: "success",
        title: t("notifications.systemUpdate"),
        message: "Fraud detection algorithms updated successfully",
        time: "1 hour ago",
        read: false,
      },
    ];

    const fraudTransactions = transactions.filter((t) => t.status === "Fraud");
    const highValueFraud = fraudTransactions.filter(
      (t) => Number(t.amount) > 10000
    );
    const fraudRate =
      transactions.length > 0
        ? (fraudTransactions.length / transactions.length) * 100
        : 0;

    if (fraudRate > 25) {
      baseNotifications.unshift({
        id: 2,
        type: "error",
        title: "Critical Fraud Rate Alert",
        message: `Fraud rate has reached ${fraudRate.toFixed(
          1
        )}% - immediate action required`,
        time: "2 minutes ago",
        read: false,
      });
    } else if (fraudRate > 15) {
      baseNotifications.unshift({
        id: 2,
        type: "warning",
        title: "High Fraud Rate Detected",
        message: `Fraud rate has increased to ${fraudRate.toFixed(
          1
        )}% in the last hour`,
        time: "2 minutes ago",
        read: false,
      });
    }

    if (highValueFraud.length > 0) {
      baseNotifications.unshift({
        id: 3,
        type: "error",
        title: "High-Value Fraud Alert",
        message: `${highValueFraud.length} high-value fraudulent transactions detected`,
        time: "5 minutes ago",
        read: false,
      });
    }

    return baseNotifications;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (showNotifications) setShowNotifications(false);
        if (showUserMenu) setShowUserMenu(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showNotifications, showUserMenu]);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!showUserMenu) return;
    
    const handleClickOutside = (event) => {
      const userMenuElement = event.target.closest('[data-user-menu]');
      if (!userMenuElement) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  return (
    <header className={`px-4 md:px-6 py-3 md:py-4 relative z-10 border-b ${
      isDarkTheme 
        ? 'bg-black/20 backdrop-blur-md border-white/10' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          {/* Hamburger Menu Button - Only on mobile/tablet */}
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className={`md:hidden p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              aria-label="Toggle mobile menu"
            >
              <Menu className={`w-6 h-6 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          )}
          
          <div className="min-w-0 flex-1">
            <h1 className={`text-lg md:text-2xl font-bold truncate ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {t("app.title")}
            </h1>
            {/* Status indicators - hidden on mobile, visible on tablet+ */}
            <div className="hidden md:flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                ) : (
                  <WifiOff className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                )}
                <span
                  className={`text-sm ${
                    isOnline ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isOnline ? t("app.connected") : t("app.offline")}
                </span>
              </div>
              <div className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                {t("app.lastUpdated")}:{" "}
                {lastUpdated
                  ? new Date(lastUpdated).toLocaleTimeString()
                  : t("app.never")}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Desktop */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4">
          {/* Clock - hidden on tablet, visible on desktop */}
          <div className={`text-sm whitespace-nowrap ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            {currentTime.toLocaleString()}
          </div>

          {/* Back to Landing */}
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors border whitespace-nowrap ${
                isDarkTheme 
                  ? 'text-gray-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/10' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border-gray-300'
              }`}
            >
              <Home className="w-4 h-4 md:w-5 md:h-5" />
              <span>{t("app.home")}</span>
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={onRefresh}
            className={`p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isDarkTheme ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 md:w-6 md:h-6 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>

          {/* Right Content (LiveToggle, etc.) */}
          {rightContent && <div className="flex items-center">{rightContent}</div>}

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isDarkTheme ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
            title="Notifications"
          >
            <Bell className={`w-5 h-5 md:w-6 md:h-6 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isDarkTheme ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Open settings"
          >
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* User Profile with Dropdown */}
          <div className="relative" data-user-menu>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                isDarkTheme 
                  ? 'bg-white/10 backdrop-blur-sm border-white/10 hover:bg-white/20' 
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
            >
              <User className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
              <span className={`text-sm font-medium whitespace-nowrap ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {user ? (user.full_name || user.email?.split('@')[0] || 'User') : t("app.adminUser")}
              </span>
            </button>
            
            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 ${
                isDarkTheme 
                  ? 'bg-black/90 backdrop-blur-md border-white/10' 
                  : 'bg-white border-gray-200'
              }`}>
                {user && (
                  <div className={`p-3 border-b ${isDarkTheme ? 'border-white/10' : 'border-gray-200'}`}>
                    <p className={`text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {user.full_name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.email || 'No email'}
                    </p>
                    {user.role && (
                      <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded ${
                        isDarkTheme 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-1">
                  {user && (
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isDarkTheme 
                          ? 'text-red-400 hover:bg-red-500/20' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  )}
                  {!user && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/login');
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isDarkTheme 
                          ? 'text-emerald-400 hover:bg-emerald-500/20' 
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Mobile/Tablet */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isDarkTheme ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
            title="Notifications"
          >
            <Bell className={`w-5 h-5 md:w-6 md:h-6 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isDarkTheme ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Open settings"
          >
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* User - Icon only on mobile */}
          <div className="relative" data-user-menu>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`p-2 rounded-lg border min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isDarkTheme 
                  ? 'bg-white/10 backdrop-blur-sm border-white/10 hover:bg-white/20' 
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
              title={user ? (user.full_name || user.email) : t("app.adminUser")}
            >
              <User className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
            </button>
            
            {/* Mobile User Menu */}
            {showUserMenu && (
              <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 ${
                isDarkTheme 
                  ? 'bg-black/90 backdrop-blur-md border-white/10' 
                  : 'bg-white border-gray-200'
              }`}>
                {user && (
                  <div className={`p-3 border-b ${isDarkTheme ? 'border-white/10' : 'border-gray-200'}`}>
                    <p className={`text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {user.full_name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.email || 'No email'}
                    </p>
                  </div>
                )}
                <div className="p-1">
                  {user && (
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isDarkTheme 
                          ? 'text-red-400 hover:bg-red-500/20' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  )}
                  {!user && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/login');
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isDarkTheme 
                          ? 'text-emerald-400 hover:bg-emerald-500/20' 
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Panel - Responsive */}
      {showNotifications && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-14 sm:pt-16 md:pt-20 px-2 sm:px-4 md:pr-6">
          <div
            className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
            aria-hidden="true"
          />
          <div className={`relative w-full sm:w-96 md:w-[28rem] max-w-full sm:max-w-md rounded-lg shadow-2xl border ring-1 ring-opacity-10 ${
            isDarkTheme 
              ? 'bg-black/80 backdrop-blur-md border-white/20 ring-white' 
              : 'bg-white border-gray-200 ring-gray-300'
          }`}>
            <div className={`p-3 sm:p-4 border-b flex items-center justify-between ${
              isDarkTheme ? 'border-white/10' : 'border-gray-200'
            }`}>
              <h3 className={`text-base sm:text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {t("notifications.title")}
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors ${
                  isDarkTheme ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="Close notifications"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="max-h-[calc(100vh-200px)] sm:max-h-[60vh] md:max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className={`p-6 sm:p-8 text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t("notifications.noNotifications")}
                </div>
              ) : (
                notifications.map((n) => {
                  const getIcon = (type) => {
                    switch (type) {
                      case "error":
                        return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />;
                      case "warning":
                        return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0" />;
                      case "success":
                        return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />;
                      default:
                        return <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />;
                    }
                  };
                  return (
                    <div
                      key={n.id}
                      className={`p-3 sm:p-4 border-b cursor-pointer min-h-[68px] sm:min-h-[76px] active:scale-[0.98] transition-transform ${
                        isDarkTheme 
                          ? 'border-white/10 hover:bg-white/5 active:bg-white/10' 
                          : 'border-gray-100 hover:bg-gray-50 active:bg-gray-100'
                      }`}
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((x) =>
                            x.id === n.id ? { ...x, read: true } : x
                          )
                        )
                      }
                    >
                      <div className="flex items-start space-x-3">
                        {getIcon(n.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-sm sm:text-base font-medium truncate ${
                                isDarkTheme 
                                  ? (n.read ? "text-gray-400" : "text-white")
                                  : (n.read ? "text-gray-600" : "text-gray-900")
                              }`}
                            >
                              {n.title}
                            </p>
                            {!n.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p
                            className={`text-xs sm:text-sm mt-1 line-clamp-2 ${
                              isDarkTheme 
                                ? (n.read ? "text-gray-500" : "text-gray-300")
                                : (n.read ? "text-gray-500" : "text-gray-700")
                            }`}
                          >
                            {n.message}
                          </p>
                          <p className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                            {n.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className={`p-3 sm:p-4 border-t flex flex-col sm:flex-row gap-2 ${
              isDarkTheme ? 'border-white/10' : 'border-gray-200'
            }`}>
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, read: true }))
                  )
                }
                className={`text-sm font-medium min-h-[44px] px-4 rounded-lg transition-colors ${
                  isDarkTheme 
                    ? 'text-blue-400 hover:text-blue-300 hover:bg-white/5 active:bg-white/10' 
                    : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 active:bg-blue-100'
                }`}
              >
                {t("notifications.markAllRead")}
              </button>
              <button
                onClick={() => setNotifications([])}
                className={`text-sm font-medium min-h-[44px] px-4 rounded-lg transition-colors ${
                  isDarkTheme 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5 active:bg-white/10' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                {t("notifications.clearAll")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </header>
  );
}
