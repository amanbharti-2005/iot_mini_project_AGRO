import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import "./components/styles/Navbar.css";

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <h2 className="logo">Smart Fields, Rich Yields.</h2>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/monitoring">Monitoring</NavLink>
        <NavLink to="/login">Login</NavLink>

        {/* Mode Label + Toggle */}
        <div className="mode-toggle-wrapper">
          <span className="mode-label">
            {theme === "light" ? "Light Mode" : "Dark Mode"}
          </span>

          <label className="switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}

