import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Trophy, Timer, Smartphone } from "lucide-react";
import { storage } from "../core/storage/userStorage";
import { defaultSettings, type SettingsModel } from "../core/models";
import { useMetrics } from "../context/MetricsContext";

const WIDGET_SIZE = 56;
const SCREEN_MARGIN = 12;
const CLICK_MAX_MS = 220;
const DRAG_THRESHOLD_PX = 6;
const MODAL_GAP = 10;
const MODAL_MAX_WIDTH = 320;
const MODAL_MIN_HEIGHT_ESTIMATE = 280;

export function ChallengeWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const { todayMetrics } = useMetrics();

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const suppressNextOpenRef = useRef(false);
  const pointerStateRef = useRef({
    startX: 0,
    startY: 0,
    startAt: 0,
    moved: false,
  });

  const [activeChallenge, setActiveChallenge] = useState<{
    key: string;
    label: string;
    progress: number;
    icon: React.ReactNode;
  } | null>(null);

  // Load settings and calculate challenge
  useEffect(() => {
    const settings = storage.get<SettingsModel>("settings", defaultSettings);

    if (settings.challenges.screenTime) {
      const progress = Math.min(
        100,
        Math.round((todayMetrics.screenActiveMs / (5 * 3600 * 1000)) * 100),
      );
      setActiveChallenge({
        key: "screenTime",
        label: "Tiempo en Pantalla",
        progress,
        icon: <Timer className="w-4 h-4" />,
      });
    } else if (settings.challenges.pickupTimes) {
      const progress = Math.min(
        100,
        Math.round(
          ((settings.pickupLimit - todayMetrics.pickups) /
            settings.pickupLimit) *
            100,
        ),
      );
      setActiveChallenge({
        key: "pickupTimes",
        label: "Recogidas",
        progress: Math.max(0, progress),
        icon: <Smartphone className="w-4 h-4" />,
      });
    } else if (settings.challenges.continuousUse) {
      const maxMsAllowed = settings.continuousUseMaxHours * 3600 * 1000;
      const progress = Math.min(
        100,
        Math.round(
          ((maxMsAllowed - todayMetrics.continuousMaxMs) / maxMsAllowed) * 100,
        ),
      );
      setActiveChallenge({
        key: "continuousUse",
        label: "Uso Continuo",
        progress: Math.max(0, progress),
        icon: <Timer className="w-4 h-4" />,
      });
    } else {
      setActiveChallenge(null);
    }
  }, [todayMetrics]);

  const clampPosition = (x: number, y: number) => {
    const maxX = window.innerWidth - WIDGET_SIZE - SCREEN_MARGIN;
    const maxY = window.innerHeight - WIDGET_SIZE - SCREEN_MARGIN;

    return {
      x: Math.max(SCREEN_MARGIN, Math.min(x, maxX)),
      y: Math.max(SCREEN_MARGIN, Math.min(y, maxY)),
    };
  };

  const getModalStyle = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const modalWidth = Math.min(MODAL_MAX_WIDTH, viewportWidth - SCREEN_MARGIN * 2);

    let left = position.x;
    let top = position.y + WIDGET_SIZE + MODAL_GAP;

    const maxLeft = viewportWidth - modalWidth - SCREEN_MARGIN;
    left = Math.max(SCREEN_MARGIN, Math.min(left, maxLeft));

    const wouldOverflowBottom = top + MODAL_MIN_HEIGHT_ESTIMATE > viewportHeight - SCREEN_MARGIN;
    if (wouldOverflowBottom) {
      top = position.y - MODAL_MIN_HEIGHT_ESTIMATE - MODAL_GAP;
    }

    const maxTop = viewportHeight - MODAL_MIN_HEIGHT_ESTIMATE - SCREEN_MARGIN;
    top = Math.max(SCREEN_MARGIN, Math.min(top, maxTop));

    return {
      left,
      top,
      width: modalWidth,
      maxWidth: MODAL_MAX_WIDTH,
      maxHeight: `calc(100vh - ${SCREEN_MARGIN * 2}px)`,
      overflowY: "auto" as const,
      zIndex: 9999,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isOpen) return;

    pointerStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startAt: Date.now(),
      moved: false,
    };

    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    setIsDragging(true);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const dx = Math.abs(e.clientX - pointerStateRef.current.startX);
      const dy = Math.abs(e.clientY - pointerStateRef.current.startY);

      if (dx > DRAG_THRESHOLD_PX || dy > DRAG_THRESHOLD_PX) {
        pointerStateRef.current.moved = true;
      }

      const newX = e.clientX - dragOffsetRef.current.x;
      const newY = e.clientY - dragOffsetRef.current.y;

      setPosition(clampPosition(newX, newY));
    };

    const handlePointerUp = () => {
      if (!isDragging) return;

      const pressDuration = Date.now() - pointerStateRef.current.startAt;
      const shouldSuppressOpen =
        pointerStateRef.current.moved || pressDuration > CLICK_MAX_MS;

      suppressNextOpenRef.current = shouldSuppressOpen;

      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const onResize = () => {
      setPosition((prev) => clampPosition(prev.x, prev.y));
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Don't show on certain pages
  const hiddenPages = ["/focus"];
  if (hiddenPages.includes(location.pathname)) {
    return null;
  }

  if (!activeChallenge) return null;

  return (
    <>
      {/* Blur overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xl pointer-events-auto"
          style={{ zIndex: 9998 }}
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Widget */}
      {!isOpen && (
        <div
          ref={widgetRef}
          className="fixed select-none pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 9999,
          }}
        >
          <button
            onPointerDown={handlePointerDown}
            onClick={(event) => {
              event.stopPropagation();
              if (suppressNextOpenRef.current) {
                suppressNextOpenRef.current = false;
                return;
              }
              setIsOpen(true);
            }}
            className="pointer-events-auto w-14 h-14 rounded-full bg-linear-to-br from-[#4B6FA7] to-[#5a7fbd] shadow-lg hover:shadow-xl hover:shadow-[#4B6FA7]/40 transition-all duration-200 flex items-center justify-center border border-white/10 backdrop-blur-sm hover:scale-110 cursor-grab active:cursor-grabbing touch-none"
          >
            <Trophy className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {/* Open State - Challenge Details */}
      {isOpen && (
        <div
          className="fixed bg-linear-to-br from-[#1E293B]/90 to-[#131F37]/90 rounded-2xl p-4 shadow-2xl border border-white/10 backdrop-blur-md pointer-events-auto"
          style={getModalStyle()}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#4B6FA7]" />
                <h3 className="font-bold text-[#F8FAFC] text-sm">
                  Desafío Activo
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-[#F8FAFC]" />
              </button>
            </div>

            {/* Challenge Content */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {activeChallenge.icon}
                  <span className="text-sm font-semibold text-[#F8FAFC]">
                    {activeChallenge.label}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#4B6FA7] to-[#7FD3FF] rounded-full transition-all duration-300"
                    style={{ width: `${activeChallenge.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-[#94A3B8]">Progreso</span>
                  <span className="text-sm font-bold text-[#4B6FA7]">
                    {activeChallenge.progress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => {
                navigate("/settings");
                setIsOpen(false);
              }}
              className="w-full py-2 rounded-lg bg-linear-to-r from-[#4B6FA7] to-[#5a7fbd] text-white text-xs font-semibold hover:shadow-lg hover:shadow-[#4B6FA7]/30 transition-all duration-200"
            >
              Ver Desafíos
            </button>
        </div>
      )}
    </>
  );
}
