const CODE_MAP = {
  0: { label: "Clear Skies", icon: "sun" },
  1: { label: "Sunny", icon: "sun" },
  2: { label: "Partly Cloudy", icon: "partly-cloudy" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Foggy", icon: "haze" },
  48: { label: "Humid And Hazy", icon: "haze" },
  51: { label: "Light Drizzle", icon: "drizzle" },
  53: { label: "Drizzle", icon: "drizzle" },
  55: { label: "Overcast With Drizzle", icon: "drizzle" },
  56: { label: "Freezing Drizzle", icon: "drizzle" },
  57: { label: "Freezing Drizzle", icon: "drizzle" },
  61: { label: "Light Rain", icon: "rain" },
  63: { label: "Rain", icon: "rain" },
  65: { label: "Heavy Rain", icon: "rain" },
  66: { label: "Freezing Rain", icon: "rain" },
  67: { label: "Freezing Rain", icon: "rain" },
  71: { label: "Light Snow", icon: "snow" },
  73: { label: "Snow", icon: "snow" },
  75: { label: "Heavy Snow", icon: "snow" },
  77: { label: "Snow Grains", icon: "snow" },
  80: { label: "Light Showers", icon: "rain" },
  81: { label: "Showers", icon: "rain" },
  82: { label: "Violent Showers", icon: "rain" },
  85: { label: "Snow Showers", icon: "snow" },
  86: { label: "Heavy Snow Showers", icon: "snow" },
  95: { label: "Thunderstorm", icon: "storm" },
  96: { label: "Thunderstorm With Hail", icon: "storm" },
  99: { label: "Severe Thunderstorm", icon: "storm" },
};

export function describeWeatherCode(code) {
  return CODE_MAP[code] || { label: "Partly Cloudy", icon: "cloud" };
}

