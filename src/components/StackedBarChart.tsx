interface BarSeries {
  name: string;
  values: number[];
  color: string;
}

interface StackedBarChartProps {
  labels: string[];
  series: BarSeries[];
  maxY?: number;
  height?: number;
}

/**
 * Lightweight SVG stacked-bar chart — zero dependencies.
 * Each bar stacks multiple series on top of each other.
 */
const StackedBarChart = ({
  labels,
  series,
  maxY: maxYProp,
  height = 200,
}: StackedBarChartProps) => {
  const width = 320;
  const padding = { top: 20, right: 10, bottom: 50, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Compute max across all stacked totals
  const stackedTotals = labels.map((_, i) =>
    series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0),
  );
  const computedMaxY = Math.max(...stackedTotals, 0.1);
  const safeMaxY = maxYProp && maxYProp > 0 ? maxYProp : computedMaxY;

  const barGap = 6;
  const barWidth = Math.max(
    8,
    (chartW - barGap * labels.length) / labels.length,
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Y-axis grid + labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = padding.top + chartH * (1 - frac);
        const label = (safeMaxY * frac).toFixed(1);
        return (
          <g key={frac}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#1E293B"
              strokeWidth="1"
            />
            <text
              x={padding.left - 6}
              y={y + 4}
              textAnchor="end"
              fill="#64748B"
              fontSize="9"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Stacked bars */}
      {labels.map((lbl, i) => {
        const x = padding.left + i * (barWidth + barGap) + barGap / 2;
        let yBottom = padding.top + chartH; // baseline

        return (
          <g key={i}>
            {series.map((s, si) => {
              const val = s.values[i] ?? 0;
              const barH = (val / safeMaxY) * chartH;
              const y = yBottom - barH;
              yBottom = y; // next segment starts on top of this one

              return (
                <rect
                  key={si}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(0, barH)}
                  rx={si === series.length - 1 ? 3 : 0}
                  fill={s.color}
                  opacity={0.85}
                  style={{
                    transition: "height 0.4s ease, y 0.4s ease",
                  }}
                />
              );
            })}
            {/* X label */}
            <text
              x={x + barWidth / 2}
              y={height - padding.bottom + 14}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="8"
            >
              {lbl}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      {series.map((s, i) => {
        const legendX = padding.left + i * 90;
        const legendY = height - 6;
        return (
          <g key={i}>
            <rect
              x={legendX}
              y={legendY - 7}
              width={8}
              height={8}
              rx={2}
              fill={s.color}
            />
            <text x={legendX + 12} y={legendY} fill="#94A3B8" fontSize="8">
              {s.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default StackedBarChart;

export type { BarSeries, StackedBarChartProps };
