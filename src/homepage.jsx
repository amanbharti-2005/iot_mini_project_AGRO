import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import logo from "./assets/logo.png";
import "./components/styles/homepage.css";
import { CgLogOff } from "react-icons/cg";



const Home = () => {
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

const rotateX = useTransform(springY, [0, 800], [8, -8]);
const rotateY = useTransform(springX, [0, 1500], [-8, 8]);

const handleMouseMove = (e) => {
mouseX.set(e.clientX);
mouseY.set(e.clientY);
};


return ( <div className="home-portal" onMouseMove={handleMouseMove} >
  

  <div className="nebula-bg"></div>

  <div className="comets">
    <span className="comet-1"></span>
    <span className="comet-2"></span>
    <span className="comet-3"></span>
  </div>

  <motion.div
    className="cursor-glow"
    style={{ 
      x: springX, 
      y: springY, 
      translateX: "-50%", 
      translateY: "-50%" 
    }}
  />

  <div className="particles">
    {[...Array(15)].map((_, i) => (
      <span key={i} />
    ))}
  </div>

  <main className="main-content">
    <div className="hero-grid">

      {/* LEFT CONTENT */}
      <motion.div
        className="text-section"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="badge">IoT + AI Smart Agriculture</div>

        <h1 className="title-logo">
          AGRO<span className="accent-dot">.</span>
        </h1>

        <p className="tagline-modern">
          Smart Farming with IoT & <br />
          <span className="highlight-text">Autonomous Intelligence</span>
        </p>

        <div className="info-tiles">

          <div className="info-card">
            <h4>🚜 Smart Rover</h4>
            <p>
              Prototype rover controlled remotely, designed to evolve into a fully autonomous system.
            </p>
          </div>

          <div className="info-card">
            <h4>📷 AI + Vision</h4>
            <p>
              ESP32-CAM with machine learning detects objects like humans and obstacles in real time.
            </p>
          </div>

          <div className="info-card">
            <h4>📡 Live Monitoring</h4>
            <p>
              Mobile app + website dashboard with real-time camera feed and sensor data.
            </p>
          </div>

          <div className="info-card">
            <h4>☁️ Cloud System</h4>
            <p>
              Data sent via MQTT to ThingsBoard with real-time updates across devices.
            </p>
          </div>

          <div className="info-card">
            <h4>🌦️ Sensors</h4>
            <p>
              LDR, DHT11, rain sensor, soil moisture, and water level monitoring system.
            </p>
          </div>

        </div>

        <div className="features-list">
          <div><span>🤖</span> AI Detection</div>
          <div><span>📷</span> Live Camera</div>
          <div><span>📡</span> Remote Control</div>
          <div><span>☁️</span> Cloud Dashboard</div>
        </div>

        {/* REPLACE YOUR EXISTING cta-wrapper WITH THIS */}
<div className="cta-wrapper">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="get-started-btn"
    >
      GET STARTED 
    </motion.button>
</div>


      </motion.div>

      {/* RIGHT VISUAL */}
      {/* RIGHT VISUAL */}
<motion.div
  className="visual-section"
  style={{ rotateX, rotateY }}
>
  <div className="glass-container">
    <motion.img
  src={logo}
  alt="Smart Agriculture Rover"
  className="main-character"
/>
  </div>

  <div style={{ borderRadius: "20px", overflow: "hidden" }}>
  <iframe
    width="500"
    height="280"
    src="https://www.youtube.com/embed/x6p5X0WbjRs"
    title="Agro Rover Demo"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>

</motion.div>

    </div>
  </main>
</div>


);
};

export default Home;
