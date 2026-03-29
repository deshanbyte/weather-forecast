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

  // Professional Static Weather Icons
  const getIcon = (desc: string) => {
    const d = desc?.toLowerCase() || "";
    if (d.includes("rain")) return "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";
    if (d.includes("cloud") || d.includes("overcast")) return "https://cdn-icons-png.flaticon.com/512/4834/4834559.png";
    return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // Sun/Clear
  };

  return (
    <div style={{ 
      backgroundColor: '#05070a', color: '#e2e8f0', height: '100vh', 
      display: 'flex', flexDirection: 'column', padding: '15px', 
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif', overflow: 'hidden', boxSizing: 'border-box' 
    }}>
      <style>{`
        @font-face { font-family: 'Aboris'; src: url('https://fonts.cdnfonts.com/s/16218/Aboris.woff') format('woff'); }
        .glass-card { background: rgba(22, 30, 49, 0.6); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .label { font-size: 0.6rem; color: #64748b; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 4px; }
        .brand-title { font-family: 'Aboris'; color: #38bdf8; letter-spacing: 4px; font-size: 1.1rem; text-shadow: 0 0 10px rgba(56, 189, 248, 0.2); }
        .data-value { font-size: 1.2rem; font-weight: 700; color: #f8fafc; }
      `}</style>

      {/* HEADER */}
      <header style={{ textAlign: 'center', height: '8vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="brand-title">ENVIRO MONITORING SYSTEM</h1>
      </header>

      {/* TOP: SENSOR GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', height: '12vh', marginBottom: '10px' }}>
        {[ {l:'Temp', v:blynkData.V0+'°'}, {l:'Hum', v:blynkData.V1+'%'}, {l:'Pres', v:Math.round(blynkData.V2)}, {l:'Air Q', v:blynkData.V5, c:'#10b981'} ].map((s, i) => (
          <div key={i} className="glass-card">
            <span className="label">{s.l}</span>
            <span className="data-value" style={{ color: s.c }}>{s.v}</span>
          </div>
        ))}
      </div>

      {/* MIDDLE: PRIMARY HUB (1.2fr to 0.8fr weighted split) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px', height: '42vh', marginBottom: '10px' }}>
        {/* CURRENT STATUS */}
        <div className="glass-card" style={{ borderLeft: '3px solid #38bdf8', padding: '20px', alignItems: 'center' }}>
          <span className="label" style={{color: '#38bdf8', marginBottom: '15px'}}>Matara Regional</span>
          <img src={getIcon(hasWeather ? weatherData.current.weather_descriptions[0] : "")} style={{ width: '60px', marginBottom: '15px' }} />
          <span style={{ fontSize: '1.8rem', fontWeight: '900', textAlign: 'center', letterSpacing: '-0.5px' }}>
            {hasWeather ? weatherData.current.weather_descriptions[0].toUpperCase() : "SYNCING"}
          </span>
        </div>

        {/* PREDICTION */}
        <div className="glass-card" style={{ borderLeft: '3px solid #fbbf24', padding: '20px' }}>
          <span className="label" style={{color: '#fbbf24', marginBottom: '15px'}}>Tomorrow</span>
          <img src={getIcon(tomorrowData ? tomorrowData.weather_descriptions[0] : "")} style={{ width: '50px', marginBottom: '15px' }} />
          <span style={{ fontSize: '1.4rem', fontWeight: '800', textAlign: 'center' }}>
             {tomorrowData ? tomorrowData.weather_descriptions[0].toUpperCase() : "ANALYZING"}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
            {tomorrowData ? `${tomorrowData.maxtemp}°C Forecast` : "--"}
          </span>
        </div>
      </div>

      {/* BOTTOM: 4-DAY OUTLOOK (CLEAN STRIP) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', height: '22vh' }}>
        {(hasWeather ? nextFourDays : [1,2,3,4]).map((day: any, i) => {
          const date = hasWeather ? day.date.split('-').slice(1).join('/') : `04/0${i+2}`;
          return (
            <div key={i} className="glass-card" style={{ padding: '8px' }}>
              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>{date}</span>
              <img src={getIcon(hasWeather ? day.weather_descriptions[0] : "Clear")} style={{ width: '25px', marginBottom: '8px' }} />
              <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>{hasWeather ? day.maxtemp : 28 + i}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
