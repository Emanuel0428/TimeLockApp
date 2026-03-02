interface MiniChartProps {
  labels: string[];
  values: number[];
  maxY: number;
  color?: string;
  height?: number;
  barMode?: boolean;
}

/**
 * Lightweight SVG chart component (no external dependencies).
 * Renders either bars (default) or a line chart.
 */
const MiniChart = ({
  labels,
  values,
  maxY,
  color = "#4B6FA7",
  height = 200,
  barMode = true,
}: MiniChartProps) => {
  const width = 320;
  const padding = { top: 20, right: 10, bottom: 40, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const safeMaxY = maxY > 0 ? maxY : 1;

  if (barMode) {
    const barGap = 4;
    const barWidth = Math.max(
      4,
      (chartW - barGap * labels.length) / labels.length,
    );

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis labels */}
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

        {/* Bars */}
        {values.map((val, i) => {
          const x = padding.left + i * (barWidth + barGap) + barGap / 2;
          const barH = (val / safeMaxY) * chartH;
          const y = padding.top + chartH - barH;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(0, barH)}
                rx={3}
                fill={color}
                opacity={0.85}
              />
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 14}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="8"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // Line chart mode
  const points = values.map((val, i) => {
    const x = padding.left + (i / Math.max(1, values.length - 1)) * chartW;
    const y = padding.top + chartH - (val / safeMaxY) * chartH;
    return { x, y };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD =
    pathD +
    ` L ${points[points.length - 1]?.x ?? 0} ${padding.top + chartH} L ${points[0]?.x ?? 0} ${padding.top + chartH} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid */}
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

      {/* Area */}
      <path d={areaD} fill={color} opacity={0.15} />
      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
      ))}

      {/* X Labels */}
      {labels.map((lbl, i) => {
        const x = padding.left + (i / Math.max(1, labels.length - 1)) * chartW;
        return (
          <text
            key={i}
            x={x}
            y={height - padding.bottom + 14}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="8"
          >
            {lbl}
          </text>
        );
      })}
    </svg>
  );
};

export default MiniChart;
