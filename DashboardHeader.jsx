import { useState, useEffect } from "react";
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
} from "lucide-react";
import SettingsPanel from './src/components/SettingsPanel'
import { useTranslation } from './src/hooks/useTranslation'

export default function DashboardHeader({
  onRefresh,
  lastUpdated,
  transactions = [],
  onBackToLanding,
  rightContent, // ✅ Merged new prop
}) {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
      if (event.key === "Escape" && showNotifications) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showNotifications]);

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4 relative z-10">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{t("app.title")}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span
                  className={`text-sm ${
                    isOnline ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isOnline ? t("app.connected") : t("app.offline")}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                {t("app.lastUpdated")}:{" "}
                {lastUpdated
                  ? new Date(lastUpdated).toLocaleTimeString()
                  : t("app.never")}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Clock */}
          <div className="text-sm text-gray-300">
            {currentTime.toLocaleString()}
          </div>

          {/* Back to Landing */}
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors border border-white/10"
            >
              <Home className="w-4 h-4" />
              <span>{t("app.home")}</span>
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-300" />
          </button>

          {/* ✅ Insert rightContent (LiveToggle, etc.) */}
          {rightContent && <div className="flex items-center">{rightContent}</div>}

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            title="Open settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
            <User className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">
              {t("app.adminUser")}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {showNotifications && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-end pt-16 pr-6">
          <div
            className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          />
          <div className="relative w-80 bg-black/80 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 ring-1 ring-white ring-opacity-10">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {t("notifications.title")}
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {t("notifications.noNotifications")}
                </div>
              ) : (
                notifications.map((n) => {
                  const getIcon = (type) => {
                    switch (type) {
                      case "error":
                        return <AlertTriangle className="w-5 h-5 text-red-500" />;
                      case "warning":
                        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
                      case "success":
                        return <CheckCircle className="w-5 h-5 text-green-500" />;
                      default:
                        return <Info className="w-5 h-5 text-blue-500" />;
                    }
                  };
                  return (
                    <div
                      key={n.id}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
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
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-sm font-medium ${
                                n.read ? "text-gray-600" : "text-gray-900"
                              }`}
                            >
                              {n.title}
                            </p>
                            {!n.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p
                            className={`text-sm mt-1 ${
                              n.read ? "text-gray-500" : "text-gray-700"
                            }`}
                          >
                            {n.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, read: true }))
                  )
                }
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {t("notifications.markAllRead")}
              </button>
              <button
                onClick={() => setNotifications([])}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
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
