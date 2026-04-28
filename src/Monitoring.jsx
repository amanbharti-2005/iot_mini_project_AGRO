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

const CHANNEL_ID = 3185670;
const READ_API_KEY = "X9JIBZ45ILK9KEJT";
const REFRESH_MS = 15000;

const shortTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString() : "-";

export default function Monitoring() {

  const prevDistanceRef = useRef(0);
  const [obstacleLabel, setObstacleLabel] = useState("Clear");

  // 🔥 DARK MODE STATE
  const [dark, setDark] = useState(true);

  const [latest, setLatest] = useState({
    soil: 0, pump: "0", temp: 0, humidity: 0,
    sunlight: 0, rain: "0", water: 0,
    distance: 0, updated: "-"
  });

  const [chartData, setChartData] = useState([]);

  const fetchFeeds = async () => {
    const res = await fetch(
      `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=50`
    );
    const data = await res.json();
    const feeds = data.feeds;
    const newest = feeds[feeds.length - 1];

    const mapped = {
      soil: Number(newest.field1),
      pump: newest.field2,
      temp: Number(newest.field3),
      humidity: Number(newest.field4),
      sunlight: Number(newest.field5),
      water: Number(newest.field6),
      rain: newest.field7,
      distance: Number(newest.field8),
      updated: newest.created_at
    };

    setLatest(mapped);

    // obstacle logic (UNCHANGED)
    const prev = prevDistanceRef.current;
    const curr = mapped.distance;

    let label = "Clear";

    if (curr > 0 && curr <= 30) label = "EMERGENCY";
    else if (prev === 0 && curr > 30) label = "Detected";
    else if (curr > 30) label = "Object Detected";

    setObstacleLabel(label);
    prevDistanceRef.current = curr;

    setChartData(
      feeds.map(f => ({
        time: shortTime(f.created_at),
        soil: Number(f.field1),
        temp: Number(f.field3),
        humidity: Number(f.field4),
        sunlight: Number(f.field5),
        water: Number(f.field6),
        distance: Number(f.field8)
      }))
    );
  };

  useEffect(() => {
    fetchFeeds();
    const id = setInterval(fetchFeeds, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // status logic (UNCHANGED)
  const soilStatus =
    latest.soil < 30 ? "low" :
    latest.soil > 80 ? "high" : "normal";

  const pumpStatus =
    latest.pump === "1" ? "on" : "off";

  const obstacleClass =
    obstacleLabel === "EMERGENCY" ? "emergency" :
    obstacleLabel === "Object Detected" ? "detected" : "";

  return (
    <div className={`monitor ${dark ? "dark-mode" : "light-mode"}`}>

      {/* HEADER */}
      <div className="header">
        <div>
          <h1>AGRO Monitoring</h1>
          <p className="subtitle">Last update: {shortTime(latest.updated)}</p>
        </div>

        {/* 🔥 MODE SWITCH */}
        <button className="mode-toggle" onClick={() => setDark(!dark)}>
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* CARDS */}
      <div className="cards">

        <Card icon={<FaLeaf/>} title="Soil"
          value={`${latest.soil}%`} status={soilStatus}/>

        <Card icon={<FaTemperatureHigh/>} title="Temp"
          value={`${latest.temp}°C`}/>

        <Card icon={<FaTint/>} title="Humidity"
          value={`${latest.humidity}%`}/>

        <Card icon={<FaSun/>} title="Sunlight"
          value={`${latest.sunlight}%`}/>

        <Card icon={<FaPowerOff/>} title="Pump"
          value={latest.pump==="1"?"ON":"OFF"}
          status={pumpStatus}/>

        <Card icon={<FaCloudRain/>} title="Rain"
          value={latest.rain==="1"?"Raining":"Clear"}/>

        <Card icon={<FaWater/>} title="Water"
          value={`${latest.water}%`}/>

        <Card icon={"📏"} title="Obstacle"
          value={obstacleLabel}
          status={obstacleClass}
          extra={`${latest.distance} cm`}
        />
      </div>

      {/* GRAPHS */}
      <div className="graphs">
        <Graph title="Soil" dataKey="soil" data={chartData}/>
        <Graph title="Temp" dataKey="temp" data={chartData}/>
        <Graph title="Humidity" dataKey="humidity" data={chartData}/>
        <Graph title="Sunlight" dataKey="sunlight" data={chartData}/>
        <Graph title="Water" dataKey="water" data={chartData}/>
        <Graph title="Distance" dataKey="distance" data={chartData}/>
      </div>
    </div>
  );
}


/* ---------- COMPONENTS ---------- */

const Card = ({icon, title, value, status="", extra=""}) => (
  <div className={`card ${status}`}>
    <div className="icon">{icon}</div>
    <div className="title">{title}</div>
    <div className="value">{value}</div>
    {extra && <div className="extra">{extra}</div>}
  </div>
);

const Graph = ({title, data, dataKey}) => (
  <div className="graph">
    <h3>{title}</h3>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="time"/>
        <YAxis/>
        <Tooltip/>
        <Line type="monotone" dataKey={dataKey} stroke="#00ff9f" dot={false}/>
      </LineChart>
    </ResponsiveContainer>
  </div>
);