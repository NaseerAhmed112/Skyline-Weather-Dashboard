import { Router } from "express";
import { geocodeCity, fetchWeatherByCoords } from "../services/openMeteoService.js";

const router = Router();

// GET /api/weather/search?q=London
// Returns a list of matching locations for a free-text search.
router.get("/search", async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.status(400).json({ error: "Query parameter 'q' is required." });

    const results = await geocodeCity(q);
    res.json({ results });
  } catch (err) {
    next(err);
  }
});

// GET /api/weather/current?name=London&lat=51.5&lon=-0.12&country=GB
// If lat/lon are omitted, the city name is geocoded first.
router.get("/current", async (req, res, next) => {
  try {
    let { lat, lon, name, country } = req.query;

    if (!lat || !lon) {
      if (!name) {
        return res.status(400).json({ error: "Provide either lat/lon or a city name." });
      }
      const matches = await geocodeCity(name, 1);
      if (!matches.length) {
        return res.status(404).json({ error: `No location found for "${name}".` });
      }
      const best = matches[0];
      lat = best.latitude;
      lon = best.longitude;
      name = best.name;
      country = best.country;
    }

    const weather = await fetchWeatherByCoords({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      name,
      country,
    });

    res.json(weather);
  } catch (err) {
    next(err);
  }
});

export default router;
