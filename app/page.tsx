import React from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const W_KEY = "38bdf8dafc29a88bfb153249f4dbcf29";

export default async function WeatherHub() {
  // 1. Fetch Live ESP32 Sensor Data
  const pins = ['V0','V1','V2','V5'];
  const blynkData: any = {};
  
  await Promise.all(pins.map(async (pin) => {
    try {
      const res = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&${pin}`, { next: { revalidate: 0 } });
      blynkData[pin] = await res.text();
    } catch (e) { blynkData[pin] = "--"; }
  }));

  // 2. Fetch Regional Satellite Forecast
  let weatherData;
  try {
    const res = await fetch(`http://api.weatherstack.com/forecast?access_key=${W_KEY}&query=Matara`, { next: { revalidate: 3600 } });
    weatherData = await res.json();
  } catch (e) { weatherData = null; }

  const hasWeather = weatherData && weatherData.current && weatherData.forecast;
  const tomorrowData = hasWeather ? Object.values(weatherData.forecast)[1] as any : null;
  const nextFourDays = hasWeather ? Object.values(weatherData.forecast).slice(2, 6) : [];

  // Icon Logic
  const getIcon = (desc: string) => {
    const d = desc?.toLowerCase() || "";
    if (d.includes("rain")) return "🌧️";
    if (d.includes("cloud") || d.includes("overcast")) return "☁️";
    if (d.includes("clear") || d.includes("sun")) return "☀️";
    return "⛅";
  };

  return (
    <div style={{ 
      backgroundColor: '#070b14', color: 'white', height: '100vh', 
      display: 'flex', flexDirection: 'column', padding: '15px', 
      fontFamily: 'sans-serif', overflow: 'hidden', boxSizing: 'border-box' 
    }}>
      <style>{`
        @font-face { font-family: 'Aboris'; src: url('https://fonts.cdnfonts.com/s/16218/Aboris.woff') format('woff'); }
        .card { background: rgba(30, 41, 59, 0.4); border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.15); backdrop-filter: blur(10px); display: flex; flex-direction: column; justify-content: center; }
        .glow-blue { color: #38bdf8; text-shadow: 0 0 8px rgba(56, 189, 248, 0.4); }
        .glow-yellow { color: #fbbf24; text-shadow: 0 0 8px rgba(251, 191, 36, 0.4); }
        @keyframes sunRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-icon { display: inline-block; animation: sunRotate 10s linear infinite; font-size: 1.5rem; }
      `}</style>

      {/* HEADER - Reduced for Mobile */}
      <header style={{ textAlign: 'center', height: '8vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontFamily: 'Aboris', fontSize: 'clamp(1rem, 4vw, 1.8rem)', letterSpacing: '2px', margin: 0 }} className="glow-blue">
          ENVIRO WEATHER MONITORING
        </h1>
      </header>

      {/* TOP: SENSOR BAR - Compact */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '10px', height: '12vh', marginBottom: '10px', border: '1px solid #38bdf8' }}>
        {[ {l:'TEMP', v:blynkData.V0+'°'}, {l:'HUM', v:blynkData.V1+'%'}, {l:'PRES', v:blynkData.V2}, {l:'AIR', v:blynkData.V5+'/100'} ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.6rem', color: '#94a3b8', margin: 0 }}>{s.l}</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* MIDDLE: MAIN HUB - Responsive Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', height: '40vh', marginBottom: '10px' }}>
        {/* CURRENT */}
        <div className="card" style={{ textAlign: 'center', padding: '10px' }}>
          <p style={{ fontSize: '0.6rem', color: '#38bdf8', letterSpacing: '1px' }}>MATARA NOW</p>
          <div className="animate-icon" style={{ margin: '5px 0' }}>{getIcon(hasWeather ? weatherData.current.weather_descriptions[0] : "")}</div>
          <div style={{ fontSize: 'clamp(1.2rem, 5vw, 2.2rem)', fontWeight: '900', color: '#60a5fa' }}>
            {hasWeather ? weatherData.current.weather_descriptions[0].toUpperCase() : "CLOUDY"}
          </div>
        </div>

        {/* TOMORROW */}
        <div className="card" style={{ textAlign: 'center', padding: '10px', border: '1px solid #fbbf24' }}>
          <p style={{ fontSize: '0.6rem', color: '#fbbf24', letterSpacing: '1px' }}>TOMORROW</p>
          <div className="animate-icon" style={{ margin: '5px 0' }}>{getIcon(tomorrowData ? tomorrowData.weather_descriptions[0] : "")}</div>
          <div style={{ fontSize: 'clamp(1.2rem, 5vw, 2.2rem)', fontWeight: '900' }} className="glow-yellow">
             {tomorrowData ? tomorrowData.weather_descriptions[0].toUpperCase() : "SUNNY"}
          </div>
        </div>
      </div>

      {/* BOTTOM: 4-DAY FORECAST - Flexible Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', height: '25vh' }}>
        {(hasWeather ? nextFourDays : [1,2,3,4]).map((day: any, i) => {
          const date = hasWeather ? day.date.split('-').slice(1).join('/') : `04/0${i+2}`;
          const desc = hasWeather ? day.weather_descriptions[0] : "Clear";
          return (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '5px' }}>
              <p style={{ fontSize: '0.6rem', color: '#38bdf8', margin: '0 0 5px 0' }}>{date}</p>
              <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{getIcon(desc)}</div>
              <p style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: 0 }}>{hasWeather ? day.maxtemp : 28 + i}°</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
