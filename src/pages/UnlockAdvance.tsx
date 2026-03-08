import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Unlock,
  Coins,
  ShoppingBag,
  Clock,
  ShieldAlert,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useMetrics } from "../context/MetricsContext";
import { TokenService } from "../core/tokens/TokenService";
import { NotificationService } from "../core/notifications/NotificationService";
import { storage } from "../core/storage/userStorage";

type UnlockOption = "1h" | "24h" | null;

const UnlockAdvance = () => {
  const navigate = useNavigate();
  const { tokenBalance, refreshBalance } = useMetrics();
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<UnlockOption>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Verificamos si ya hay un desbloqueo activo
  const [activeUnlockUntil, setActiveUnlockUntil] = useState<number | null>(
    null,
  );

  useEffect(() => {
    refreshBalance();
    const activeUntil = storage.get<number>("active_unlock_until", 0);
    if (activeUntil > Date.now()) {
      setActiveUnlockUntil(activeUntil);
    } else {
      setActiveUnlockUntil(null);
    }
  }, [refreshBalance]);

  const handleOpenModal = (option: UnlockOption) => {
    const requiredTokens = option === "1h" ? 1 : 5;
    const latestBalance = TokenService.getBalance();

    if (latestBalance < requiredTokens) {
      refreshBalance();
      alert("No tienes suficientes tokens para esta operación.");
      return;
    }

    setSelectedOption(option);
    setShowModal(true);
  };

  const handleConfirmUnlock = () => {
    if (!selectedOption || isProcessing) return;

    const cost = selectedOption === "1h" ? 1 : 5;
    const durationMs = selectedOption === "1h" ? 3600 * 1000 : 24 * 3600 * 1000;
    const latestBalance = TokenService.getBalance();

    if (latestBalance < cost) {
      refreshBalance();
      alert("No tienes suficientes tokens para esta operación.");
      setShowModal(false);
      return;
    }

    // Anti-double-redeem: block if any unlock is currently active
    if (activeUnlockUntil && activeUnlockUntil > Date.now()) {
      setErrorMsg("Ya tienes un desbloqueo activo. Espera a que expire.");
      return;
    }

    // Validate balance from namespaced ledger
    const currentBalance = TokenService.getBalance();
    if (currentBalance < cost) {
      setErrorMsg(
        `No tienes suficientes tokens. Necesitas ${cost}, tienes ${currentBalance}.`,
      );
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const success = TokenService.spendTokens(
      cost,
      `Desbloqueo temporal (${selectedOption})`,
    );

    if (success) {
      // Activar desbloqueo
      const newUntil = Date.now() + durationMs;
      storage.set("active_unlock_until", newUntil);
      setActiveUnlockUntil(newUntil);
      refreshBalance();
      setShowModal(false);

      NotificationService.send("¡Desbloqueo Activado!", {
        body: `Has desbloqueado tus aplicaciones por ${selectedOption}. Usa este tiempo sabiamente.`,
        type: "SYSTEM",
      });
    } else {
      setErrorMsg("No tienes suficientes tokens para esta operación.");
    }

    setIsProcessing(false);
  };

  const formatRemainingTime = (until: number) => {
    const remainingMs = until - Date.now();
    if (remainingMs <= 0) return "Expirado";
    const h = Math.floor(remainingMs / 3600000);
    const m = Math.floor((remainingMs % 3600000) / 60000);
    return `${h}h ${m}m restantes`;
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0F172A] z-40 border-b border-white/10 safe-header">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#F8FAFC]" />
          </button>
          <h1 className="text-lg font-semibold text-[#F8FAFC]">
            Adelantar Bloqueos
          </h1>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Unlock className="w-6 h-6 text-[#4B6FA7]" />
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="px-4 min-h-screen bg-[#0F172A] safe-content">
        <div className="max-w-md mx-auto w-full">
          {/* Tokens disponibles */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 px-6 py-3 rounded-full border border-white/10">
              <Coins className="w-5 h-5 text-[#F8FAFC]" />
              <span className="text-2xl font-bold text-[#F8FAFC]">
                {tokenBalance}
              </span>
              <span className="text-sm text-[#94A3B8]">tokens</span>
            </div>
          </div>

          {activeUnlockUntil ? (
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 mb-8 text-center">
              <Unlock className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">
                Desbloqueo Activo
              </h2>
              <p className="text-green-300 font-medium text-lg">
                {formatRemainingTime(activeUnlockUntil)}
              </p>
              <p className="text-sm text-[#94A3B8] mt-4">
                No necesitas gastar más tokens por ahora.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-[#F8FAFC] mb-2 px-1">
                Opciones de Desbloqueo
              </h2>

              <button
                onClick={() => handleOpenModal("1h")}
                disabled={tokenBalance < 1}
                className={`w-full text-left bg-[#1E293B] hover:bg-[#2D3E52] border border-white/5 rounded-2xl p-4 transition-colors flex items-center justify-between ${
                  tokenBalance < 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#4B6FA7]/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#4B6FA7]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">
                      Desbloqueo 1 Hora
                    </h3>
                    <p className="text-sm text-[#94A3B8]">
                      Pausa temporal de bloqueos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0F172A] px-3 py-1.5 rounded-full border border-white/10">
                  <span className="text-white font-bold">1</span>
                  <Coins className="w-4 h-4 text-yellow-400" />
                </div>
              </button>

              <button
                onClick={() => handleOpenModal("24h")}
                disabled={tokenBalance < 5}
                className={`w-full text-left bg-linear-to-r from-[#1E293B] to-[#2a1b3d] hover:from-[#2D3E52] hover:to-[#3d2757] border border-purple-500/20 rounded-2xl p-4 transition-colors flex items-center justify-between ${
                  tokenBalance < 5 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">
                      Pase de 24 Horas
                    </h3>
                    <p className="text-sm text-[#94A3B8]">Día libre completo</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0F172A] px-3 py-1.5 rounded-full border border-white/10">
                  <span className="text-white font-bold">5</span>
                  <Coins className="w-4 h-4 text-yellow-400" />
                </div>
              </button>
            </div>
          )}

          {/* Cómo ganar tokens */}
          <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 mb-6 border border-white/10">
            <h3 className="text-base font-semibold text-[#F8FAFC] mb-4">
              ¿Cómo ganar más tokens?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#4B6FA7] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">🎯</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F8FAFC]">
                    Completa una sesión de concentración
                  </p>
                  <p className="text-xs text-[#94A3B8]">25 minutos = 1 token</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-600/80 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">📱</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F8FAFC]">
                    Menos de 50 recogidas al día
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    +2 tokens al final del día
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-orange-600/80 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">👟</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F8FAFC]">
                    10,000 pasos en el día
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    +5 tokens al final del día
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-600/80 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">⏱️</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F8FAFC]">
                    Menos de 5 horas de pantalla
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    +1 token al final del día
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#1E293B] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-cyan-600/80 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">🔥</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F8FAFC]">
                    Racha de 30 minutos continua
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    +1 token por cada 30 min
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-[#94A3B8]">o</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Botón para comprar tokens */}
          <button
            onClick={() => navigate("/token-shop")}
            className="w-full py-4 rounded-xl font-semibold text-white bg-linear-to-r from-[#4B6FA7] to-[#6B8FD7] hover:shadow-lg hover:shadow-[#4B6FA7]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Comprar Tokens
          </button>
        </div>
      </main>

      {/* Modal Confirmación */}
      {showModal && selectedOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1E293B] rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl overflow-hidden text-center p-6">
            <div className="w-16 h-16 rounded-full bg-[#4B6FA7]/20 flex items-center justify-center mx-auto mb-4">
              <Unlock className="w-8 h-8 text-[#4B6FA7]" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Confirmar Canje
            </h3>
            <p className="text-[#94A3B8] text-sm mb-6">
              ¿Estás seguro de que quieres gastar{" "}
              <strong className="text-white">
                {selectedOption === "1h" ? "1 token" : "5 tokens"}
              </strong>{" "}
              para desbloquear todas tus aplicaciones por{" "}
              <strong className="text-white">{selectedOption}</strong>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setErrorMsg(null);
                }}
                className="flex-1 py-3 bg-[#0F172A] text-white font-medium rounded-xl hover:bg-[#131F37] transition-colors border border-white/5"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUnlock}
                disabled={isProcessing}
                className={`flex-1 py-3 bg-[#4B6FA7] text-white font-bold rounded-xl hover:bg-[#5a7fbd] transition-colors shadow-lg shadow-[#4B6FA7]/20 flex items-center justify-center gap-2 ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isProcessing ? "Procesando..." : "Desbloquear"}
              </button>
            </div>
            {errorMsg && (
              <p className="text-red-400 text-xs text-center mt-3">
                {errorMsg}
              </p>
            )}
          </div>
        </div>
      )}

      <Navbar />
    </>
  );
};

export default UnlockAdvance;
