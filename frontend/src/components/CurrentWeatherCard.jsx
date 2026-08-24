import WeatherIcon, {
  ThermometerIcon,
  DropletIcon,
  WindIcon,
  EyeIcon,
  StarIcon,
} from "./WeatherIcon.jsx";
import { useUnit } from "../context/UnitContext.jsx";

export default function CurrentWeatherCard({
  weather,
  isFavorite,
  onToggleFavorite,
  compact = false,
}) {
  const { convert } = useUnit();
  if (!weather) return null;

  const { location, current } = weather;

  return (
    <div className={`current-card ${compact ? "compact" : ""}`}>
      <div className="current-card-main">
        <div className="current-card-heading">
          <h2>{location.name}</h2>
          {onToggleFavorite && (
            <button
              className={`star-btn ${isFavorite ? "active" : ""}`}
              onClick={onToggleFavorite}
              aria-label="Toggle favorite"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <StarIcon size={16} />
            </button>
          )}
        </div>
        <p className="country-code">{location.country || "—"}</p>

        <div className="current-temp-row">
          <WeatherIcon icon={current.icon} size={64} className="hero-weather-icon" />
          <div className="temp-condition-block">
            <span className="current-temp">{convert(current.temperature)}°</span>
            <p className="condition-label">{current.condition}</p>
          </div>
        </div>
      </div>

      <div className="current-card-stats-grid">
        <div className="stat-col">
          <div className="stat-item">
            <div className="stat-label-row">
              <ThermometerIcon size={16} className="stat-icon" />
              <span className="stat-label">Feels Like</span>
            </div>
            <span className="stat-value">{convert(current.feelsLike)}°</span>
          </div>

          <div className="stat-item">
            <div className="stat-label-row">
              <DropletIcon size={16} className="stat-icon" />
              <span className="stat-label">Humidity</span>
            </div>
            <span className="stat-value">{current.humidity ?? "--"}%</span>
          </div>
        </div>

        <div className="stat-col">
          <div className="stat-item">
            <div className="stat-label-row">
              <WindIcon size={16} className="stat-icon" />
              <span className="stat-label">Wind</span>
            </div>
            <span className="stat-value">
              {Math.round(current.windSpeed ?? 0)} <small className="stat-unit">km/h</small>
            </span>
          </div>

          <div className="stat-item">
            <div className="stat-label-row">
              <EyeIcon size={16} className="stat-icon" />
              <span className="stat-label">Visibility</span>
            </div>
            <span className="stat-value">
              {current.visibility != null ? Math.round(current.visibility) : "--"} <small className="stat-unit">km</small>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
