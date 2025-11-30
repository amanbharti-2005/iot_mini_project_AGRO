import React from "react";
import farmerImage from "./assets/farmers1.png";
import "./components/styles/homepage.css";


const Home = () => {
  return (
    <div className="home-container">

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
      <h1 className="welcome-text animate-text">
        Welcome to AGRO!
      </h1>
    </div>
  );
  
  
 
};

export default Home;
