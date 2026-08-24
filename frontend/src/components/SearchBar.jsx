import { useState } from "react";
import { SearchIcon } from "./WeatherIcon.jsx";

export default function SearchBar({ onSearch, onLocate, loading, placeholder }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={submit}>
      <div className="search-input-wrap">
        <SearchIcon size={18} className="search-icon" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || "Search city... e.g. Tokyo, London, San Francisco"}
        />
      </div>
      <button
        type="button"
        className="locate-btn"
        onClick={() => {
          if (value.trim()) {
            onSearch(value.trim());
          } else if (onLocate) {
            onLocate();
          }
        }}
        disabled={loading}
      >
        Locate
      </button>
    </form>
  );
}
