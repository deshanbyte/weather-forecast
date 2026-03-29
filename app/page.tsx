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

  const getIcon = (desc: string) => {
    const d = desc?.toLowerCase() || "";
    if (d.includes("rain")) return "🌧️";
    if (d.includes("cloud") || d.includes("overcast")) return "☁️";
    if (d.includes("clear") || d.includes("sun")) return "☀️";
    return "⛅";
  };

  return (
    <div style={{ 
      backgroundColor: '#05070a', color: '#e2e8f0', height: '100vh', 
      display: 'flex', flexDirection: 'column', padding: '20px', 
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', overflow: 'hidden', boxSizing: 'border-box' 
    }}>
      <style>{`
        @font-face { font-family: 'Aboris'; src: url('https://fonts.cdnfonts.com/s/16218/Aboris.woff') format('woff'); }
        .glass-card { background: rgba(22, 30, 49, 0.7); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); display: flex; flex-direction: column; justify-content: center; align-items: center; transition: all 0.3s ease; }
        .label-text { font-size: 0.6rem; color: #94a3b8; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
        .brand-header { font-family: 'Aboris'; color: #38bdf8; letter-spacing: 5px; font-size: 1.4rem; text-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }
      `}</style>

      {/* HEADER */}
      <header style={{ textAlign: 'center', height: '10vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="brand-header">ENVIRO MONITORING SYSTEM</h1>
      </header>

      {/* TOP: LIVE SENSOR BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', height: '12vh', marginBottom: '15px' }}>
        {[ {l:'Temperature', v:blynkData.V0+'°C'}, {l:'Humidity', v:blynkData.V1+'%'}, {l:'Pressure', v:Math.round(blynkData.V2)}, {l:'Air Quality', v:blynkData.V5, c:'#10b981'} ].map((s, i) => (
          <div key={i} className="glass-card">
            <span className="label-text">{s.l}</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: s.c || '#f8fafc' }}>{s.v}</span>
          </div>
        ))}
      </div>

      {/* MIDDLE: PRIMARY DATA HUB */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '15px', height: '43vh', marginBottom: '15px' }}>
        {/* CURRENT STATUS */}
        <div className="glass-card" style={{ borderTop: '2px solid #38bdf8', alignItems: 'flex-start', paddingLeft: '40px' }}>
          <span className="label-text" style={{color: '#38bdf8'}}>Matara Regional Status</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
            <span style={{ fontSize: '4.5rem' }}>{getIcon(hasWeather ? weatherData.current.weather_descriptions[0] : "")}</span>
            <span style={{ fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1px' }}>
              {hasWeather ? weatherData.current.weather_descriptions[0].toUpperCase() : "SYNCING"}
            </span>
          </div>
        </div>

        {/* PREDICTION */}
        <div className="glass-card" style={{ borderTop: '2px solid #fbbf24' }}>
          <span className="label-text" style={{color: '#fbbf24'}}>Tomorrow</span>
          <span style={{ fontSize: '3.5rem', margin: '15px 0' }}>{getIcon(tomorrowData ? tomorrowData.weather_descriptions[0] : "")}</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '800' }}>
             {tomorrowData ? tomorrowData.weather_descriptions[0].toUpperCase() : "ANALYZING"}
          </span>
          <span style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '8px' }}>
            {tomorrowData ? `High of ${tomorrowData.maxtemp}°C` : "Calculating Trend"}
          </span>
        </div>
      </div>

      {/* BOTTOM: 4-DAY OUTLOOK */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', height: '20vh' }}>
        {(hasWeather ? nextFourDays : [1,2,3,4]).map((day: any, i) => {
          const date = hasWeather ? day.date.split('-').slice(1).join('/') : `04/0${i+2}`;
          return (
            <div key={i} className="glass-card" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', marginBottom: '8px' }}>{date}</span>
              <span style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{getIcon(hasWeather ? day.weather_descriptions[0] : "Clear")}</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '800' }}>{hasWeather ? day.maxtemp : 28 + i}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
