import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ShieldAlert,
  Smartphone,
  Link as LinkIcon,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { storage } from "../core/storage/userStorage";
import type { BlockedApp, BlockedUrl } from "../core/models";
import { DeviceControl } from "../core/capabilities/DeviceControl";

const Blocklists = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"apps" | "urls">("apps");

  const [blockedApps, setBlockedApps] = useState<BlockedApp[]>([]);
  const [blockedUrls, setBlockedUrls] = useState<BlockedUrl[]>([]);

  const [installedApps, setInstalledApps] = useState<BlockedApp[]>([]);

  // URL form state
  const [newUrlLabel, setNewUrlLabel] = useState("");
  const [newUrlValue, setNewUrlValue] = useState("");

  useEffect(() => {
    loadData();
    DeviceControl.listInstalledApps().then((apps) => setInstalledApps(apps));
  }, []);

  const loadData = () => {
    setBlockedApps(storage.get<BlockedApp[]>("blocked_apps", []));
    setBlockedUrls(storage.get<BlockedUrl[]>("blocked_urls", []));
  };

  const saveApps = (apps: BlockedApp[]) => {
    setBlockedApps(apps);
    storage.set("blocked_apps", apps);
  };

  const saveUrls = (urls: BlockedUrl[]) => {
    setBlockedUrls(urls);
    storage.set("blocked_urls", urls);
  };

  const toggleAppBlocking = (app: BlockedApp) => {
    const isBlocked = blockedApps.find((a) => a.id === app.id);
    if (isBlocked) {
      saveApps(blockedApps.filter((a) => a.id !== app.id));
    } else {
      saveApps([...blockedApps, app]);
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#0F172A] z-40 border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#F8FAFC]" />
          </button>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-lg font-semibold text-[#F8FAFC]">
              Listas de Bloqueo
            </h1>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <ShieldAlert className="w-6 h-6 text-[#EF4444]" />
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

      <main className="pt-28 pb-24 px-4 min-h-screen bg-[#0F172A]">
        <div className="max-w-md mx-auto w-full">
          {activeTab === "apps" && (
            <div className="space-y-4">
              <p className="text-sm text-[#94A3B8] text-center mb-6">
                Selecciona las aplicaciones que deseas bloquear automáticamente
                durante tus sesiones de concentración profunda o en horario
                nocturno.
              </p>

              <div className="bg-[#1E293B] rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                {installedApps.length === 0 ? (
                  <div className="p-6 text-center text-[#94A3B8]">
                    Cargando aplicaciones...
                  </div>
                ) : (
                  installedApps.map((app) => {
                    const isBlocked = blockedApps.some((a) => a.id === app.id);
                    return (
                      <div
                        key={app.id}
                        className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center border border-white/10">
                            <Smartphone className="w-5 h-5 text-[#94A3B8]" />
                          </div>
                          <div>
                            <p className="text-[#F8FAFC] font-medium">
                              {app.name}
                            </p>
                            <p className="text-xs text-[#64748B]">
                              {app.packageName}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleAppBlocking(app)}
                          className={`w-14 h-8 rounded-full transition-colors relative box-border border-2 ${
                            isBlocked
                              ? "bg-red-500/20 border-red-500/50"
                              : "bg-[#0F172A] border-white/10"
                          }`}
                        >
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full transition-all duration-300 ${
                              isBlocked
                                ? "bg-red-500 left-[calc(100%-1.5rem)]"
                                : "bg-[#64748B] left-1"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
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

      <Navbar />
    </>
  );
};

export default Blocklists;
