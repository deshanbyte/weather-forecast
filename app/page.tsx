"use client"; // This is the secret to making the clock tick!

import React, { useState, useEffect } from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const W_KEY = "38bdf8dafc29a88bfb153249f4dbcf29";

export default function EnviroDashboard() {
  const [blynkData, setBlynkData] = useState<any>({});
  const [weather, setWeather] = useState<any>(null);
  const [time, setTime] = useState(new Date());

  // 1. LIVE CLOCK TICK
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. FETCH DATA ON LOAD
  useEffect(() => {
    const fetchData = async () => {
      const pins = ['V0','V1','V2','V5'];
      const data: any = {};
      await Promise.all(pins.map(async (pin) => {
        try {
          const res = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&${pin}`);
          data[pin] = await res.text();
        } catch (e) { data[pin] = "--"; }
      }));
      setBlynkData(data);

      try {
        const res = await fetch(`http://api.weatherstack.com/current?access_key=${W_KEY}&query=Matara`);
        const wData = await res.json();
        setWeather(wData);
      } catch (e) { console.error(e); }
    };

    fetchData();
    const dataInterval = setInterval(fetchData, 30000); // Auto-refresh data every 30s
    return () => clearInterval(dataInterval);
  }, []);

  const currentDesc = weather?.current?.weather_descriptions?.[0] || "Clear";
  const currentTemp = weather?.current?.temperature || "30";

  const forecastDays = [
    { date: "03/30", temp: "31", desc: "Sunny" },
    { date: "03/31", temp: "32", desc: "Partly" },
    { date: "04/01", temp: "30", desc: "Cloudy" },
    { date: "04/02", temp: "31", desc: "Clear" },
  ];

  const getIcon = (desc: string) => {
    const d = desc?.toLowerCase() || "";
    if (d.includes("rain")) return "🌧️";
    if (d.includes("cloud") || d.includes("overcast")) return "☁️";
    return "☀️";
  };

  return (
    <main style={{ 
      backgroundColor: '#000000', color: '#ffffff', height: '100vh', width: '100vw',
      padding: 'clamp(10px, 4vw, 20px)', fontFamily: "'Poppins', sans-serif", display: 'flex', 
      flexDirection: 'column', gap: '10px', boxSizing: 'border-box', overflow: 'hidden'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');
        .glass { 
          background: rgba(255, 255, 255, 0.05); 
          border: 1px solid rgba(255, 255, 255, 0.1); 
          border-radius: 20px; 
          backdrop-filter: blur(25px);
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          padding: 10px;
        }
        .text-secondary { color: #8E8E93; font-size: 0.65rem; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; }
        .text-blue { color: #007AFF; }
        .text-amber { color: #FF9F0A; }
        @media (max-width: 600px) {
          .main-grid { grid-template-columns: 1fr !important; grid-template-rows: 1fr 1fr !important; }
          .hide-mobile { display: none; }
        }
      `}} />

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '7vh' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(1rem, 5vw, 1.4rem)', fontWeight: 800 }} className="text-blue">
          ENVIRO HUB
        </h1>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, tabularNums: true }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>March 29, 2026</div>
        </div>
      </div>

      {/* SENSOR BAR - Auto scrolls or wraps on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', height: '12vh' }}>
        {[
          { label: 'Temp', val: (blynkData.V0 || '--') + '°C' },
          { label: 'Humid', val: (blynkData.V1 || '--') + '%' },
          { label: 'Press', val: Math.round(blynkData.V2) || "1011" },
          { label: 'Air Q', val: blynkData.V5 || "92", color: '#34C759' }
        ].map((s, i) => (
          <div key={i} className="glass">
            <span className="text-secondary">{s.label}</span>
            <span style={{ fontSize: 'clamp(1rem, 4vw, 1.4rem)', fontWeight: 700, color: s.color || '#fff' }}>{s.val}</span>
          </div>
        ))}
      </div>

      {/* CENTRAL HUB - Stacked on Mobile */}
      <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px', flexGrow: 1, minHeight: 0 }}>
        <div className="glass" style={{ alignItems: 'flex-start', padding: '20px 30px', background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,0,0,0) 100%)' }}>
          <span className="text-secondary text-blue">Matara Now</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '5px' }}>
            <span style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}>{getIcon(currentDesc)}</span>
            <span style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: 800 }}>{currentDesc.toUpperCase()}</span>
          </div>
          <p style={{ margin: '5px 0 0 0', opacity: 0.4, fontSize: '0.7rem' }}>External: {currentTemp}°C</p>
        </div>

        <div className="glass" style={{ border: '1px solid rgba(255, 159, 10, 0.3)' }}>
          <span className="text-secondary text-amber">Tomorrow</span>
          <span style={{ fontSize: '3rem', margin: '5px 0' }}>☀️</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>31°C</span>
        </div>
      </div>

      {/* BOTTOM ROW - Forecast */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', height: '22vh' }}>
        {forecastDays.map((day, i) => (
          <div key={i} className="glass">
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#007AFF', marginBottom: '4px' }}>{day.date}</span>
            <span style={{ fontSize: '2rem' }}>{getIcon(day.desc)}</span>
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>{day.temp}°</span>
          </div>
        ))}
      </div>
    </main>
  );
}
