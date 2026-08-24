import WeatherIcon from "./WeatherIcon.jsx";
import { useUnit } from "../context/UnitContext.jsx";

export default function SevenDayForecast({ sevenDay = [] }) {
  const { convert } = useUnit();

  // Find min and max across the entire week to normalize the range bar
  let minAll = 100;
  let maxAll = -100;
  sevenDay.forEach((day) => {
    if (day.tempMin < minAll) minAll = day.tempMin;
    if (day.tempMax > maxAll) maxAll = day.tempMax;
  });
  if (minAll >= maxAll) {
    minAll = 0;
    maxAll = 30;
  }
  const totalSpan = maxAll - minAll || 1;

  return (
    <div className="panel-card seven-day-panel">
      <h3 className="panel-title">7-Day Forecast</h3>
      <div className="seven-day-list">
        {sevenDay.map((day, idx) => {
          const leftPercent = Math.max(0, Math.min(80, ((day.tempMin - minAll) / totalSpan) * 100));
          const rightPercent = Math.max(20, Math.min(100, ((day.tempMax - minAll) / totalSpan) * 100));
          const barWidth = Math.max(25, rightPercent - leftPercent);

          return (
            <div className="seven-day-row" key={idx}>
              <span className="seven-day-name">{day.dayName}</span>
              <div className="seven-day-condition-group">
                <WeatherIcon icon={day.icon} size={22} className="seven-day-icon" />
                <span className="seven-day-condition">{day.condition}</span>
              </div>
              <span className="seven-day-precip">
                {day.precipProbability != null ? `${day.precipProbability}%` : "0%"}
              </span>
              <span className="seven-day-temp-min">{convert(day.tempMin)}°</span>
              <div className="seven-day-bar-track">
                <div
                  className="seven-day-bar-fill"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${barWidth}%`,
                  }}
                />
              </div>
              <span className="seven-day-temp-max">{convert(day.tempMax)}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
