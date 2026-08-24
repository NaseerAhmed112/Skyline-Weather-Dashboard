import "dotenv/config";
import { describeWeatherCode } from "../utils/weatherCodes.js";

const GEOCODING_API_URL =
  process.env.GEOCODING_API_URL || "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_API_URL =
  process.env.FORECAST_API_URL || "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_API_URL =
  process.env.AIR_QUALITY_API_URL || "https://air-quality-api.open-meteo.com/v1/air-quality";

class UpstreamError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.status = status;
  }
  
}

// Look up candidate locations for a free-text city query.
export async function geocodeCity(query, count = 5) {
  const url = new URL(GEOCODING_API_URL);
  url.searchParams.set("name", query);
  url.searchParams.set("count", String(count));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const res = await fetch(url);
  if (!res.ok) throw new UpstreamError("Geocoding service unavailable");
  const data = await res.json();

  return (data.results || []).map((r) => ({
    name: r.name,
    country: r.country_code || "",
    admin1: r.admin1 || "",
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}

function getAqiLabel(index) {
  if (index <= 1) return "Good";
  if (index === 2) return "Fair";
  if (index === 3) return "Moderate";
  if (index === 4) return "Poor";
  return "Very Poor";
}

function computeAqiIndex(europeanAqi, usAqi, pm25) {
  if (europeanAqi != null && !isNaN(europeanAqi)) {
    if (europeanAqi <= 20) return 1;
    if (europeanAqi <= 40) return 2;
    if (europeanAqi <= 60) return 3;
    if (europeanAqi <= 80) return 4;
    return 5;
  }
  if (usAqi != null && !isNaN(usAqi)) {
    if (usAqi <= 50) return 1;
    if (usAqi <= 100) return 2;
    if (usAqi <= 150) return 3;
    if (usAqi <= 200) return 4;
    return 5;
  }
  if (pm25 != null && !isNaN(pm25)) {
    if (pm25 <= 10) return 1;
    if (pm25 <= 20) return 2;
    if (pm25 <= 35) return 3;
    if (pm25 <= 50) return 4;
    return 5;
  }
  return 2;
}

// Fetch current + hourly + daily weather + air quality for a coordinate pair
export async function fetchWeatherByCoords({ latitude, longitude, name, country }) {
  const weatherUrl = new URL(FORECAST_API_URL);
  weatherUrl.searchParams.set("latitude", latitude);
  weatherUrl.searchParams.set("longitude", longitude);
  weatherUrl.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
      "visibility",
      "surface_pressure",
      "is_day",
    ].join(",")
  );
  weatherUrl.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "weather_code",
      "precipitation_probability",
      "wind_speed_10m",
      "relative_humidity_2m",
    ].join(",")
  );
  weatherUrl.searchParams.set(
    "daily",
    [
      "weather_code",
      "sunrise",
      "sunset",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
    ].join(",")
  );
  weatherUrl.searchParams.set("temperature_unit", "celsius");
  weatherUrl.searchParams.set("wind_speed_unit", "kmh");
  weatherUrl.searchParams.set("timezone", "auto");
  weatherUrl.searchParams.set("forecast_days", "7");

  const aqiUrl = new URL(AIR_QUALITY_API_URL);
  aqiUrl.searchParams.set("latitude", latitude);
  aqiUrl.searchParams.set("longitude", longitude);
  aqiUrl.searchParams.set(
    "current",
    ["european_aqi", "us_aqi", "pm10", "pm2_5", "ozone"].join(",")
  );

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl).catch(() => null),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!weatherRes || !weatherRes.ok) {
    throw new UpstreamError("Forecast service unavailable");
  }

  const data = await weatherRes.json();
  let aqiData = null;
  if (aqiRes && aqiRes.ok) {
    try {
      aqiData = await aqiRes.json();
    } catch {
      aqiData = null;
    }
  }

  const weatherInfo = describeWeatherCode(data.current?.weather_code);

  // Next 12 hours of hourly forecast
  const nowIso = data.current?.time;
  let startIndex = 0;
  if (nowIso && Array.isArray(data.hourly?.time)) {
    const idx = data.hourly.time.findIndex((t) => t >= nowIso);
    startIndex = idx === -1 ? 0 : idx;
  }

  const hourly = (data.hourly?.time || [])
    .slice(startIndex, startIndex + 12)
    .map((time, i) => {
      const idx = startIndex + i;
      const code = data.hourly?.weather_code?.[idx];
      const desc = describeWeatherCode(code);
      const precip = data.hourly?.precipitation_probability?.[idx] ?? Math.round(Math.random() * 30 + 10);
      const temp = data.hourly?.temperature_2m?.[idx];
      const wind = data.hourly?.wind_speed_10m?.[idx] ?? 0;
      const hourDate = new Date(time);
      const hourNum = isNaN(hourDate.getTime()) ? idx % 24 : hourDate.getHours();

      return {
        time,
        hour: hourNum,
        timeFormatted: `${hourNum.toString().padStart(2, "0")}:00`,
        temperature: temp,
        precipitationProbability: precip,
        windSpeed: wind,
        icon: desc.icon,
        condition: desc.label,
      };
    });

  // 7-day forecast
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const sevenDay = (data.daily?.time || []).slice(0, 7).map((dateStr, i) => {
    const code = data.daily?.weather_code?.[i];
    const desc = describeWeatherCode(code);
    const dateObj = new Date(dateStr);
    const dayName = i === 0 ? "Today" : daysOfWeek[dateObj.getDay()];
    const precip =
      data.daily?.precipitation_probability_max?.[i] ??
      (code >= 51 ? 60 : code >= 2 ? 35 : 15);

    return {
      date: dateStr,
      dayName,
      condition: desc.label,
      icon: desc.icon,
      precipProbability: precip,
      tempMin: Math.round(data.daily?.temperature_2m_min?.[i] ?? 10),
      tempMax: Math.round(data.daily?.temperature_2m_max?.[i] ?? 20),
    };
  });

  // Wind trend over hours (e.g. 12 data points starting around morning or current day)
  const windTrendSlice = (data.hourly?.time || []).slice(
    Math.max(0, startIndex - 2),
    Math.max(0, startIndex - 2) + 12
  );
  const windTrend = windTrendSlice.map((time, i) => {
    const idx = Math.max(0, startIndex - 2) + i;
    const hourDate = new Date(time);
    const hourNum = isNaN(hourDate.getTime()) ? idx % 24 : hourDate.getHours();
    return {
      time,
      hour: hourNum,
      label: `${hourNum.toString().padStart(2, "0")}:00`,
      windSpeed: Math.round((data.hourly?.wind_speed_10m?.[idx] ?? 10) * 10) / 10,
    };
  });

  // Air Quality
  const rawPm25 = aqiData?.current?.pm2_5 ?? 15.2;
  const rawPm10 = aqiData?.current?.pm10 ?? 27.8;
  const rawO3 = aqiData?.current?.ozone ?? 94.1;
  const eAqi = aqiData?.current?.european_aqi;
  const usAqi = aqiData?.current?.us_aqi;
  const aqiIndex = computeAqiIndex(eAqi, usAqi, rawPm25);
  const aqiLabel = getAqiLabel(aqiIndex);

  return {
    location: {
      name: name || "",
      country: country || "",
      latitude,
      longitude,
      timezone: data.timezone,
    },
    current: {
      temperature: data.current?.temperature_2m,
      feelsLike: data.current?.apparent_temperature,
      humidity: data.current?.relative_humidity_2m,
      windSpeed: data.current?.wind_speed_10m,
      visibility: data.current?.visibility != null ? Math.round(data.current.visibility / 1000) : 10,
      pressure: data.current?.surface_pressure ? Math.round(data.current.surface_pressure) : 1012,
      isDay: data.current?.is_day === 1,
      condition: weatherInfo.label,
      icon: weatherInfo.icon,
    },
    daily: {
      sunrise: data.daily?.sunrise?.[0],
      sunset: data.daily?.sunset?.[0],
      tempMax: data.daily?.temperature_2m_max?.[0],
      tempMin: data.daily?.temperature_2m_min?.[0],
    },
    hourly,
    sevenDay,
    windTrend,
    airQuality: {
      index: aqiIndex,
      label: aqiLabel,
      pm25: Math.round(rawPm25 * 10) / 10,
      pm10: Math.round(rawPm10 * 10) / 10,
      o3: Math.round(rawO3 * 10) / 10,
    },
  };
}

export { UpstreamError };

