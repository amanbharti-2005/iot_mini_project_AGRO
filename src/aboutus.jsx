import React from "react";
import {
  Leaf,
  Cpu,
  Radio,
  BarChart3,
  SunMedium,
  Droplets,
  Waves
} from "lucide-react";
import "./components/styles/aboutus.css";

const AboutUs = () => {
  return (
    <section className="about-section">

      {/* MAIN CARD */}
      <div className="about-card fade-in">
        <h2 className="about-title">About AGRO</h2>
        <p className="about-desc">
          AGRO is a smart farming assistant built to support farmers with modern IoT solutions.
          It helps track soil, weather, irrigation, and crop needs using sensors and real-time data.
        </p>
      </div>

      {/* SENSORS SECTION */}
      <div className="sensor-section fade-in">
        <h3 className="sub-heading">Smart Sensors We Use</h3>

        <div className="sensor-grid">
          <div className="sensor-card">
            <Leaf size={40} className="icon" />
            <h4>Soil Moisture Sensor</h4>
            <p>Monitors soil dryness and helps automate irrigation.</p>
          </div>

          <div className="sensor-card">
            <Cpu size={40} className="icon" />
            <h4>Temperature Sensor</h4>
            <p>Tracks real-time environmental temperature for crops.</p>
          </div>

          <div className="sensor-card">
            <Droplets size={40} className="icon" />
            <h4>Humidity Sensor</h4>
            <p>Measures air humidity essential for crop growth.</p>
          </div>

          <div className="sensor-card">
            <SunMedium size={40} className="icon" />
            <h4>Sunlight Sensor</h4>
            <p>Detects sunlight intensity for plant health.</p>
          </div>

          <div className="sensor-card">
            <Waves size={40} className="icon" />
            <h4>Water Level Sensor</h4>
            <p>Monitors tank water levels for irrigation.</p>
          </div>

          <div className="sensor-card">
            <BarChart3 size={40} className="icon" />
            <h4>LDR Sensor</h4>
            <p>Measures light intensity for crop growth analysis.</p>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE AGRO */}
      <div className="why-section fade-in">
  <h3 className="sub-heading">Why Choose AGRO?</h3>

  <ul className="why-list">
    <li>
      <span className="check-icon">✔</span>
      Easy to use for beginners & farmers
    </li>
    <li>
      <span className="check-icon">✔</span>
      Real-time sensor monitoring from anywhere
    </li>
    <li>
      <span className="check-icon">✔</span>
      Accurate data for better crop decisions
    </li>
    <li>
      <span className="check-icon">✔</span>
      Helps reduce water, electricity & manual effort
    </li>
    <li>
      <span className="check-icon">✔</span>
      Designed for students, projects & real farming
    </li>
  </ul>
</div>


    </section>
  );
};

export default AboutUs;
