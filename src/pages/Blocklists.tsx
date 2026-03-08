import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Smartphone,
  Link as LinkIcon,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  PlayCircle,
  StopCircle,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { storage } from "../core/storage/userStorage";
import type { BlockedUrl } from "../core/models";
import AppMonitor from "../plugins/AppMonitor";
import type { AppInfo, BlockedApp } from "../plugins/AppMonitor";
import { App } from "@capacitor/app";

const Blocklists = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"apps" | "urls">("apps");

  const [blockedApps, setBlockedApps] = useState<BlockedApp[]>([]);
  const [blockedUrls, setBlockedUrls] = useState<BlockedUrl[]>([]);

  const [installedApps, setInstalledApps] = useState<AppInfo[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [hasUsagePermission, setHasUsagePermission] = useState(false);
  const [hasOverlayPermission, setHasOverlayPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  // URL form state
  const [newUrlLabel, setNewUrlLabel] = useState("");
  const [newUrlValue, setNewUrlValue] = useState("");
  
  // Modal state for adding apps
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const initialize = async () => {
      await checkPermissions();
      await loadData();
      await checkMonitoringStatus();
    };
    initialize();

    // Listen for app state changes (when returning from settings)
    const listener = App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        console.log("App became active, rechecking permissions and reloading data");
        await checkPermissions();
        await loadData();
        await checkMonitoringStatus();
      }
    });

    return () => {
      listener.then(l => l.remove());
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const usageResult = await AppMonitor.checkUsageStatsPermission();
      const overlayResult = await AppMonitor.checkOverlayPermission();
      setHasUsagePermission(usageResult.granted);
      setHasOverlayPermission(overlayResult.granted);
      
      // Auto-request permissions on first load if not granted
      if (!usageResult.granted) {
        console.log("Usage permission not granted, will show prompt");
      }
      if (!overlayResult.granted) {
        console.log("Overlay permission not granted, will show prompt");
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
    }
  };

  const checkMonitoringStatus = async () => {
    try {
      const result = await AppMonitor.isMonitoring();
      setIsMonitoring(result.active);
    } catch (error) {
      console.error("Error checking monitoring status:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load blocked apps from plugin
      const blockedResult = await AppMonitor.getBlockedApps();
      setBlockedApps(blockedResult.apps);

      // Load installed apps - only if we have permission
      const usageResult = await AppMonitor.checkUsageStatsPermission();
      if (usageResult.granted) {
        const installedResult = await AppMonitor.getInstalledApps();
        console.log("✅ Installed apps loaded:", installedResult.apps.length);
        console.log("📱 Sample apps:", installedResult.apps.slice(0, 5).map(a => a.appName));
        setInstalledApps(installedResult.apps);
      } else {
        console.log("Cannot load apps without usage permission");
        setInstalledApps([]);
      }

      // Load blocked URLs from storage
      setBlockedUrls(storage.get<BlockedUrl[]>("blocked_urls", []));
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const requestUsagePermission = async () => {
    try {
      console.log("Solicitando permiso de estadísticas de uso...");
      const result = await AppMonitor.requestUsageStatsPermission();
      console.log("Resultado de solicitud de permiso:", result);
      
      // Check again after a delay to see if permission was granted
      setTimeout(async () => {
        console.log("Verificando permisos después de solicitud...");
        await checkPermissions();
        await loadData(); // Reload apps after permission is granted
      }, 1500);
    } catch (error) {
      console.error("Error requesting usage permission:", error);
      alert("Error al abrir configuración de permisos: " + error);
    }
  };

  const requestOverlayPermission = async () => {
    try {
      console.log("Solicitando permiso de overlay...");
      const result = await AppMonitor.requestOverlayPermission();
      console.log("Resultado de solicitud de overlay:", result);
      
      // Check again after a delay
      setTimeout(async () => {
        console.log("Verificando permisos después de solicitud...");
        await checkPermissions();
      }, 1500);
    } catch (error) {
      console.error("Error requesting overlay permission:", error);
      alert("Error al abrir configuración de permisos: " + error);
    }
  };

  const saveApps = async (apps: BlockedApp[]) => {
    try {
      setBlockedApps(apps);
      await AppMonitor.setBlockedApps({ apps });
    } catch (error) {
      console.error("Error saving blocked apps:", error);
    }
  };

  const saveUrls = (urls: BlockedUrl[]) => {
    setBlockedUrls(urls);
    storage.set("blocked_urls", urls);
  };

  const toggleAppBlocking = (app: AppInfo) => {
    const isBlocked = blockedApps.find((a) => a.packageName === app.packageName);
    if (isBlocked) {
      saveApps(blockedApps.filter((a) => a.packageName !== app.packageName));
    } else {
      saveApps([
        ...blockedApps,
        { packageName: app.packageName, appName: app.appName },
      ]);
    }
  };

  const toggleMonitoring = async () => {
    try {
      if (isMonitoring) {
        await AppMonitor.stopMonitoring();
        setIsMonitoring(false);
      } else {
        if (!hasUsagePermission || !hasOverlayPermission) {
          alert("Por favor, otorga los permisos necesarios primero");
          return;
        }
        await AppMonitor.startMonitoring();
        setIsMonitoring(true);
      }
    } catch (error) {
      console.error("Error toggling monitoring:", error);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrlValue) return;

    let url = newUrlValue;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const newUrl: BlockedUrl = {
      id: Math.random().toString(36).substring(2, 9),
      label: newUrlLabel || url,
      url: url,
    };

    saveUrls([...blockedUrls, newUrl]);
    setNewUrlLabel("");
    setNewUrlValue("");
  };

  const handleRemoveUrl = (id: string) => {
    saveUrls(blockedUrls.filter((u) => u.id !== id));
  };

  // Filter apps that are not blocked yet
  const availableApps = installedApps.filter(
    (app) => !blockedApps.some((blocked) => blocked.packageName === app.packageName)
  );

  // Filter available apps by search query
  const filteredAvailableApps = availableApps.filter((app) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const appNameLower = app.appName.toLowerCase();
    const packageNameLower = app.packageName.toLowerCase();
    
    return appNameLower.includes(searchLower) || packageNameLower.includes(searchLower);
  });
  
  console.log("🔍 Search:", searchQuery, "Available:", availableApps.length, "Filtered:", filteredAvailableApps.length);

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
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-lg font-semibold text-[#F8FAFC]">
                Listas de Bloqueo
              </h1>
            </div>
            <button
              onClick={() => navigate("/plugin-test")}
              className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
              title="Debug Plugin"
            >
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </button>
          </div>
          <button 
            onClick={toggleMonitoring}
            className={`p-2 rounded-lg transition-colors ${
              isMonitoring 
                ? "bg-green-500/20 hover:bg-green-500/30" 
                : "bg-red-500/20 hover:bg-red-500/30"
            }`}
          >
            {isMonitoring ? (
              <StopCircle className="w-6 h-6 text-green-500" />
            ) : (
              <PlayCircle className="w-6 h-6 text-red-500" />
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex w-full px-4 border-t border-white/5">
          <button
            onClick={() => setActiveTab("apps")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex justify-center items-center gap-2 ${
              activeTab === "apps"
                ? "border-[#4B6FA7] text-[#4B6FA7]"
                : "border-transparent text-[#94A3B8] hover:text-[#e2e8f0]"
            }`}
          >
            <Smartphone className="w-4 h-4" /> Apps ({blockedApps.length})
          </button>
          <button
            onClick={() => setActiveTab("urls")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex justify-center items-center gap-2 ${
              activeTab === "urls"
                ? "border-[#4B6FA7] text-[#4B6FA7]"
                : "border-transparent text-[#94A3B8] hover:text-[#e2e8f0]"
            }`}
          >
            <LinkIcon className="w-4 h-4" /> URLs ({blockedUrls.length})
          </button>
        </div>
      </header>

      <main className="px-4 min-h-screen bg-[#0F172A] safe-content">
        <div className="max-w-md mx-auto w-full space-y-4">
          
          {/* Monitoring Status */}
          <div className={`rounded-xl p-4 border ${
            isMonitoring 
              ? "bg-green-500/10 border-green-500/30" 
              : "bg-amber-500/10 border-amber-500/30"
          }`}>
            <div className="flex items-center gap-3">
              {isMonitoring ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${isMonitoring ? "text-green-400" : "text-amber-400"}`}>
                  {isMonitoring ? "Monitoreo Activo" : "Monitoreo Inactivo"}
                </p>
                <p className="text-xs text-[#94A3B8]">
                  {isMonitoring 
                    ? "Las apps bloqueadas están siendo monitoreadas" 
                    : "Inicia el monitoreo para activar el bloqueo"}
                </p>
              </div>
            </div>
          </div>

          {/* Permissions Check */}
          {(!hasUsagePermission || !hasOverlayPermission) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-400 mb-2">Permisos Requeridos</p>
                  <div className="space-y-2 text-sm">
                    {!hasUsagePermission && (
                      <button
                        onClick={requestUsagePermission}
                        className="w-full text-left px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-[#F8FAFC] transition-colors"
                      >
                        📊 Otorgar acceso a estadísticas de uso
                      </button>
                    )}
                    {!hasOverlayPermission && (
                      <button
                        onClick={requestOverlayPermission}
                        className="w-full text-left px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-[#F8FAFC] transition-colors"
                      >
                        🔒 Permitir mostrar sobre otras apps
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "apps" && (
            <div className="space-y-4">
              <p className="text-sm text-[#94A3B8] text-center">
                Toca el botón + para agregar apps. El servicio monitoreará cuando las abras 
                y mostrará una pantalla de bloqueo.
              </p>

              {/* Blocked Apps List */}
              {blockedApps.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[#94A3B8] text-sm font-medium uppercase tracking-wider pl-1">
                    Apps Bloqueadas ({blockedApps.length})
                  </h3>
                  <div className="bg-[#1E293B] rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                    {blockedApps.map((app) => {
                      const fullAppInfo = installedApps.find((a) => a.packageName === app.packageName);
                      return (
                        <div
                          key={app.packageName}
                          className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center border border-red-500/30 shrink-0">
                              <Smartphone className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[#F8FAFC] font-medium truncate">
                                {fullAppInfo?.appName || app.appName}
                              </p>
                              <p className="text-xs text-[#64748B] truncate">
                                {app.packageName}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => saveApps(blockedApps.filter((a) => a.packageName !== app.packageName))}
                            className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all shrink-0 ml-3"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add App Button */}
              {hasUsagePermission && (
                <button
                  onClick={() => setShowAddAppModal(true)}
                  className="w-full py-4 bg-[#4B6FA7] hover:bg-[#5a7fbd] text-white font-medium rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Agregar Aplicación
                </button>
              )}

              {blockedApps.length === 0 && !loading && (
                <div className="p-6 text-center text-[#64748B] border border-dashed border-white/10 rounded-2xl">
                  {!hasUsagePermission 
                    ? "Otorga el permiso de estadísticas de uso para ver las apps"
                    : "No hay apps bloqueadas aún"}
                </div>
              )}
            </div>
          )}

          {activeTab === "urls" && (
            <div className="space-y-6">
              <div className="bg-linear-to-br from-[#131F37] to-[#1E293B] rounded-2xl p-5 border border-white/10">
                <h3 className="text-[#F8FAFC] font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#4B6FA7]" /> Nueva URL
                </h3>
                <form onSubmit={handleAddUrl} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre corto (Ej. Red Social)"
                      value={newUrlLabel}
                      onChange={(e) => setNewUrlLabel(e.target.value)}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#4B6FA7]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Dominio (Ej. instagram.com)"
                      value={newUrlValue}
                      onChange={(e) => setNewUrlValue(e.target.value)}
                      required
                      className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#4B6FA7]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#4B6FA7] hover:bg-[#5a7fbd] text-white font-medium rounded-lg transition-colors flex justify-center items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Agregar a la lista
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                <h3 className="text-[#94A3B8] text-sm font-medium uppercase tracking-wider pl-1">
                  Sitios Bloqueados
                </h3>
                {blockedUrls.length === 0 ? (
                  <div className="p-6 text-center text-[#64748B] border border-dashed border-white/10 rounded-2xl">
                    No hay sitios bloqueados
                  </div>
                ) : (
                  blockedUrls.map((urlObj) => (
                    <div
                      key={urlObj.id}
                      className="bg-[#1E293B] rounded-xl p-4 flex items-center justify-between border border-white/5"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex shrink-0 items-center justify-center">
                          <LinkIcon className="w-5 h-5 text-[#94A3B8]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[#F8FAFC] font-medium truncate">
                            {urlObj.label}
                          </p>
                          <p className="text-xs text-[#64748B] truncate">
                            {urlObj.url}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveUrl(urlObj.id)}
                        className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add App Modal */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 pb-32">
          <div className="bg-[#0F172A] w-full max-w-lg rounded-2xl max-h-[70vh] flex flex-col border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                Seleccionar Aplicación
                <span className="text-xs text-[#64748B] ml-2">
                  ({availableApps.length} disponibles)
                </span>
              </h2>
              <button
                onClick={() => {
                  setShowAddAppModal(false);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-white/10">
              <input
                type="text"
                placeholder="Buscar apps (ej: YouTube, Chrome...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#4B6FA7]"
                autoFocus
              />
            </div>

            {/* Apps List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-[#94A3B8]">
                  Cargando aplicaciones...
                </div>
              ) : filteredAvailableApps.length === 0 ? (
                <div className="p-8 text-center">
                  <Smartphone className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
                  <p className="text-[#94A3B8] mb-2">
                    {searchQuery
                      ? `No se encontraron apps con "${searchQuery}"`
                      : availableApps.length === 0
                      ? "Todas las apps ya están bloqueadas"
                      : "No hay apps disponibles"}
                  </p>
                  {searchQuery && installedApps.length > 0 && (
                    <p className="text-xs text-[#64748B]">
                      Total de apps en el dispositivo: {installedApps.length}<br />
                      Apps disponibles para bloquear: {availableApps.length}
                    </p>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredAvailableApps.map((app) => (
                    <button
                      key={app.packageName}
                      onClick={() => {
                        toggleAppBlocking(app);
                        setShowAddAppModal(false);
                        setSearchQuery("");
                      }}
                      className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center border border-white/10 shrink-0">
                        <Smartphone className="w-5 h-5 text-[#94A3B8]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[#F8FAFC] font-medium truncate">
                          {app.appName}
                        </p>
                        <p className="text-xs text-[#64748B] truncate">
                          {app.packageName}
                        </p>
                      </div>
                      <Plus className="w-5 h-5 text-[#4B6FA7] shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </>
  );
};

export default Blocklists;

