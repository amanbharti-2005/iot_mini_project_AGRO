// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./components/styles/Navbar.css";



const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Smart Fields, Rich Yields.</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/monitoring">Monitoring</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
