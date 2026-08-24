import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client.js";
import WeatherIcon, { WindIcon, DropletIcon } from "../components/WeatherIcon.jsx";
import { useUnit } from "../context/UnitContext.jsx";

function FavoriteCard({ favorite, onRemove }) {
  const { convert } = useUnit();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getWeather({
        lat: favorite.latitude,
        lon: favorite.longitude,
        name: favorite.name,
        country: favorite.country,
      })
      .then((data) => {
        if (!cancelled) setWeather(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [favorite]);

  return (
    <div className="favorite-card">
      <div className="favorite-card-header">
        <div>
          <h3>{favorite.name}</h3>
          <p className="country-code">{favorite.country || "—"}</p>
        </div>
        <button
          className="trash-btn"
          onClick={() => onRemove(favorite.id)}
          aria-label="Remove favorite"
          title="Remove from favorites"
        >
          🗑
        </button>
      </div>

      {weather ? (
        <div className="favorite-card-body">
          <WeatherIcon icon={weather.current.icon} size={42} className="favorite-icon" />
          <span className="favorite-temp">{convert(weather.current.temperature)}°</span>
          <div className="favorite-meta">
            <span className="condition-label">{weather.current.condition}</span>
            <span className="favorite-substats">
              <span className="substat-item">
                <WindIcon size={13} /> {Math.round(weather.current.windSpeed ?? 0)} km/h
              </span>
              <span className="substat-item">
                <DropletIcon size={13} /> {weather.current.humidity ?? "--"}%
              </span>
            </span>
          </div>
        </div>
      ) : (
        <p className="empty-note">Loading weather data…</p>
      )}
    </div>
  );
}

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      const { favorites } = await api.listFavorites();
      setFavorites(favorites);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addCity = async (e) => {
    e.preventDefault();
    if (!newCity.trim()) return;
    setAdding(true);
    setError("");
    try {
      await api.addFavorite({ name: newCity.trim() });
      setNewCity("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const removeCity = async (id) => {
    await api.removeFavorite(id);
    load();
  };

  return (
    <div className="page favorites-page">
      <div className="favorites-toolbar">
        <div>
          <h1 className="page-title">Saved Locations</h1>
          <p className="page-subtitle">Quick access telemetry for your favorite coordinates.</p>
        </div>
        <form className="add-favorite-form" onSubmit={addCity}>
          <input
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Add new city... (e.g. Paris)"
          />
          <button type="submit" disabled={adding}>
            + Add
          </button>
        </form>
      </div>

      {error && <p className="error-banner">{error}</p>}

      <div className="favorites-grid">
        {favorites.map((f) => (
          <FavoriteCard key={f.id} favorite={f} onRemove={removeCity} />
        ))}
        {favorites.length === 0 && (
          <p className="empty-note">No saved cities yet. Add one above to keep track of it.</p>
        )}
      </div>
    </div>
  );
}
