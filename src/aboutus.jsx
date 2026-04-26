import React from "react";
import { 
  Leaf, Cpu, Radio, BarChart3, SunMedium, Droplets, 
  Waves, Camera, Bot, Cloud, Radar 
} from "lucide-react";
import "./components/styles/aboutus.css";

const AboutUs = () => {
  // Configuration objects for cleaner rendering
  const hardwareFeatures = [
    { icon: Camera, title: "ESP32-CAM Vision", desc: "High-fidelity live streaming with real-time ML object detection." },
    { icon: Radar, title: "Ultrasonic Sensor", desc: "Front-mounted precision distance measurement for robust obstacle detection." },
    { icon: Cloud, title: "Cloud & Dashboard", desc: "Telemetry data synced to ThingsBoard via MQTT for remote monitoring." },
    { icon: Radio, title: "Hybrid Control", desc: "Mobile app interface for manual control with live video feedback." }
  ];

  const environmentalSensors = [
    { icon: Leaf, title: "Soil Moisture", desc: "Automated pump control; real-time cloud data sync." },
    { icon: Cpu, title: "DHT11 Sensor", desc: "Tracks ambient temperature & humidity for crop health." },
    { icon: SunMedium, title: "LDR Sensor", desc: "Monitors sunlight intensity to optimize growth." },
    { icon: Droplets, title: "Rain Sensor", desc: "Detects precipitation levels for irrigation suspension." },
    { icon: Waves, title: "Water Level", desc: "Continuous tank level monitoring for resource efficiency." },
    { icon: BarChart3, title: "OLED Display", desc: "On-rover edge visualization of real-time sensor data." }
  ];

  const capabilities = [
    "Integrated ML: Real-time object recognition (e.g., human detection).",
    "Future Scope: Automated pump control based on real-time soil conditions.",
    "Multi-Platform Monitoring: Integrated Dashboard, Mobile App, and Local OLED.",
    "Roadmap: Transitioning from remote-controlled to fully autonomous navigation."
  ];

  return (
    <section className="about-section">
      <div className="about-card fade-in">
        <h2 className="about-title">Smart Agriculture Rover : Agro </h2>
        <p className="about-desc">
          An advanced IoT + AI-based farming assistant. Currently featuring remote-controlled operation 
          with plans for full autonomy. Our system integrates real-time ML-vision, sensor-driven 
          irrigation, and cloud-based analytics for precise field management.
        </p>
      </div>

      <div className="feature-section fade-in">
        <h3 className="sub-heading">Hardware & Perception</h3>
        <div className="sensor-grid">
          {hardwareFeatures.map((item, i) => (
            <div key={i} className="sensor-card">
              <item.icon size={40} className="icon" />
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sensor-section fade-in">
        <h3 className="sub-heading">Environmental Sensor Array</h3>
        <div className="sensor-grid">
          {environmentalSensors.map((item, i) => (
            <div key={i} className="sensor-card">
              <item.icon size={40} className="icon" />
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="why-section fade-in">
        <h3 className="sub-heading">System Capability</h3>
        <ul className="why-list">
          {capabilities.map((cap, i) => (
            <li key={i}>
              <span className="check-icon">✔</span> {cap}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AboutUs;