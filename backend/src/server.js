import "dotenv/config";
import express from "express";
import cors from "cors";

import weatherRoutes from "./routes/weather.js";
import favoritesRoutes from "./routes/favorites.js";
import { UpstreamError } from "./services/openMeteoService.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "skyline-weather-backend", time: new Date().toISOString() });
});

app.use("/api/weather", weatherRoutes);
app.use("/api/favorites", favoritesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err instanceof UpstreamError ? err.status : err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Skyline Weather backend running on http://localhost:${PORT}`);
});
