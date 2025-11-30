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
  const [dark, setDark] = useState(false);

  const [latest, setLatest] = useState({
    soil: 0,
    pump: "0",
    temp: 0,
    humidity: 0,
    sunlight: 0,
    rain: "0",
    water: 0,
    updated: "-"
  });

  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const abortRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const [secondsSince, setSecondsSince] = useState(0);

  /* -----------------------------------------
            Fetch ThingSpeak Data
  ------------------------------------------ */
  const buildUrl = (results = HISTORY_POINTS) =>
    READ_API_KEY
      ? `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=${results}`
      : `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?results=${results}`;

  const fetchFeeds = async () => {
    if (abortRef.current) {
      try { abortRef.current.abort(); } catch {}
    }

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
      const res = await fetch(buildUrl(), { cache: "no-store", signal });
      if (!res.ok) return console.error("HTTP error:", res.status);

      const data = await res.json();
      if (!data || !Array.isArray(data.feeds)) return;

      const feeds = data.feeds;

      const newest = feeds[feeds.length - 1];

      // -------- DIRECT ThingSpeak MAPPING --------
      const mapped = {
        soil: Number(newest.field1) || 0,
        pump: newest.field2 === "1" ? "1" : "0",
        temp: Number(newest.field3) || 0,
        humidity: Number(newest.field4) || 0,
        sunlight: Number(newest.field5) || 0,
        rain: newest.field6 === "1" ? "1" : "0",
        water: Number(newest.field7) || 0,
        updated: newest.created_at
      };

      setLatest(mapped);

      // Charts
      const points = feeds.map((f) => ({
        time: shortTime(f.created_at),
        soil: Number(f.field1),
        temp: Number(f.field3),
        humidity: Number(f.field4),
        sunlight: Number(f.field5),
        rain: f.field6 === "1" ? 1 : 0,
        water: Number(f.field7),
      }));

      setChartData(points);

      // Alerts
      const now = new Date().toLocaleTimeString();
      const ev = [];

      if (mapped.soil < 30) ev.push({ time: now, msg: `Soil low (${mapped.soil}%) — irrigation needed` });
      if (mapped.soil > 80) ev.push({ time: now, msg: `Soil high (${mapped.soil}%)` });

      if (mapped.water < 20) ev.push({ time: now, msg: `Water level low (${mapped.water}%)` });

      if (mapped.rain === "1") ev.push({ time: now, msg: "Rain detected" });

      ev.push({ time: now, msg: mapped.pump === "1" ? "Pump ON" : "Pump OFF" });

      setAlerts((p) => [...ev, ...p].slice(0, 5));

      lastUpdateRef.current = Date.now();
      setSecondsSince(0);

    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
    }
  };

  /* -------- Auto Refresh -------- */
  useEffect(() => {
    fetchFeeds();
    const id = setInterval(fetchFeeds, REFRESH_MS);
    return () => {
      clearInterval(id);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (lastUpdateRef.current)
        setSecondsSince(Math.floor((Date.now() - lastUpdateRef.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={dark ? "monitor dark-mode" : "monitor light-mode"}>

      {/* HEADER */}
      <div className="monitor-header">
        <div>
          <h1>AGRO Monitoring</h1>
          <div className="subtitle">
            Last update: {shortTime(latest.updated)} — {secondsSince}s ago
          </div>
        </div>

        <div className="header-actions">
          <button className="mode-btn" onClick={() => setDark((x) => !x)}>
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="mode-btn" onClick={() => fetchFeeds()}>
            Refresh Now
          </button>
        </div>
      </div>

      {/* ALERTS */}
      <section className="alerts-section">
        <h3>Recent Alerts</h3>
        <div className="alerts-table-wrap">
          <table className="alerts-table">
            <thead>
              <tr><th>Time</th><th>Alert</th></tr>
            </thead>
            <tbody>
              {alerts.length === 0
                ? <tr><td colSpan="2">No alerts</td></tr>
                : alerts.map((a, i) => (
                    <tr key={i}><td>{a.time}</td><td>{a.msg}</td></tr>
                  ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TOP CARDS */}
      <section className="top-cards">
        <div className="cards-grid">

          <button className="card compact" onClick={() => scrollTo("soil-graph")}>
            <FaLeaf className="icon" />
            <div className="label">Soil</div>
            <div className="card-value">{latest.soil}%</div>
          </button>

          <button className="card compact" onClick={() => scrollTo("temp-graph")}>
            <FaTemperatureHigh className="icon" />
            <div className="label">Temp</div>
            <div className="card-value">{latest.temp}°C</div>
          </button>

          <button className="card compact" onClick={() => scrollTo("humidity-graph")}>
            <FaTint className="icon" />
            <div className="label">Humidity</div>
            <div className="card-value">{latest.humidity}%</div>
          </button>

          <button className="card compact" onClick={() => scrollTo("sun-graph")}>
            <FaSun className="icon" />
            <div className="label">Sunlight</div>
            <div className="card-value">{latest.sunlight}%</div>
          </button>

          <button className="card compact" onClick={() => scrollTo("pump-graph")}>
            <FaPowerOff className="icon" />
            <div className="label">Pump</div>
            <div className="card-value">
              {latest.pump === "1" ? "ON" : "OFF"}
            </div>
          </button>

          <button className="card compact" onClick={() => scrollTo("rain-graph")}>
            <FaCloudRain className="icon" />
            <div className="label">Rain</div>
            <div className="card-value">
              {latest.rain === "1" ? "Raining" : "Clear"}
            </div>
          </button>

          <button className="card compact" onClick={() => scrollTo("water-graph")}>
            <FaWater className="icon" />
            <div className="label">Water</div>
            <div className="card-value">{latest.water}%</div>
          </button>

        </div>
      </section>

      {/* GRAPHS */}
      <main className="graphs-wrapper">

        {/* SOIL */}
        <section id="soil-graph" className="graph-section">
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

        {/* TEMP */}
        <section id="temp-graph" className="graph-section">
          <h3>Temperature</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#ff6b3d" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* HUMIDITY */}
        <section id="humidity-graph" className="graph-section">
          <h3>Humidity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="humidity" stroke="#1976D2" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* SUNLIGHT */}
        <section id="sun-graph" className="graph-section">
          <h3>Sunlight</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="sunlight" stroke="#FBC02D" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* PUMP */}
        <section id="pump-graph" className="graph-section">
          <h3>Pump Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line type="stepAfter" dataKey="rain" stroke="#777" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* RAIN */}
        <section id="rain-graph" className="graph-section">
          <h3>Rain Sensor</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line type="stepAfter" dataKey="rain" stroke="#0288D1" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* WATER LEVEL */}
        <section id="water-graph" className="graph-section">
          <h3>Water Level</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="water" stroke="#009688" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </section>

      </main>
    </div>
  );
}