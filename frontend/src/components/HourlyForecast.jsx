import WeatherIcon from "./WeatherIcon.jsx";
import { useUnit } from "../context/UnitContext.jsx";

export default function HourlyForecast({ hourly = [] }) {
  const { convert } = useUnit();

  return (
    <div className="panel-card hourly-panel">
      <h3 className="panel-title">12-Hour Forecast</h3>
      <div className="hourly-scroll">
        {hourly.map((h, i) => (
          <div className="hourly-item" key={i}>
            <span className="hourly-time">{h.timeFormatted || `${h.hour}:00`}</span>
            <WeatherIcon icon={h.icon} size={28} className="hourly-icon" />
            <span className="hourly-temp">{convert(h.temperature)}°</span>
            <span className="hourly-precip">
              {h.precipitationProbability != null ? `${h.precipitationProbability}%` : "--"}
            </span>
          </div>
        ))}
        {hourly.length === 0 && <p className="empty-note">No forecast data.</p>}
      </div>
    </div>
  );
}
