import { useState, useEffect } from "react";
import QuickAccess from "../components/QuickAccess";
import Navbar from "../components/Navbar";
import { storage } from "../core/storage/userStorage";
import { SettingsModel, defaultSettings } from "../core/models";
import {
  ChevronRight,
  Settings2,
  Smartphone,
  MonitorSmartphone,
  X,
  Link as LinkIcon,
  Save,
  Moon,
  Activity,
  MapPin,
} from "lucide-react";
import { DeviceControl } from "../core/capabilities/DeviceControl";

type ModalType =
  | "none"
  | "screenTime"
  | "pickupTimes"
  | "sleepMore"
  | "continuousUse"
  | "noWalkingGame";

const Settings = () => {
  const [settings, setSettings] = useState<SettingsModel>(defaultSettings);
  const [activeModal, setActiveModal] = useState<ModalType>("none");

  // For specific config modals
  const [tempPickupLimit, setTempPickupLimit] = useState(
    defaultSettings.pickupLimit,
  );
  const [tempContinuousHours, setTempContinuousHours] = useState(
    defaultSettings.continuousUseMaxHours,
  );
  const [tempContinuousLockMinutes, setTempContinuousLockMinutes] = useState(
    defaultSettings.continuousUseLockMinutes,
  );

  // Mock apps for UI
  const [installedApps, setInstalledApps] = useState<any[]>([]);

  useEffect(() => {
    // Load settings from storage
    const loaded = storage.get<SettingsModel>("settings", defaultSettings);
    setSettings({ ...defaultSettings, ...loaded });

    // Load mock apps for the selector
    DeviceControl.listInstalledApps().then((apps) => setInstalledApps(apps));
  }, []);

  const saveSettings = (newSettings: SettingsModel) => {
    setSettings(newSettings);
    storage.set("settings", newSettings);
  };

  const toggleChallenge = (key: keyof SettingsModel["challenges"]) => {
    const newSettings = {
      ...settings,
      challenges: {
        ...settings.challenges,
        [key]: !settings.challenges[key],
      },
    };
    saveSettings(newSettings);

    // If enabling some challenges, open the config modal directly
    if (newSettings.challenges[key]) {
      if (
        key === "screenTime" ||
        key === "pickupTimes" ||
        key === "sleepMore" ||
        key === "continuousUse"
      ) {
        setActiveModal(key as ModalType);
      }
    }
  };

  const handleSaveConfig = () => {
    const newSettings = { ...settings };
    if (activeModal === "pickupTimes") {
      newSettings.pickupLimit = tempPickupLimit;
    } else if (activeModal === "continuousUse") {
      newSettings.continuousUseMaxHours = tempContinuousHours;
      newSettings.continuousUseLockMinutes = tempContinuousLockMinutes;
    }

    saveSettings(newSettings);
    setActiveModal("none");
  };

  const openConfigModal = (e: React.MouseEvent, type: ModalType) => {
    e.stopPropagation();

    // Init temp state
    if (type === "pickupTimes") setTempPickupLimit(settings.pickupLimit);
    if (type === "continuousUse") {
      setTempContinuousHours(settings.continuousUseMaxHours);
      setTempContinuousLockMinutes(settings.continuousUseLockMinutes);
    }

    setActiveModal(type);
  };

  // Render a toggle-row that behaves like a button to open modal (if enabled)
  const ChallengeItem = ({
    title,
    challengeKey,
    hasConfigModal = false,
    modalType = "none",
  }: {
    title: string;
    challengeKey: keyof SettingsModel["challenges"];
    hasConfigModal?: boolean;
    modalType?: ModalType;
  }) => {
    const isEnabled = settings.challenges[challengeKey];

    return (
      <div className="w-full bg-[#1E293B] rounded-2xl flex items-center justify-between hover:bg-[#2D3E52] transition-colors border border-white/5 overflow-hidden">
        <button
          onClick={() => toggleChallenge(challengeKey)}
          className="flex-1 p-4 flex justify-between items-center text-left"
        >
          <span className="text-[#F8FAFC] font-medium">{title}</span>
          <div
            className={`w-12 h-6 rounded-full transition-colors duration-300 ${
              isEnabled ? "bg-[#4B6FA7]" : "bg-[#64748B]"
            } relative`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                isEnabled ? "transform translate-x-6" : ""
              }`}
            ></div>
          </div>
        </button>

        {hasConfigModal && (
          <button
            onClick={(e) => openConfigModal(e, modalType)}
            disabled={!isEnabled}
            className={`p-4 border-l border-white/10 ${isEnabled ? "text-[#4B6FA7] hover:bg-white/5" : "text-gray-600"}`}
          >
            <Settings2 className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <QuickAccess />

      <main className="pt-16 pb-24 px-4 min-h-screen bg-[#0F172A]">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-6 text-center">
            Configuración
          </h1>

          <div className="bg-linear-to-br from-[#131F37] to-[#1E293B] rounded-2xl p-6 mb-6 text-center border border-[#4B6FA7]/30 shadow-lg shadow-[#4B6FA7]/10">
            <h2 className="text-[#F8FAFC] text-lg font-bold mb-2">
              Personaliza tus retos
            </h2>
            <p className="text-[#94A3B8] text-sm mb-4">
              Habilita los desafíos y configura sus reglas en el icono ⚙️
            </p>
          </div>

          <div className="space-y-3">
            <ChallengeItem
              title="Desafío tiempo en pantalla"
              challengeKey="screenTime"
              hasConfigModal={true}
              modalType="screenTime"
            />
            <ChallengeItem
              title="Desafío tiempos de recogida"
              challengeKey="pickupTimes"
              hasConfigModal={true}
              modalType="pickupTimes"
            />
            <ChallengeItem
              title="Desafío dormir más"
              challengeKey="sleepMore"
              hasConfigModal={true}
              modalType="sleepMore"
            />
            <ChallengeItem
              title="Desafío de uso continuo"
              challengeKey="continuousUse"
              hasConfigModal={true}
              modalType="continuousUse"
            />
            <ChallengeItem
              title="No juegues mientras caminas"
              challengeKey="noWalkingGame"
              hasConfigModal={false}
            />
            <ChallengeItem
              title="Informe diario de información"
              challengeKey="dailyReport"
              hasConfigModal={false}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1E293B] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#0F172A]">
              <h3 className="text-[#F8FAFC] font-bold text-lg">
                {activeModal === "screenTime" && "Bloqueo Categórico"}
                {activeModal === "pickupTimes" && "Meta de Recogidas"}
                {activeModal === "sleepMore" && "Modo Dormir (22:00 - 05:00)"}
                {activeModal === "continuousUse" && "Límite de Uso Continuo"}
              </h3>
              <button
                onClick={() => setActiveModal("none")}
                className="text-[#94A3B8] hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto">
              {/* ScreenTime Modal */}
              {activeModal === "screenTime" && (
                <div className="space-y-6">
                  <p className="text-sm text-[#94A3B8]">
                    Selecciona qué elementos se bloquearán automáticamente
                    durante tus sesiones de concentración.
                  </p>

                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-white/5 hover:border-[#4B6FA7]/50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#4B6FA7]/20 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-[#4B6FA7]" />
                        </div>
                        <div className="text-left">
                          <p className="text-[#F8FAFC] font-medium">
                            Aplicaciones Móviles
                          </p>
                          <p className="text-xs text-[#94A3B8]">
                            {installedApps.length} apps detectadas
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#64748B] group-hover:text-white" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-white/5 hover:border-[#4B6FA7]/50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#4B6FA7]/20 flex items-center justify-center">
                          <LinkIcon className="w-5 h-5 text-[#4B6FA7]" />
                        </div>
                        <div className="text-left">
                          <p className="text-[#F8FAFC] font-medium">
                            Sitios Web (URLs)
                          </p>
                          <p className="text-xs text-[#94A3B8]">
                            Configurar dominios
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#64748B] group-hover:text-white" />
                    </button>
                  </div>
                  <p className="text-xs text-[#64748B] text-center mt-4">
                    * La configuración de listas de bloqueo se gestiona en otro
                    panel de la interfaz.
                  </p>
                </div>
              )}

              {/* Pickup Times Modal */}
              {activeModal === "pickupTimes" && (
                <div className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#4B6FA7]/20 flex items-center justify-center border-4 border-[#0F172A]">
                      <MonitorSmartphone className="w-8 h-8 text-[#4B6FA7]" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-[#94A3B8] mb-4">
                      Establece un límite diario. Un desbloqueo exitoso se
                      considera 1 recogida. Si mantienes tus recogidas por
                      debajo del límite, ¡ganarás tokens!
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() =>
                          setTempPickupLimit(Math.max(5, tempPickupLimit - 5))
                        }
                        className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center hover:bg-[#4B6FA7] transition-colors"
                      >
                        -
                      </button>
                      <span className="text-3xl font-bold text-[#F8FAFC] w-16">
                        {tempPickupLimit}
                      </span>
                      <button
                        onClick={() => setTempPickupLimit(tempPickupLimit + 5)}
                        className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center hover:bg-[#4B6FA7] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sleep More Modal */}
              {activeModal === "sleepMore" && (
                <div className="space-y-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Moon className="w-8 h-8 text-indigo-400" />
                    </div>
                  </div>
                  <div className="p-4 bg-[#0F172A] rounded-xl border border-indigo-500/20">
                    <p className="text-sm font-medium text-white mb-2">
                      ¿Cómo funciona?
                    </p>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Entre las 22:00 y las 05:00, las apps y URLs de tu lista
                      de bloqueo nocturno quedarán restringidas. Sólo podrás
                      acceder a ellas gastando Tokens de la Tienda.
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm text-indigo-300">
                      <span>Inicio: 22:00</span>
                      <span>Fin: 05:00</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Continuous Use Modal */}
              {activeModal === "continuousUse" && (
                <div className="space-y-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                  <p className="text-sm text-[#94A3B8] text-center mb-6">
                    Evita la fatiga visual. Si usas la pantalla continuamente
                    sin descanso, la app forzará un bloqueo temporal.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-[#0F172A] p-4 rounded-xl">
                      <label className="text-xs font-semibold text-[#94A3B8] block mb-2 uppercase tracking-wider">
                        Límite de Horas Continuas
                      </label>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">
                          {tempContinuousHours}h
                        </span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.5"
                          value={tempContinuousHours}
                          onChange={(e) =>
                            setTempContinuousHours(parseFloat(e.target.value))
                          }
                          className="w-2/3 accent-red-500"
                        />
                      </div>
                    </div>

                    <div className="bg-[#0F172A] p-4 rounded-xl">
                      <label className="text-xs font-semibold text-[#94A3B8] block mb-2 uppercase tracking-wider">
                        Minutos de Bloqueo Penalización
                      </label>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">
                          {tempContinuousLockMinutes}m
                        </span>
                        <input
                          type="range"
                          min="5"
                          max="60"
                          step="5"
                          value={tempContinuousLockMinutes}
                          onChange={(e) =>
                            setTempContinuousLockMinutes(
                              parseInt(e.target.value),
                            )
                          }
                          className="w-2/3 accent-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-[#0F172A] flex justify-end gap-3">
              <button
                onClick={() => setActiveModal("none")}
                className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-5 py-2 bg-[#4B6FA7] hover:bg-[#5a7fbd] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </>
  );
};

export default Settings;
