import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client.js";
import SearchBar from "../components/SearchBar.jsx";
import CurrentWeatherCard from "../components/CurrentWeatherCard.jsx";
import HourlyForecast from "../components/HourlyForecast.jsx";
import DaylightCard from "../components/DaylightCard.jsx";
import SevenDayForecast from "../components/SevenDayForecast.jsx";
import AirQualityCard from "../components/AirQualityCard.jsx";
import WindTrendCard from "../components/WindTrendCard.jsx";
import { DownloadIcon } from "../components/WeatherIcon.jsx";

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadWeather = useCallback(async (params) => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getWeather(params);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const { favorites } = await api.listFavorites();
      setFavorites(favorites);
    } catch {
      /* non-blocking */
    }
  }, []);

  useEffect(() => {
    loadWeather({ name: "London" });
    loadFavorites();
  }, [loadWeather, loadFavorites]);

  const handleSearch = (city) => loadWeather({ name: city });

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeather({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: "My Location",
        });
      },
      () => setError("Unable to retrieve your location.")
    );
  };

  const isFavorite =
    weather && favorites.some((f) => f.name.toLowerCase() === weather.location.name.toLowerCase());

  const toggleFavorite = async () => {
    if (!weather) return;
    if (isFavorite) {
      const fav = favorites.find(
        (f) => f.name.toLowerCase() === weather.location.name.toLowerCase()
      );
      if (fav) {
        await api.removeFavorite(fav.id);
      }
    } else {
      await api.addFavorite({
        name: weather.location.name,
        country: weather.location.country,
        latitude: weather.location.latitude,
        longitude: weather.location.longitude,
      });
    }
    loadFavorites();
  };

  const exportReport = () => {
    if (!weather) return;
    const report = {
      generatedAt: new Date().toISOString(),
      location: weather.location,
      current: weather.current,
      airQuality: weather.airQuality,
      daily: weather.daily,
      hourly: weather.hourly,
      sevenDay: weather.sevenDay,
      windTrend: weather.windTrend,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${weather.location.name.replace(/\s+/g, "-").toLowerCase()}-weather-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-toolbar">
        <SearchBar onSearch={handleSearch} onLocate={handleLocate} loading={loading} />
        <button className="export-btn" onClick={exportReport} disabled={!weather}>
          <DownloadIcon size={16} className="export-icon" />
          <span>Export Report</span>
        </button>
      </div>

      {error && <p className="error-banner">{error}</p>}
      {loading && !weather && <p className="empty-note">Loading weather data…</p>}

      {weather && (
        <div className="dashboard-sections">
          <CurrentWeatherCard
            weather={weather}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />

          <div className="dashboard-grid-row-2">
            <HourlyForecast hourly={weather.hourly} />
            <DaylightCard daily={weather.daily} />
          </div>

          <div className="dashboard-grid-row-3">
            <SevenDayForecast sevenDay={weather.sevenDay} />
            <AirQualityCard airQuality={weather.airQuality} />
            <WindTrendCard windTrend={weather.windTrend} />
          </div>
        </div>
      )}
    </div>
  );
}
