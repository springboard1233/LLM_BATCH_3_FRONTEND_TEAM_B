import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Shield,
  Users,
  Settings,
  FileText,
  AlertTriangle,
  Database,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { useTranslation } from './src/hooks/useTranslation'
import { useSettings } from './src/contexts/SettingsContext'
import { useAuth } from './src/contexts/AuthContext'

export default function NavigationSidebar({
  activeSection = "dashboard",
  onSectionChange,
  items, // ✅ new dynamic prop
  isMobileMenuOpen, // ✅ Controlled by parent for mobile
  onMobileMenuClose, // ✅ Close handler for mobile
}) {
  const { t } = useTranslation();
  const { effectiveTheme } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isDarkTheme = effectiveTheme === 'dark';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ✅ fallback if no items prop is passed
  const navigationItems =
    items && items.length > 0
      ? items
      : [
        {
          id: "dashboard",
          label: t("navigation.dashboard"),
          icon: Home,
        },
        {
          id: "analytics",
          label: t("navigation.analytics"),
          icon: BarChart3,
        },
        {
          id: "fraud-detection",
          label: t("navigation.fraudDetection"),
          icon: Shield,
        },
        {
          id: "risk-management",
          label: "Risk Management",
          icon: AlertTriangle,
        },
        {
          id: "customers",
          label: "Customers",
          icon: Users,
        },
        {
          id: "reports",
          label: t("navigation.reports"),
          icon: FileText,
        },
        {
          id: "data-sources",
          label: "Data Sources",
          icon: Database,
        },
        {
          id: "settings",
          label: t("navigation.settings"),
          icon: Settings,
        },
      ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onMobileMenuClose}
        />
      )}

      <div
        className={`fixed md:relative z-50 transition-all duration-300 ease-in-out h-screen flex flex-col 
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "w-16" : "w-64"} 
          ${isDarkTheme
            ? 'bg-black/90 md:bg-black/30 backdrop-blur-md border-r border-white/10 text-white'
            : 'bg-white border-r border-gray-200 text-gray-900 shadow-sm'
          }`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${isDarkTheme ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Shield className="h-8 w-8 text-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>SecureGuard</h2>
                  <p className="text-xs text-emerald-400">AI Fraud Detection</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1 rounded-lg transition-colors hidden md:block ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>

            {/* Mobile close button */}
            <button
              onClick={onMobileMenuClose}
              className={`p-1 rounded-lg transition-colors md:hidden ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onSectionChange) onSectionChange(item.id);
                  if (onMobileMenuClose) onMobileMenuClose(); // Close menu on mobile when clicked
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${activeSection === item.id
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/25"
                    : isDarkTheme
                      ? "text-gray-300 hover:bg-white/10 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className={`p-4 border-t ${isDarkTheme ? 'border-white/10' : 'border-gray-200'}`}>
          {!isCollapsed && (
            <>
              {user ? (
                // User is logged in - show profile and logout
                <div className="space-y-3 mb-4">
                  {/* User Profile */}
                  <div className={`p-3 rounded-lg border ${isDarkTheme
                      ? 'bg-white/5 backdrop-blur-sm border-white/10'
                      : 'bg-gray-50 border-gray-200'
                    }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkTheme
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-emerald-100 text-emerald-600'
                        }`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isDarkTheme ? 'text-white' : 'text-gray-900'
                          }`}>
                          {user.full_name || user.email?.split('@')[0] || 'User'}
                        </p>
                        <p className={`text-xs truncate ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {user.email || 'No email'}
                        </p>
                        {user.role && (
                          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${isDarkTheme
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-emerald-100 text-emerald-700'
                            }`}>
                            {user.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkTheme
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                        : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      }`}>
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                // User is not logged in - show login/signup options
                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => navigate('/login')}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkTheme
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}>
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isDarkTheme
                        ? 'border-white/20 text-gray-300 hover:bg-white/5'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}>
                    Sign Up
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkTheme
                        ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}>
                    Guest Mode
                  </button>
                </div>
              )}
            </>
          )}

          {/* Collapsed view - show user icon or login icon */}
          {isCollapsed && user && (
            <div className="flex justify-center mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${isDarkTheme
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                }`} title={user.email || 'User'}>
                <User className="w-5 h-5" />
              </div>
            </div>
          )}

          {isCollapsed && !user && (
            <div className="flex justify-center mb-2">
              <button
                onClick={() => navigate('/login')}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkTheme
                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-emerald-50 text-emerald-400 hover:bg-emerald-100'
                  }`}
                title="Login"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Compact Status Indicator */}
          {isCollapsed ? (
            <div className="flex justify-center">
              <div
                className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                title="System Online"
              ></div>
            </div>
          ) : (
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-default ${isDarkTheme
                ? 'bg-white/5 backdrop-blur-sm border-white/10'
                : 'bg-gray-50 border-gray-200'
              }`}>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <span className="text-xs font-medium text-emerald-400">
                  System Online
                </span>
                <div className={`text-xs mt-0.5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  All services operational
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
