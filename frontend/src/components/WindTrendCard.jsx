import { WindIcon } from "./WeatherIcon.jsx";

function getSmoothPath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
}

export default function WindTrendCard({ windTrend = [] }) {
  // Chart dimensions
  const width = 360;
  const height = 180;
  const padLeft = 32;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 28;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  // Use fixed or data-driven max scale
  let maxWind = 24;
  windTrend.forEach((pt) => {
    if (pt.windSpeed > maxWind) maxWind = Math.ceil(pt.windSpeed / 6) * 6;
  });

  const yTicks = [24, 18, 12, 6, 0];

  // Map points to chart coordinates
  const dataPoints = (windTrend.length > 0 ? windTrend : [
    { label: "06:00", windSpeed: 18 },
    { label: "07:00", windSpeed: 23 },
    { label: "09:00", windSpeed: 24 },
    { label: "10:00", windSpeed: 19 },
    { label: "11:00", windSpeed: 14 },
    { label: "13:00", windSpeed: 13 },
  ]).map((pt, i, arr) => {
    const x = padLeft + (i / Math.max(1, arr.length - 1)) * chartWidth;
    const clampedSpeed = Math.max(0, Math.min(maxWind, pt.windSpeed));
    const y = padTop + chartHeight - (clampedSpeed / maxWind) * chartHeight;
    return { x, y, ...pt };
  });

  const linePath = getSmoothPath(dataPoints);
  const areaPath =
    dataPoints.length > 0
      ? `${linePath} L ${dataPoints[dataPoints.length - 1].x} ${padTop + chartHeight} L ${dataPoints[0].x} ${padTop + chartHeight} Z`
      : "";

  return (
    <div className="panel-card wind-trend-panel">
      <div className="panel-title-row">
        <WindIcon size={16} className="panel-header-icon" />
        <h3 className="panel-title">Wind Trend</h3>
      </div>

      <div className="wind-chart-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="wind-chart-svg">
          <defs>
            <linearGradient id="windAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f6bfc" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#4f6bfc" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis labels */}
          {yTicks.map((val) => {
            const yPos = padTop + chartHeight - (val / maxWind) * chartHeight;
            return (
              <g key={val} className="chart-grid-group">
                <text x={padLeft - 8} y={yPos + 4} textAnchor="end" className="chart-axis-text">
                  {val}
                </text>
                <line
                  x1={padLeft}
                  y1={yPos}
                  x2={width - padRight}
                  y2={yPos}
                  className="chart-grid-line"
                />
              </g>
            );
          })}

          {/* Area Fill */}
          {areaPath && <path d={areaPath} fill="url(#windAreaGradient)" />}

          {/* Trend Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#3454f4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* X-Axis Labels */}
          {dataPoints.map((pt, idx) => {
            // Show selected or spaced out labels to avoid clutter
            if (idx === 0 || idx === dataPoints.length - 1 || idx % 2 === 0) {
              return (
                <text
                  key={idx}
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="chart-axis-text"
                >
                  {pt.label || `${pt.hour}:00`}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>
    </div>
  );
}
