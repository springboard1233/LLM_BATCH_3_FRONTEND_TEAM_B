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

export default function NavigationSidebar({
  activeSection = "dashboard",
  onSectionChange,
  items,
  isMobileMenuOpen = false,
  onMobileMenuClose,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = items && items.length > 0 ? items : [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "fraud-detection", label: "Fraud Detection", icon: Shield },
    { id: "risk-management", label: "Risk Management", icon: AlertTriangle },
    { id: "customers", label: "Customers", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "data", label: "Data", icon: Database },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavigationClick = (sectionId) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
    if (isMobileMenuOpen && onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:relative inset-y-0 left-0 z-50
        ${isCollapsed ? 'w-16' : 'w-64'}
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-emerald-500" />
                <div>
                  <h2 className="text-lg font-bold">SecureGuard</h2>
                  <p className="text-xs text-emerald-500">AI Fraud Detection</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigationClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {Icon && <Icon className="w-6 h-6 flex-shrink-0" />}
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Status */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div>
                <span className="text-xs font-medium text-emerald-400">System Online</span>
                <div className="text-xs text-gray-600 dark:text-gray-400">All services operational</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
