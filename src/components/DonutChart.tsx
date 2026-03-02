interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

/**
 * Lightweight SVG donut chart — zero dependencies.
 * Renders colored arc segments proportional to their value.
 */
const DonutChart = ({
  segments,
  size = 180,
  strokeWidth = 28,
  centerLabel,
  centerValue,
}: DonutChartProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto"
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth={strokeWidth}
        />
        {centerLabel && (
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fill="#64748B"
            fontSize="11"
          >
            {centerLabel}
          </text>
        )}
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="13"
          fontWeight="600"
        >
          Sin datos
        </text>
      </svg>
    );
  }

  let accumulatedOffset = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto"
    >
      {/* Background circle */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#1E293B"
        strokeWidth={strokeWidth}
      />

      {/* Segments */}
      {segments
        .filter((seg) => seg.value > 0)
        .map((seg, i) => {
          const pct = seg.value / total;
          const dashLength = circumference * pct;
          const gapLength = circumference - dashLength;
          const offset = circumference * accumulatedOffset;
          accumulatedOffset += pct;

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${gapLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "center",
                transition:
                  "stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease",
              }}
            />
          );
        })}

      {/* Center text */}
      {centerValue && (
        <text
          x={cx}
          y={centerLabel ? cy + 2 : cy + 5}
          textAnchor="middle"
          fill="#F8FAFC"
          fontSize="18"
          fontWeight="700"
        >
          {centerValue}
        </text>
      )}
      {centerLabel && (
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fill="#64748B"
          fontSize="10"
        >
          {centerLabel}
        </text>
      )}
    </svg>
  );
};

export default DonutChart;

export type { DonutSegment, DonutChartProps };
