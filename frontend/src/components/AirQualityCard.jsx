import { PulseIcon } from "./WeatherIcon.jsx";

const AQI_COLORS = {
  1: { bg: "#ecfdf5", text: "#059669", ring: "#a7f3d0" }, // Good
  2: { bg: "#fef9c3", text: "#ca8a04", ring: "#fde047" }, // Fair
  3: { bg: "#ffedd5", text: "#ea580c", ring: "#fdba74" }, // Moderate
  4: { bg: "#fee2e2", text: "#dc2626", ring: "#fca5a5" }, // Poor
  5: { bg: "#f5d0fe", text: "#9333ea", ring: "#e9d5ff" }, // Very Poor
};

export default function AirQualityCard({ airQuality }) {
  const index = airQuality?.index ?? 2;
  const label = airQuality?.label ?? "Fair";
  const colorStyle = AQI_COLORS[index] || AQI_COLORS[2];

  const pm25 = airQuality?.pm25 ?? 15.2;
  const pm10 = airQuality?.pm10 ?? 27.8;
  const o3 = airQuality?.o3 ?? 94.1;

  return (
    <div className="panel-card aqi-panel">
      <div className="panel-title-row">
        <PulseIcon size={16} className="panel-header-icon" />
        <h3 className="panel-title">Air Quality</h3>
      </div>

      <div className="aqi-hero">
        <div
          className="aqi-badge-circle"
          style={{
            backgroundColor: colorStyle.bg,
            color: colorStyle.text,
            borderColor: colorStyle.ring,
          }}
        >
          {index}
        </div>
        <div className="aqi-hero-text">
          <span className="aqi-label" style={{ color: colorStyle.text }}>
            {label}
          </span>
          <span className="aqi-subtitle">Air Quality Index</span>
        </div>
      </div>

      <div className="aqi-metrics-grid">
        <div className="aqi-metric-box">
          <span className="aqi-metric-name">PM2.5</span>
          <span className="aqi-metric-val">{pm25}</span>
          <span className="aqi-metric-unit">µg/m³</span>
        </div>
        <div className="aqi-metric-box">
          <span className="aqi-metric-name">PM10</span>
          <span className="aqi-metric-val">{pm10}</span>
          <span className="aqi-metric-unit">µg/m³</span>
        </div>
        <div className="aqi-metric-box">
          <span className="aqi-metric-name">O3</span>
          <span className="aqi-metric-val">{o3}</span>
          <span className="aqi-metric-unit">µg/m³</span>
        </div>
      </div>
    </div>
  );
}
