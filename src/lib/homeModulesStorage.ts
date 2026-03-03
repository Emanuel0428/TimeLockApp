// Configuration for home screen modules
// Only persists to localStorage when user explicitly changes settings
// Falls back to defaults when cache is cleared

export type ModuleKey =
  | "pickups"
  | "averageUse"
  | "walkingUse"
  | "stationaryLife"
  | "unlockAdvance"
  | "continuousUse";

export interface ModuleConfig {
  pickups: boolean;
  averageUse: boolean;
  walkingUse: boolean;
  stationaryLife: boolean;
  unlockAdvance: boolean;
  continuousUse: boolean;
}

const DEFAULT_MODULES: ModuleConfig = {
  pickups: true,
  averageUse: true,
  walkingUse: true,
  stationaryLife: true,
  unlockAdvance: true,
  continuousUse: true,
};

const STORAGE_KEY = "homeModulesConfig";

export const homeModulesStorage = {
  /**
   * Get current module configuration
   * Returns defaults if nothing saved
   */
  getConfig(): ModuleConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as ModuleConfig;
      }
    } catch (error) {
      console.error("Error reading home modules config:", error);
    }
    return { ...DEFAULT_MODULES };
  },

  /**
   * Save module configuration to localStorage
   * Only called when user explicitly changes settings
   */
  saveConfig(config: ModuleConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error("Error saving home modules config:", error);
    }
  },

  /**
   * Get default configuration
   */
  getDefaults(): ModuleConfig {
    return { ...DEFAULT_MODULES };
  },

  /**
   * Reset to defaults
   */
  reset(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error resetting home modules config:", error);
    }
  },

  /**
   * Get all available modules with names for UI
   */
  getAvailableModules(): Array<{
    key: ModuleKey;
    label: string;
    description: string;
    icon: string;
  }> {
    return [
      {
        key: "pickups",
        label: "Recogidas",
        description: "Total de veces que levantaste el teléfono",
        icon: "📱",
      },
      {
        key: "averageUse",
        label: "Uso Promedio",
        description: "Tiempo promedio de uso en pantalla",
        icon: "📊",
      },
      {
        key: "walkingUse",
        label: "Mientras Caminas",
        description: "Tiempo usando el teléfono mientras caminas",
        icon: "👣",
      },
      {
        key: "stationaryLife",
        label: "Vida Estacionaria",
        description: "Tiempo con teléfono sin movimiento",
        icon: "🪑",
      },
      {
        key: "unlockAdvance",
        label: "Adelantar Bloqueos",
        description: "Desbloquea apps usando tokens",
        icon: "🔓",
      },
      {
        key: "continuousUse",
        label: "Uso Continuo",
        description: "Máximo tiempo continuo de uso",
        icon: "⏱️",
      },
    ];
  },
};
