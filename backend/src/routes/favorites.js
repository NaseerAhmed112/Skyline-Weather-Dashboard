import { Router } from "express";
import { favoritesStore } from "../services/fileStore.js";
import { geocodeCity } from "../services/openMeteoService.js";

const router = Router();

// GET /api/favorites - list every saved location (from favorites.json)
router.get("/", async (req, res, next) => {
  try {
    const list = await favoritesStore.list();
    res.json({ favorites: list });
  } catch (err) {
    next(err);
  }
});

// POST /api/favorites - add a new city by name
// body: { name: "Paris" }  OR  { name, country, latitude, longitude }
router.post("/", async (req, res, next) => {
  try {
    let { name, country, latitude, longitude } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "City 'name' is required." });
    }

    if (latitude == null || longitude == null) {
      const matches = await geocodeCity(name, 1);
      if (!matches.length) {
        return res.status(404).json({ error: `No location found for "${name}".` });
      }
      const best = matches[0];
      name = best.name;
      country = best.country;
      latitude = best.latitude;
      longitude = best.longitude;
    }

    const { list, created, record } = await favoritesStore.add({
      name,
      country,
      latitude,
      longitude,
    });

    res.status(created ? 201 : 200).json({ favorites: list, created, favorite: record });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/favorites/:id - remove a saved location
router.delete("/:id", async (req, res, next) => {
  try {
    const { list, removed } = await favoritesStore.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: "Favorite not found." });
    res.json({ favorites: list });
  } catch (err) {
    next(err);
  }
});

export default router;
