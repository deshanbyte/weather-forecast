import React from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const W_KEY = "38bdf8dafc29a88bfb153249f4dbcf29";

export default async function EnviroHub() {
  // Fetch Local AI Prediction from ESP32
  const blynkRes = await fetch(
    `https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V6`, 
    { next: { revalidate: 0 } }
  );
  const rawBlynkData = await blynkRes.text();
  
  // Clean up Blynk errors and format the "Tomorrow" text
  const predictionValue = (rawBlynkData.includes("error") || rawBlynkData.includes("pin")) 
    ? "CALIBRATING" 
    : rawBlynkData.toUpperCase();

  // Fetch Regional Data for Matara
  const weatherRes = await fetch(
    `http://api.weatherstack.com/forecast?access_key=${W_KEY}&query=Matara`,
    { next: { revalidate: 3600 } }
  );
  const data = await weatherRes.json();
  const hasData = data && data.current && data.forecast;

  return (
    <div style={{ backgroundColor: '#070b14', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 20px', overflowX: 'hidden' }}>
      
      {/* ABORIS STYLE HEADER */}
      <style>{`
        @font-face { font-family: 'Aboris'; src: url('https://fonts.cdnfonts.com/s/16218/Aboris.woff') format('woff'); }
        @keyframes pulseBg { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
        .bg-glow { position: absolute; width: 100%; height: 100%; top: 0; left: 0; background: radial-gradient(circle at 50% 50%, #1e293b 0%, transparent 70%); z-index: -1; animation: pulseBg 8s ease-in-out infinite; }
      `}</style>
      
      <div className="bg-glow" />

      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontFamily: 'Aboris, sans-serif', color: '#38bdf8', fontSize: '1.8rem', letterSpacing: '4px', textTransform: 'uppercase' }}>
          ENVIRO WEATHER MONITORING SYSTEM
        </h1>
      </header>

      {/* MAIN DATA CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        
        {/* ESP32 PREDICTION */}
        <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '2px solid #38bdf8', borderRadius: '24px', padding: '35px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '2px' }}>TOMORROW</p>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#fbbf24', margin: '20px 0' }}>
            {predictionValue}
          </div>
          <span style={{ fontSize: '0.6rem', background: '#1e293b', padding: '5px 15px', borderRadius: '20px', color: '#38bdf8' }}>EDGE COMPUTING</span>
        </div>

        {/* REGIONAL SATELLITE */}
        <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '24px', padding: '35px', textAlign: 'center', border: '1px solid #334155' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '2px' }}>MATARA REGIONAL</p>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#60a5fa', margin: '20px 0' }}>
            {hasData ? data.current.weather_descriptions[0].toUpperCase() : "SYNCING..."}
          </div>
          <span style={{ fontSize: '0.6rem', background: '#0f172a', padding: '5px 15px', borderRadius: '20px' }}>API SYNC</span>
        </div>

      </div>

      {/* 5-DAY PREDICTIVE OUTLOOK */}
      <div style={{ maxWidth: '1100px', margin: '40px auto', width: '100%', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '24px', padding: '30px', border: '1px solid #1e293b' }}>
        <p style={{ color: '#38bdf8', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '30px', letterSpacing: '1px' }}>
          5-Day Predictive Outlook
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
          {hasData ? Object.values(data.forecast).slice(0, 5).map((day: any, i) => (
            <div key={i} style={{ textAlign: 'center', flex: '1', minWidth: '120px', padding: '15px', borderRadius: '15px', background: '#111827' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '10px' }}>{day.date.split('-').slice(1).join('/')}</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '5px 0' }}>{day.maxtemp}°</p>
              <p style={{ fontSize: '0.7rem', color: '#fbbf24' }}>{day.mintemp}° L</p>
            </div>
          )) : (
            <p style={{ width: '100%', textAlign: 'center', opacity: 0.5 }}>Loading regional trends...</p>
          )}
        </div>
      </div>

    </div>
  );
}
