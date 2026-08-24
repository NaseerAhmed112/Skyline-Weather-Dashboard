const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(body?.error || `Request failed with status ${res.status}`);
  }
  return body;
}

export const api = {
  searchCity: (q) => request(`/weather/search?q=${encodeURIComponent(q)}`),

  getWeather: ({ name, lat, lon, country }) => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (lat != null) params.set("lat", lat);
    if (lon != null) params.set("lon", lon);
    if (country) params.set("country", country);
    return request(`/weather/current?${params.toString()}`);
  },

  listFavorites: () => request(`/favorites`),

  addFavorite: (payload) =>
    request(`/favorites`, { method: "POST", body: JSON.stringify(payload) }),

  removeFavorite: (id) => request(`/favorites/${id}`, { method: "DELETE" }),
};
