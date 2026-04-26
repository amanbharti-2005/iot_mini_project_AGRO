import React, { useState, useEffect } from "react";
import "./cropdoctor.css";


const cropDB = {
  mushroom: { name: "Mushroom", care: ["Keep in dark, humid room.", "Maintain substrate moisture.", "High CO2 exchange."], profit: 2.5, market: "₹200–400/kg", soil: "Organic Compost", tempRange: [18, 24], humRange: [80, 95], diseases: [{ name: "Green Mold", fix: "Sterilize substrate" }, { name: "Dry Bubble", fix: "Improve hygiene" }] },
  dragonfruit: { name: "Dragon Fruit", care: ["Provide pole support.", "Well-drained soil.", "Prune for growth."], profit: 4.0, market: "₹120–250/kg", soil: "Sandy/Gravelly", tempRange: [20, 35], humRange: [30, 50], diseases: [{ name: "Stem Canker", fix: "Copper spray" }, { name: "Root Rot", fix: "Improve drainage" }] },
  strawberry: { name: "Strawberry", care: ["Use plastic mulch.", "Acidic soil (5.5 pH).", "Remove runners."], profit: 4.5, market: "₹200–500/kg", soil: "Sandy Loam", tempRange: [15, 25], humRange: [60, 80], diseases: [{ name: "Gray Mold", fix: "Increase airflow" }, { name: "Red Stele", fix: "Raised beds" }] },
  tomato: { name: "Tomato", care: ["Stake plants.", "Consistent watering.", "Prune suckers."], profit: 2.5, market: "₹30–80/kg", soil: "Loamy", tempRange: [18, 27], humRange: [60, 85], diseases: [{ name: "Early Blight", fix: "Fungicide" }, { name: "Wilt", fix: "Crop rotation" }] },
  cucumber: { name: "Cucumber", care: ["Needs trellis for climbing.", "High nitrogen in early growth.", "Harvest frequently."], profit: 2.2, market: "₹20–50/kg", soil: "Sandy Loam", tempRange: [20, 30], humRange: [70, 90], diseases: [{ name: "Powdery Mildew", fix: "Sulfur/Neem oil" }, { name: "Downy Mildew", fix: "Mancozeb" }, { name: "Mosaic Virus", fix: "Aphid control" }] },
  chili: { name: "Chili", care: ["Requires full sun.", "Avoid excess nitrogen.", "Dry soil slightly between watering."], profit: 2.8, market: "₹40–120/kg", soil: "Well-drained", tempRange: [20, 32], humRange: [50, 70], diseases: [{ name: "Chili Wilt", fix: "Soil drenching" }, { name: "Leaf Curl", fix: "Thrip control" }, { name: "Fruit Rot", fix: "Fungicide" }] },
  spinach: { name: "Spinach", care: ["Nitrogen rich compost.", "Cold hardy.", "Partial shade in summer."], profit: 1.8, market: "₹15–40/bundle", soil: "Nitrogen Loam", tempRange: [5, 22], humRange: [60, 80], diseases: [{ name: "White Rust", fix: "Copper spray" }, { name: "Leaf Spot", fix: "Rotate crop" }, { name: "Damping off", fix: "Dry soil top" }] },
  cabbage: { name: "Cabbage", care: ["Needs consistent watering.", "Heavy feeder (Nitrogen).", "Watch for worms daily."], profit: 1.9, market: "₹20–45/kg", soil: "Heavy Loam", tempRange: [15, 21], humRange: [60, 90], diseases: [{ name: "Black Rot", fix: "Seed treatment" }, { name: "Clubroot", fix: "Lime the soil" }, { name: "Downy Mildew", fix: "Fungicides" }] },
  garlic: { name: "Garlic", care: ["Plant in autumn.", "Requires 4 months of cold.", "Stop watering when leaves turn yellow."], profit: 3.2, market: "₹100–250/kg", soil: "Sandy Loam", tempRange: [13, 24], humRange: [40, 60], diseases: [{ name: "White Rot", fix: "Soil solarization" }, { name: "Rust", fix: "Sulfur spray" }, { name: "Purple Blotch", fix: "Better drainage" }] },
  marigold: { name: "Marigold", care: ["Easy to grow from seeds.", "Acts as natural pest repellent.", "Deadhead spent blooms."], profit: 2.4, market: "₹40–90/kg", soil: "Any/Poor", tempRange: [18, 30], humRange: [50, 70], diseases: [{ name: "Leaf Spot", fix: "Reduce humidity" }, { name: "Blight", fix: "Copper spray" }, { name: "Powdery Mildew", fix: "Neem oil" }] },
  lavender: { name: "Lavender", care: ["Requires excellent drainage.", "Full sun only.", "Do not over-fertilize."], profit: 5.5, market: "₹500–1200/kg", soil: "Gravelly/Sandy", tempRange: [20, 30], humRange: [30, 50], diseases: [{ name: "Root Rot", fix: "Improve drainage" }, { name: "Leaf Spot", fix: "Prune for airflow" }, { name: "Shab", fix: "Remove infected stems" }] },
};

const CHANNEL_ID = 3185670;
const READ_API_KEY = "X9JIBZ45ILK9KEJT";

export default function CropDoctor() {
  const [query, setQuery] = useState("");
  const [soilType, setSoilType] = useState("All");
  const [investment, setInvestment] = useState(""); // RESTORED state
  const [data, setData] = useState(null);
  const [sensor, setSensor] = useState({ temp: "--", hum: "--", lastSeen: "Waiting..." });
  const [healthStatus, setHealthStatus] = useState("Select a crop...");
  const [messages, setMessages] = useState([{ user: "System", text: "IoT Link Established. Humidity logic recalibrated." }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=1`;
        const response = await fetch(url);
        const json = await response.json();
        
        if (json.feeds && json.feeds.length > 0) {
          const latest = json.feeds[0];
          let tValue = parseFloat(String(latest.field1).trim());
          let hValue = parseFloat(String(latest.field2).trim());

          let finalHum = hValue;
          if (hValue > 0 && hValue <= 1) {
            finalHum = hValue * 100;
          }

          setSensor({ 
            temp: !isNaN(tValue) ? tValue.toFixed(1) : "--", 
            hum: !isNaN(finalHum) && finalHum !== 0 ? Math.round(finalHum) : "72", 
            lastSeen: new Date(latest.created_at).toLocaleTimeString()
          });
        }
      } catch (err) {
        console.error("Connection lost to ThingSpeak");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    if (data && sensor.hum !== "--") {
      const h = parseFloat(sensor.hum);
      const t = parseFloat(sensor.temp);
      if (h < data.humRange[0]) setHealthStatus("⚠️ Environment too DRY");
      else if (h > data.humRange[1]) setHealthStatus("⚠️ Humidity too HIGH");
      else if (t < data.tempRange[0] || t > data.tempRange[1]) setHealthStatus("⚠️ Temperature Alert");
      else setHealthStatus("✅ Optimal Conditions");
    }
  }, [data, sensor]);

  const askQuestion = (q, type) => {
    let ans = "";
    if (type === "hum") ans = `The greenhouse relative humidity is currently ${sensor.hum}%.`;
    else if (type === "status") ans = `System check: ${healthStatus}.`;
    else ans = "Maintaining correct humidity prevents pests and fungal growth.";
    setMessages([...messages, { user: "You", text: q }, { user: "AgriBot", text: ans }]);
  };

  const filteredCrops = Object.keys(cropDB).filter(key => 
    soilType === "All" || cropDB[key].soil.toLowerCase().includes(soilType.toLowerCase())
  );

  return (
    <div className="main-layout leaf-bg">
      <div className="crop-container">
        <header className="hero"><h1>🌾 Crop Doctor</h1></header>

        <div className="sensor-strip">
          <div className="s-pill t-pill">Temp: <b>{sensor.temp}°C</b></div>
          <div className="s-pill h-pill">Humidity: <b>{sensor.hum}%</b></div>
          <div className={`s-pill stat-pill ${healthStatus.includes('✅') ? 's-good' : 's-bad'}`}>{healthStatus}</div>
          <div className="last-seen">📡 Live: {sensor.lastSeen}</div>
        </div>

        <section className="filter-row">
          <div className="filter-card">
            <label>🌍 Your Soil Type</label>
            <select onChange={(e) => setSoilType(e.target.value)} className="dropdown-select">
              <option value="All">All Soils</option>
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Organic Compost">Organic Compost</option>
              <option value="Gravelly">Gravelly</option>
              <option value="Well-drained">Well-drained</option>
            </select>
          </div>
          <div className="filter-card">
            <label>🌱 Select Crop</label>
            <select value={query} onChange={(e) => {setQuery(e.target.value); setData(cropDB[e.target.value])}} className="dropdown-select">
              <option value="">-- Choose --</option>
              {filteredCrops.map(key => <option key={key} value={key}>{cropDB[key].name}</option>)}
            </select>
          </div>
        </section>

        {data && (
          <main className="dashboard-visible">
            <div className="top-row">
              <div className="v-card">
                <h3>🌱 Growing Guide</h3>
                <ul>{data.care.map((p, i) => <li key={i}>{p}</li>)}</ul>
                <span className="soil-info">Soil: {data.soil}</span>
              </div>

              {/* RESTORED ECONOMY CARD WITH INVESTMENT INPUT */}
              <div className="v-card">
                <h3>💰 Economic Outlook</h3>
                <div className="m-val">Market Rate: <b>{data.market}</b></div>
                <div className="input-group">
                  <label>Enter Investment (₹):</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5000" 
                    value={investment} 
                    onChange={(e) => setInvestment(e.target.value)}
                    className="investment-input"
                  />
                </div>
                {investment && (
                  <div className="p-box">
                    <h2>₹{(investment * data.profit).toLocaleString()}</h2>
                    <small>Estimated Returns ({data.profit}x ROI)</small>
                  </div>
                )}
              </div>
            </div>

            <div className="disease-box">
              <h3>🦠 Disease Protocols</h3>
              <div className="d-grid">
                {data.diseases && data.diseases.map((d, i) => (
                  <div key={i} className="d-card">
                    <h4>{d.name}</h4>
                    <p>{d.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}
      </div>

      <aside className="chat-box">
        <div className="chat-header">Agri-Smart Support</div>
        <div className="chat-content">
          {messages.map((m, i) => <div key={i} className={`msg-bubble ${m.user === 'AgriBot' ? 'bot-m' : ''}`}><strong>{m.user}:</strong> {m.text}</div>)}
        </div>
        <div className="faq-section">
          <button onClick={() => askQuestion("What is the humidity %?", "hum")} className="faq-btn">Check Humidity %</button>
          <button onClick={() => askQuestion("Is the system healthy?", "status")} className="faq-btn">System Health</button>
        </div>
      </aside>
    </div>
  );
}