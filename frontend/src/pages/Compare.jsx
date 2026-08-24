import { useState, useEffect } from "react";
import { api } from "../api/client.js";
import CurrentWeatherCard from "../components/CurrentWeatherCard.jsx";

function formatTime(iso) {
  if (!iso) return "--:--";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function QuickStatsCard({ weather }) {
  if (!weather) return null;
  const aqiText = weather.airQuality
    ? `${weather.airQuality.label} (${weather.airQuality.index})`
    : "Fair (2)";
  const pressureText = weather.current?.pressure
    ? `${weather.current.pressure} hPa`
    : "1012 hPa";
  const sunriseText = formatTime(weather.daily?.sunrise);
  const sunsetText = formatTime(weather.daily?.sunset);

  return (
    <div className="panel-card quick-stats-card">
      <h4 className="panel-title">Quick Stats</h4>
      <div className="quick-stats-rows">
        <div className="quick-stat-row">
          <span className="quick-stat-label">AQI</span>
          <span className="quick-stat-val">{aqiText}</span>
        </div>
        <div className="quick-stat-row">
          <span className="quick-stat-label">Pressure</span>
          <span className="quick-stat-val">{pressureText}</span>
        </div>
        <div className="quick-stat-row">
          <span className="quick-stat-label">Sunrise/Set</span>
          <span className="quick-stat-val">{`${sunriseText} / ${sunsetText}`}</span>
        </div>
      </div>
    </div>
  );
}

export default function Compare() {
  const [cityA, setCityA] = useState("London");
  const [cityB, setCityB] = useState("Tokyo");
  const [weatherA, setWeatherA] = useState(null);
  const [weatherB, setWeatherB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runCompare = async (e) => {
    e?.preventDefault();
    if (!cityA.trim() || !cityB.trim()) return;
    setLoading(true);
    setError("");
    try {
      const [a, b] = await Promise.all([
        api.getWeather({ name: cityA.trim() }),
        api.getWeather({ name: cityB.trim() }),
      ]);
      setWeatherA(a);
      setWeatherB(b);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCompare();
  }, []);

  const swap = () => {
    setCityA(cityB);
    setCityB(cityA);
    const temp = weatherA;
    setWeatherA(weatherB);
    setWeatherB(temp);
  };

  return (
    <div className="page compare-page">
      <div className="compare-header">
        <h1 className="page-title">Location Comparison</h1>
        <p className="page-subtitle">Compare atmospheric telemetry between two coordinates.</p>
      </div>

      <form className="compare-form" onSubmit={runCompare}>
        <input
          value={cityA}
          onChange={(e) => setCityA(e.target.value)}
          placeholder="First city (e.g. London)"
        />
        <button type="button" className="swap-btn" onClick={swap} aria-label="Swap cities" title="Swap cities">
          ⇄
        </button>
        <input
          value={cityB}
          onChange={(e) => setCityB(e.target.value)}
          placeholder="Second city (e.g. Tokyo)"
        />
        <button type="submit" className="compare-btn" disabled={loading}>
          {loading ? "Comparing…" : "Compare"}
        </button>
      </form>

      {error && <p className="error-banner">{error}</p>}

      {(weatherA || weatherB) && (
        <div className="compare-grid">
          <div className="compare-column">
            <CurrentWeatherCard weather={weatherA} />
            <QuickStatsCard weather={weatherA} />
          </div>
          <div className="compare-column">
            <CurrentWeatherCard weather={weatherB} />
            <QuickStatsCard weather={weatherB} />
          </div>
        </div>
      )}
    </div>
  );
}
