// src/App.jsx

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./homepage";
import About from "./aboutus";
import Monitoring from "./Monitoring";
import Login from "./login";
import Register from "./register";
import CropDoctor from "./CropDoctor";

import Navbar from "./navbar";
import ProfileBar from "./Profilebar";
import { ThemeProvider } from "./ThemeContext";

function Layout() {
  const location = useLocation();

  // hide profile bar on login & register pages
  const hideProfileBar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <Navbar />
      {!hideProfileBar && <ProfileBar />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/monitoring" element={<Monitoring />} /> {/* FIXED */}
          <Route path="/cropdoctor" element={<CropDoctor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
