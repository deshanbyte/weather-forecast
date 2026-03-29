import React from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const W_KEY = "38bdf8dafc29a88bfb153249f4dbcf29";

export default async function WeatherHub() {
  // 1. Fetch Live ESP32 Data for the Top Bar & Prediction
  const pins = ['V0','V1','V2','V5','V6'];
  const blynkData: any = {};
  
  await Promise.all(pins.map(async (pin) => {
    try {
      const res = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&${pin}`, { next: { revalidate: 0 } });
      blynkData[pin] = await res.text();
    } catch (e) { blynkData[pin] = "0"; }
  }));

  // 2. Fetch Regional Satellite Data
  let weatherData;
  try {
    const res = await fetch(`http://api.weatherstack.com/forecast?access_key=${W_KEY}&query=Matara`, { next: { revalidate: 3600 } });
    weatherData = await res.json();
  } catch (e) { weatherData = null; }

  const hasWeather = weatherData && weatherData.current;
  const forecastDays = hasWeather ? Object.values(weatherData.forecast).slice(1, 5) : [];

  return (
    <div style={{ backgroundColor: '#070b14', color: 'white', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
      <style>{`
        @font-face { font-family: 'Aboris'; src: url('https://fonts.cdnfonts.com/s/16218/Aboris.woff') format('woff'); }
        .card { background: rgba(30, 41, 59, 0.5); border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.2); backdrop-filter: blur(10px); }
        .glow-text { color: #38bdf8; text-shadow: 0 0 10px rgba(56, 189, 248, 0.5); }
      `}</style>

      {/* TITLE SECTION */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'Aboris', fontSize: '2.2rem', letterSpacing: '5px' }} className="glow-text">
          ENVIRO WEATHER MONITORING SYSTEM
        </h1>
      </header>

      {/* TOP PART: LIVE SENSOR READINGS (Horizontal Bar) */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-around', padding: '20px', marginBottom: '30px', border: '2px solid #38bdf8' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TEMPERATURE</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{blynkData.V0}°C</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>HUMIDITY</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{blynkData.V1}%</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PRESSURE</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{blynkData.V2} hPa</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>AIR QUALITY</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{blynkData.V5}/100</p>
        </div>
      </div>

      {/* MIDDLE PART: TWO MAIN TABS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* TAB 1: MATARA CURRENT STATUS */}
        <div className="card" style={{ padding: '40px', textAlign: 'center', position: 'relative' }}>
          <p style={{ fontSize: '0.8rem', color: '#38bdf8', letterSpacing: '2px', marginBottom: '20px' }}>MATARA CURRENTLY</p>
          <div style={{ fontSize: '3rem', fontWeight: '800', textTransform: 'uppercase', color: '#60a5fa' }}>
            {hasWeather ? weatherData.current.weather_descriptions[0] : "Cloudy"}
          </div>
          <p style={{ fontSize: '1.2rem', marginTop: '10px', opacity: 0.8 }}>Real-time Satellite Sync</p>
        </div>

        {/* TAB 2: TOMORROW'S PREDICTION */}
        <div className="card" style={{ padding: '40px', textAlign: 'center', border: '1px solid #fbbf24' }}>
          <p style={{ fontSize: '0.8rem', color: '#fbbf24', letterSpacing: '2px', marginBottom: '20px' }}>TOMORROW'S FORECAST</p>
          <div style={{ fontSize: '3rem', fontWeight: '800', textTransform: 'uppercase', color: '#fbbf24' }}>
            {blynkData.V6 && !blynkData.V6.includes("error") ? blynkData.V6 : "Sunny"}
          </div>
          <p style={{ fontSize: '1.2rem', marginTop: '10px', opacity: 0.8 }}>Edge AI Local Analysis</p>
        </div>
      </div>

      {/* BOTTOM PART: NEXT 4 DAYS SEPARATELY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {(hasWeather ? forecastDays : [1,2,3,4]).map((day: any, i) => (
          <div key={i} className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '10px' }}>
              {hasWeather ? day.date : `Day ${i+2}`}
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{hasWeather ? day.maxtemp : 28 + i}°C</p>
            <p style={{ fontSize: '0.8rem', color: '#fbbf24' }}>{hasWeather ? day.mintemp : 24}° L</p>
          </div>
        ))}
      </div>

    </div>
  );
}
