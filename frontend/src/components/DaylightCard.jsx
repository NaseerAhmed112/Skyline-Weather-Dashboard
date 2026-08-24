import { SunriseIcon, SunsetIcon, Sun } from "./WeatherIcon.jsx";

function formatTime(iso) {
  if (!iso) return "--:--";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function DaylightCard({ daily }) {
  if (!daily) return null;

  return (
    <div className="panel-card daylight-panel">
      <div className="panel-title-row">
        <Sun size={16} className="panel-header-icon" />
        <h3 className="panel-title">Daylight</h3>
      </div>

      <div className="daylight-content">
        <div className="daylight-item">
          <div className="daylight-icon sunrise">
            <SunriseIcon size={22} />
          </div>
          <div className="daylight-info">
            <p className="daylight-label">Sunrise</p>
            <p className="daylight-value">{formatTime(daily.sunrise)}</p>
          </div>
        </div>

        <div className="daylight-item">
          <div className="daylight-icon sunset">
            <SunsetIcon size={22} />
          </div>
          <div className="daylight-info">
            <p className="daylight-label">Sunset</p>
            <p className="daylight-value">{formatTime(daily.sunset)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
