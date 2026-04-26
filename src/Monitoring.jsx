// src/Monitoring.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

import {
  FaLeaf, FaTemperatureHigh, FaTint, FaSun,
  FaPowerOff, FaCloudRain, FaWater
} from "react-icons/fa";

import "./monitoring.css";

/* ----------- ThingSpeak CONFIG ----------- */
const CHANNEL_ID = 3185670;
const READ_API_KEY = "X9JIBZ45ILK9KEJT";
const HISTORY_POINTS = 50;
const REFRESH_MS = 15000;
/* ----------------------------------------- */

const shortTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString() : "-";

export default function Monitoring() {

  const prevDistanceRef = useRef(0);
  const [obstacleLabel, setObstacleLabel] = useState("Clear");

  const [latest, setLatest] = useState({
    soil: 0,
    pump: "0",
    temp: 0,
    humidity: 0,
    sunlight: 0,
    rain: "0",
    water: 0,
    distance: 0,
    updated: "-"
  });

  const [chartData, setChartData] = useState([]);
  const abortRef = useRef(null);

  const buildUrl = (results = HISTORY_POINTS) =>
    `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=${results}`;

  const fetchFeeds = async () => {
    if (abortRef.current) {
      try { abortRef.current.abort(); } catch {}
    }

    abortRef.current = new AbortController();

    try {
      const res = await fetch(buildUrl(), { cache: "no-store", signal: abortRef.current.signal });
      const data = await res.json();
      const feeds = data.feeds;
      const newest = feeds[feeds.length - 1];

      const mapped = {
        soil: Number(newest.field1) || 0,
        pump: newest.field2 === "1" ? "1" : "0",
        temp: Number(newest.field3) || 0,
        humidity: Number(newest.field4) || 0,
        sunlight: Number(newest.field5) || 0,
        water: Number(newest.field6) || 0,
        rain: newest.field7 === "1" ? "1" : "0",
        distance: Number(newest.field8) || 0,
        updated: newest.created_at
      };

      setLatest(mapped);

      // 🔥 FINAL OBSTACLE LOGIC
      const prev = prevDistanceRef.current;
      const curr = mapped.distance;

      let label = "Clear";

      if (curr > 0 && curr <= 30) {
        label = "EMERGENCY";
      } 
      else if (prev === 0 && curr > 30) {
        label = "Detected";   // only once
      } 
      else if (curr > 30) {
        label = "Object Detected";
      }

      setObstacleLabel(label);
      prevDistanceRef.current = curr;

      const points = feeds.map((f) => ({
        time: shortTime(f.created_at),
        soil: Number(f.field1),
        temp: Number(f.field3),
        humidity: Number(f.field4),
        sunlight: Number(f.field5),
        water: Number(f.field6),
        rain: f.field7 === "1" ? 1 : 0,
        pump: f.field2 === "1" ? 1 : 0,
        distance: Number(f.field8)
      }));

      setChartData(points);

    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
    }
  };

  useEffect(() => {
    fetchFeeds();
    const id = setInterval(fetchFeeds, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  /* -------- STATUS LOGIC -------- */

  const soilStatus =
    latest.soil < 30 ? "low" :
    latest.soil > 80 ? "high" : "normal";

  const pumpStatus =
    latest.pump === "1" ? "pump-on" : "pump-off";

  // 🔥 CSS CLASS CONTROL (IMPORTANT)
  const obstacleClass =
    obstacleLabel === "EMERGENCY"
      ? "emergency"
      : obstacleLabel === "Object Detected"
      ? "obstacle-detected"
      : "";

  /* -------------------------------- */

  return (
    <div className="monitor">

      {/* HEADER */}
      <div className="monitor-header">
        <div>
          <h1>AGRO Monitoring</h1>
          <div className="subtitle">
            Last update: {shortTime(latest.updated)}
          </div>
        </div>
      </div>

      {/* TOP CARDS */}
      <section className="top-cards">
        <div className="cards-grid">

          {/* SOIL */}
          <button className={`card compact ${soilStatus}`}>
            <FaLeaf className="icon" />
            <div className="label">Soil</div>
            <div className="card-value">{latest.soil}%</div>
            <div className={`card-status ${soilStatus}`}>
              {soilStatus.toUpperCase()}
            </div>
          </button>

          {/* TEMP */}
          <button className="card compact">
            <FaTemperatureHigh className="icon" />
            <div className="label">Temp</div>
            <div className="card-value">{latest.temp}°C</div>
          </button>

          {/* HUMIDITY */}
          <button className="card compact">
            <FaTint className="icon" />
            <div className="label">Humidity</div>
            <div className="card-value">{latest.humidity}%</div>
          </button>

          {/* SUNLIGHT */}
          <button className="card compact">
            <FaSun className="icon" />
            <div className="label">Sunlight</div>
            <div className="card-value">{latest.sunlight}%</div>
          </button>

          {/* PUMP */}
          <button className={`card compact ${pumpStatus}`}>
            <FaPowerOff className="icon" />
            <div className="label">Pump</div>
            <div className="card-value">
              {latest.pump === "1" ? "ON" : "OFF"}
            </div>
          </button>

          {/* RAIN */}
          <button className="card compact">
            <FaCloudRain className="icon" />
            <div className="label">Rain</div>
            <div className="card-value">
              {latest.rain === "1" ? "Raining" : "Clear"}
            </div>
          </button>

          {/* WATER */}
          <button className="card compact">
            <FaWater className="icon" />
            <div className="label">Water</div>
            <div className="card-value">{latest.water}%</div>
          </button>

          {/* 🚨 OBSTACLE */}
          <button className={`card compact ${obstacleClass}`}>
            <div className="icon">📏</div>
            <div className="label">Obstacle</div>

            <div className="card-value">
              {obstacleLabel}
            </div>

            <div className={`card-status ${obstacleClass}`}>
              {latest.distance} cm
            </div>
          </button>

        </div>
      </section>

      {/* GRAPH */}
      <main className="graphs-wrapper">
        <section className="graph-section">
          <h3>Soil Moisture</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="soil" stroke="#0b7027" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>

    </div>
  );
}