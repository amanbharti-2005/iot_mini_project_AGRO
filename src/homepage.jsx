import React from "react";
import farmerImage from "./assets/farmers1.png";
import "./components/styles/homepage.css";
import AboutUs from "./aboutus";

const Home = () => {
  const taglineText = "EMPOWERING FARMERS WITH SMART TECHNOLOGY";

  return (
    <div className="home-container">

      {/* Animated Catchy Line */}
      <h2 className="tagline">
        {taglineText.split("").map((char, index) => (
          <span
            key={index}
            style={{ animationDelay: `${index * 0.05}s` }}
            className="burst-letter"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>

      {/* IMAGE + GLOW */}
      <div className="image-wrapper">
        <div className="glow-circle"></div>

        <img
          src={farmerImage}
          alt="Farmer"
          className="farmer-image"
        />
      </div>

      {/* Animated welcome text */}
      <h1 className="welcome-text">
        WELCOME TO AGRO!
      </h1>
    </div>
  );
};

export default Home;
