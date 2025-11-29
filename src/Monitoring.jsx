// src/Monitoring.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  FaLeaf, FaTemperatureHigh, FaTint, FaSun, FaPowerOff, FaCloudRain, FaWater,
} from "react-icons/fa";
import "./monitoring.css";

/* ================= CONFIG ================= */
const CHANNEL_ID = 3185670;                 // ThingSpeak channel
const READ_API_KEY = "X9JIBZ45ILK9KEJT";   // Read API key (keep empty "" if public)
const HISTORY_POINTS = 50;
const REFRESH_MS = 15000;                  // 15 seconds
/* ========================================== */

const shortTime = (iso) => (iso ? new Date(iso).toLocaleTimeString() : "-");

// === Conversion functions tailored to your ThingSpeak charts ===
// Soil: your ThingSpeak soil shows 0..~30 (treat as "soil percent-like" / raw value)
const convertSoil = (raw) => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 10) / 10; // one decimal if needed
};

// Humidity: ThingSpeak shows 0..~3000 -> map to 0..100%
const convertHumidity = (raw) => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  const pct = (n / 3000) * 100;
  return Math.round(Math.max(0, Math.min(100, pct)) * 10) / 10;
};

// Sunlight: same mapping as humidity
const convertSunlight = (raw) => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  const pct = (n / 3000) * 100;
  return Math.round(Math.max(0, Math.min(100, pct)) * 10) / 10;
};

// Water: ThingSpeak uses 0 or 1 -> map to 0% or 100%
const convertWater = (raw) => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return n === 1 ? 100 : 0;
};

// Temperature: ThingSpeak sends ~0.0-1.2 raw; map to Celsius by *100 as you requested
const convertTemp = (raw) => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  const c = n * 100;
  // sanitize unrealistic results
  if (c < -40 || c > 125) return Math.round(c * 10) / 10;
  return Math.round(c * 10) / 10;
};

// helper: consider common boolean formats for rain/pump fields
const parseBoolField = (v) => {
  const s = String(v ?? "").trim().toLowerCase();
  return s === "1" || s === "true" || s === "on" || s === "yes";
};

const buildApiUrl = (results = HISTORY_POINTS) => {
  const base = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json`;
  return READ_API_KEY && READ_API_KEY.trim()
    ? `${base}?api_key=${READ_API_KEY}&results=${results}`
    : `${base}?results=${results}`;
};

function softBeep(freq = 520, duration = 80) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = freq; g.gain.value = 0.06;
    o.connect(g); g.connect(ctx.destination); o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, duration);
  } catch (e) { /* ignore audio errors */ }
}

export default function Monitoring() {
  const [dark, setDark] = useState(false);
  const [latest, setLatest] = useState({
    soil: 0, temp: null, humidity: 0, sunlight: 0,
    pump: "0", rain: "0", water: 0, updated: "-",
  });
  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const lastUpdateRef = useRef(0);
  const abortRef = useRef(null);
  const [secondsSince, setSecondsSince] = useState(0);

  const fetchFeeds = async (results = HISTORY_POINTS) => {
    // abort previous
    if (abortRef.current) {
      try { abortRef.current.abort(); } catch {}
    }
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
      const url = buildApiUrl(results);
      const res = await fetch(url, { cache: "no-store", signal });
      if (!res.ok) {
        console.error("ThingSpeak HTTP", res.status);
        return;
      }
      const json = await res.json();
      if (!json || !Array.isArray(json.feeds) || json.feeds.length === 0) return;

      const feeds = json.feeds;
      // find newest feed that has at least one non-null field (search from end)
      let newest = null;
      for (let i = feeds.length - 1; i >= 0; i--) {
        const f = feeds[i];
        if (f.field1 || f.field2 || f.field3 || f.field4 || f.field5 || f.field6 || f.field7) { newest = f; break; }
      }
      if (!newest) newest = feeds[feeds.length - 1];

      // mapping per your confirmation:
      // field1=soil, field2=pump, field3=temp, field4=humidity, field5=sunlight, field6=rain, field7=water
      const mapped = {
        soil: convertSoil(newest.field1),
        pump: parseBoolField(newest.field2) ? "1" : "0",
        temp: convertTemp(newest.field3),
        humidity: convertHumidity(newest.field4),
        sunlight: convertSunlight(newest.field5),
        rain: parseBoolField(newest.field6) ? "1" : "0",
        water: convertWater(newest.field7),
        updated: newest.created_at || "-",
      };

      setLatest(mapped);
      lastUpdateRef.current = Date.now();
      setSecondsSince(0);

      // build chart data (oldest -> newest)
      const points = feeds.map((f) => ({
        time: shortTime(f.created_at),
        soil: isFinite(Number(f.field1)) ? convertSoil(f.field1) : null,
        temp: isFinite(Number(f.field3)) ? convertTemp(f.field3) : null,
        humidity: isFinite(Number(f.field4)) ? convertHumidity(f.field4) : null,
        sunlight: isFinite(Number(f.field5)) ? convertSunlight(f.field5) : null,
        water: isFinite(Number(f.field7)) ? convertWater(f.field7) : null,
      }));

      setChartData(points);

      // alerts (keep latest 5)
      const now = new Date().toLocaleTimeString();
      const events = [];
      if (mapped.soil < 30) events.push({ time: now, msg: `Soil LOW (${mapped.soil}%) — irrigation needed` });
      if (mapped.soil > 80) events.push({ time: now, msg: `Soil HIGH (${mapped.soil}%)` });
      if (mapped.water < 25) events.push({ time: now, msg: `Water LOW (${mapped.water}%) — refill tank` });
      if (mapped.rain === "1") events.push({ time: now, msg: `Rain detected` });
      events.push({ time: now, msg: mapped.pump === "1" ? "Pump is ON" : "Pump is OFF" });

      if (events.length) {
        softBeep();
        setAlerts((prev) => [...events, ...prev].slice(0, 5));
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("fetchFeeds error:", err);
    }
  };

  useEffect(() => {
    fetchFeeds();
    const id = setInterval(fetchFeeds, REFRESH_MS);
    return () => { clearInterval(id); if (abortRef.current) try { abortRef.current.abort(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (lastUpdateRef.current) setSecondsSince(Math.floor((Date.now() - lastUpdateRef.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const debugInspect = () => {
    console.info("Latest:", latest);
    console.info("Chart sample:", chartData[0], chartData[chartData.length - 1]);
    window.open(buildApiUrl(3), "_blank");
  };

  const soilStatus = (() => {
    if (latest.soil < 30) return { text: "Low — Irrigation needed", cls: "low" };
    if (latest.soil > 80) return { text: "High — Too moist", cls: "high" };
    return { text: "Normal", cls: "normal" };
  })();

  return (
    <div className={dark ? "monitor dark-mode" : "monitor light-mode"}>
      <div className="monitor-header">
        <div>
          <h1>AGRO Monitoring</h1>
          <div className="subtitle">Last update: {shortTime(latest.updated)} — ({secondsSince}s ago)</div>
        </div>

        <div className="header-actions">
          <button className="mode-btn" onClick={() => setDark((s) => !s)}>{dark ? "Light Mode" : "Dark Mode"}</button>
          <button className="mode-btn" onClick={() => fetchFeeds()}>Force Refresh</button>
          <button className="mode-btn" onClick={() => debugInspect()}>Debug Inspect</button>
        </div>
      </div>

      {/* Alerts */}
      <section className="alerts-section">
        <h3>Recent Alerts</h3>
        <div className="alerts-table-wrap">
          <table className="alerts-table">
            <thead><tr><th>Time</th><th>Alert</th></tr></thead>
            <tbody>
              {alerts.length === 0 ? <tr><td colSpan="2">No alerts yet</td></tr> : alerts.map((a,i) => (<tr key={i}><td>{a.time}</td><td>{a.msg}</td></tr>))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top cards grid */}
      <section className="top-cards">
        <div className="cards-grid">
          <button className="card compact" onClick={() => scrollTo("soil-graph")}>
            <div className="card-head"><FaLeaf className="icon" /><div className="label">Soil</div></div>
            <div className="card-value">{latest.soil}%</div>
            <div className={`card-status ${soilStatus.cls}`}>{soilStatus.text}</div>
          </button>

          <button className="card compact" onClick={() => scrollTo("temp-graph")}>
            <div className="card-head"><FaTemperatureHigh className="icon" /><div className="label">Temp</div></div>
            <div className="card-value">{latest.temp === null ? "—" : `${latest.temp}°C`}</div>
            <div className="card-status">Ideal 20–28°C</div>
          </button>

          <button className="card compact" onClick={() => scrollTo("humidity-graph")}>
            <div className="card-head"><FaTint className="icon" /><div className="label">Humidity</div></div>
            <div className="card-value">{latest.humidity}%</div>
            <div className="card-status">Ideal 40–80%</div>
          </button>

          <button className="card compact" onClick={() => scrollTo("sun-graph")}>
            <div className="card-head"><FaSun className="icon" /><div className="label">Sunlight</div></div>
            <div className="card-value">{latest.sunlight}%</div>
            <div className="card-status">Light level</div>
          </button>

          <button className="card compact" onClick={() => scrollTo("pump-graph")}>
            <div className="card-head"><FaPowerOff className="icon" /><div className="label">Pump</div></div>
            <div className="card-value">{latest.pump === "1" ? "ON" : "OFF"}</div>
            <div className="card-status">Realtime pump status</div>
          </button>

          <button className="card compact" onClick={() => scrollTo("rain-graph")}>
            <div className="card-head"><FaCloudRain className="icon" /><div className="label">Rain</div></div>
            <div className="card-value">{latest.rain === "1" ? "Raining" : "Clear"}</div>
            <div className="card-status">Rain sensor</div>
          </button>

          <button className="card compact" onClick={() => scrollTo("water-graph")}>
            <div className="card-head"><FaWater className="icon" /><div className="label">Water</div></div>
            <div className="card-value">{latest.water}%</div>
            <div className="card-status">{latest.water < 25 ? "LOW" : "OK"}</div>
          </button>
        </div>
      </section>

      {/* Graphs */}
      <main className="graphs-wrapper">

        {/* Soil */}
        <section id="soil-graph" className="graph-section">
          <div className="graph-card-summary">
            <FaLeaf className="icon-large" />
            <div>
              <h3>Soil Moisture</h3>
              <div className="big">{latest.soil}%</div>
              <div className={`small-status ${soilStatus.cls}`}>{soilStatus.text}</div>
            </div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="soil" stroke="#0b7027" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Temp */}
        <section id="temp-graph" className="graph-section">
          <div className="graph-card-summary">
            <FaTemperatureHigh className="icon-large" />
            <div>
              <h3>Air Temperature</h3>
              <div className="big">{latest.temp === null ? "—" : `${latest.temp}°C`}</div>
            </div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#ff6b3d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Humidity */}
        <section id="humidity-graph" className="graph-section">
          <div className="graph-card-summary">
            <FaTint className="icon-large" />
            <div>
              <h3>Humidity</h3>
              <div className="big">{latest.humidity}%</div>
            </div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="humidity" stroke="#0a60ee" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Sunlight */}
        <section id="sun-graph" className="graph-section">
          <div className="graph-card-summary">
            <FaSun className="icon-large" />
            <div>
              <h3>Sunlight</h3>
              <div className="big">{latest.sunlight}%</div>
            </div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="sunlight" stroke="#f6c90e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Pump */}
        <section id="pump-graph" className="graph-section">
          <div className="graph-card-summary">
            <FaPowerOff className="icon-large" />
            <div><h3>Pump Status</h3><div className="big">{latest.pump === "1" ? "ON" : "OFF"}</div></div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" /><YAxis /><Tooltip /><Line type="stepAfter" dataKey="soil" stroke="#6b6b6b" dot={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Rain */}
        <section id="rain-graph" className="graph-section">
          <div className="graph-card-summary">
            <FaCloudRain className="icon-large" />
            <div><h3>Rain Sensor</h3><div className="big">{latest.rain === "1" ? "Raining" : "Clear"}</div></div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" /><YAxis /><Tooltip /><Line type="stepAfter" dataKey="soil" stroke="#3a7" dot={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Water */}
        <section id="water-graph" className="graph-section">
          <div className="graph-card-summary">
            <FaWater className="icon-large" />
            <div>
              <h3>Water Level</h3>
              <div className="big">{latest.water}%</div>
              <div className="small-status">{latest.water < 25 ? "LOW" : "OK"}</div>
            </div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" /><YAxis domain={[0,100]} unit="%" /><Tooltip /><Line type="monotone" dataKey="water" stroke="#0b9f78" strokeWidth={2} dot={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </section>

      </main>
    </div>
  );
}
