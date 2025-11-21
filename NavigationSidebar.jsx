import { useState } from "react";
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
} from "lucide-react";
import { useTranslation } from './src/hooks/useTranslation'

export default function NavigationSidebar({
  activeSection = "dashboard",
  onSectionChange,
  items, // ✅ new dynamic prop
}) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div
      className={`bg-black/30 backdrop-blur-md border-r border-white/10 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Shield className="h-8 w-8 text-emerald-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">SecureGuard</h2>
                <p className="text-xs text-emerald-400">AI Fraud Detection</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange && onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/25"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
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

      {/* Compact Status Indicator */}
      <div className="p-4 border-t border-white/10">
        {isCollapsed ? (
          <div className="flex justify-center">
            <div
              className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
              title="System Online"
            ></div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 cursor-default">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <span className="text-xs font-medium text-emerald-400">
                System Online
              </span>
              <div className="text-xs text-gray-400 mt-0.5">
                All services operational
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
