// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./navbar.jsx";

// Pages
import Home from "./homepage.jsx";
import About from "./aboutus.jsx";
import Monitoring from "./Monitoring.jsx";
import Login from "./login.jsx";
import Register from "./register.jsx";   // ✅ IMPORTANT

const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* ✅ IMPORTANT */}
        </Routes>
      </main>
    </Router>
  );
};

export default App;