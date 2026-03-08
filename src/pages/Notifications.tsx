import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, BellRing, Check, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { NotificationService } from "../core/notifications/NotificationService";
import type { NotificationItem } from "../core/models";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    loadNotifications();
    // Also request permissions just in case user opens this view directly
    NotificationService.requestPermission();
  }, []);

  const loadNotifications = () => {
    setNotifications(NotificationService.getHistory());
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead();
    loadNotifications();
  };

  const handleClearHistory = () => {
    if (window.confirm("¿Seguro que deseas borrar todo el historial?")) {
      NotificationService.clearHistory();
      loadNotifications();
    }
  };

  const formatTime = (ms: number) => {
    const date = new Date(ms);
    return date.toLocaleString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "POMODORO":
        return <span className="w-2 h-2 rounded-full bg-green-500"></span>;
      case "WARNING":
        return <span className="w-2 h-2 rounded-full bg-yellow-500"></span>;
      case "CHALLENGE":
        return <span className="w-2 h-2 rounded-full bg-[#A855F7]"></span>;
      default:
        return <span className="w-2 h-2 rounded-full bg-[#4B6FA7]"></span>;
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#0F172A] z-40 border-b border-white/10 safe-header">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#F8FAFC]" />
          </button>
          <h1 className="text-lg font-semibold text-[#F8FAFC]">
            Notificaciones
          </h1>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Bell className="w-6 h-6 text-[#4B6FA7]" />
          </button>
        </div>
      </header>

      <main className="px-4 min-h-screen bg-[#0F172A] safe-content">
        <div className="max-w-md mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-[#1E293B] hover:bg-[#2D3E52] text-sm text-[#F8FAFC] rounded-lg transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Marcar todas
            </button>
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-sm text-red-400 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Limpiar
            </button>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-10 bg-[#1E293B] rounded-2xl border border-white/10">
                <BellRing className="w-12 h-12 text-[#64748B] mx-auto mb-4 opacity-50" />
                <p className="text-[#94A3B8]">No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.readAt) {
                      NotificationService.markAsRead(notif.id);
                      loadNotifications();
                    }
                  }}
                  className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                    notif.readAt
                      ? "bg-[#131F37] border-white/5 opacity-70"
                      : "bg-[#1E293B] border-white/10 shadow-lg"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getIconForType(notif.type)}
                      <h3
                        className={`font-medium ${notif.readAt ? "text-[#94A3B8]" : "text-[#F8FAFC]"}`}
                      >
                        {notif.title}
                      </h3>
                    </div>
                    <span className="text-xs text-[#64748B]">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed ml-4 border-l-2 border-white/5 pl-3 py-1">
                    {notif.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Navbar />
    </>
  );
};

export default Notifications;
