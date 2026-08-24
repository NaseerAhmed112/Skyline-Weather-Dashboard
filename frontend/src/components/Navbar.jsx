import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useUnit } from "../context/UnitContext.jsx";
import { BrandLogoIcon, GridIcon, DocumentIcon, StarIcon, Sun } from "./WeatherIcon.jsx";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { unit, toggleUnit } = useUnit();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <BrandLogoIcon size={24} className="brand-icon" />
        <span>Skyline Dashboard</span>
      </div>

      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <GridIcon size={16} className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/compare" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <DocumentIcon size={16} className="nav-icon" />
          <span>Compare</span>
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <StarIcon size={16} className="nav-icon" />
          <span>Favorites</span>
        </NavLink>
      </nav>

      <div className="navbar-actions">
        <button className="pill-btn" onClick={toggleUnit} aria-label="Toggle temperature unit">
          °{unit}
        </button>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === "light" ? <Sun size={18} /> : <span>☾</span>}
        </button>
      </div>
    </header>
  );
}
