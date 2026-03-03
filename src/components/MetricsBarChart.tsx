/**
 * @file MetricsBarChart.tsx
 * @description Componente reutilizable de gráfico de barras para métricas.
 *
 * Envuelve el componente MiniChart con un contenedor estilizado que incluye:
 * - Fondo con gradiente y borde sutil
 * - Leyenda descriptiva debajo del gráfico (caption)
 * - Indicador de máximo histórico del eje Y (yMaxLabel)
 *
 * Usado en Pickups.tsx, AverageUse.tsx y ContinuousUse.tsx.
 */
import MiniChart from "./MiniChart";
import type { TabType } from "../lib/dateHelpers";

interface MetricsBarChartProps {
  labels: string[];
  values: number[];
  maxY: number;
  yUnit: string; // "h" or ""
  caption: string; // e.g. "Recogidas por día de la semana"
  activeTab: TabType;
  yMaxLabel?: string; // e.g. "Eje Y máx: 10h (máximo histórico)"
}

/**
 * Styled chart container wrapping MiniChart.
 * Replicates the exact styling from AverageUse.tsx (bg-linear gradient, border, caption, maxY legend).
 */
const MetricsBarChart = ({
  labels,
  values,
  maxY,
  yUnit,
  caption,
  activeTab,
  yMaxLabel,
}: MetricsBarChartProps) => {
  const defaultLabel = `Eje Y máx: ${maxY.toFixed(1)}${yUnit} (máximo histórico)`;

  return (
    <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-4 mb-6 border border-white/10">
      <MiniChart
        labels={labels}
        values={values}
        maxY={maxY}
        color="#4B6FA7"
        height={220}
        barMode={activeTab === "Semana" || activeTab === "Mes"}
      />
      <div className="text-center mt-2 pt-3 border-t border-white/10">
        <p className="text-xs text-[#94A3B8]">{caption}</p>
        <p className="text-[10px] text-[#64748B] mt-1">
          {yMaxLabel || defaultLabel}
        </p>
      </div>
    </div>
  );
};

export default MetricsBarChart;
