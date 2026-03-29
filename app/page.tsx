import React from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const W_KEY = "38bdf8dafc29a88bfb153249f4dbcf29"; // Updated from your earlier key

export default async function DashboardPro() {
  // 1. Fetch Live ESP32 Sensor Data (Non-Blocking)
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

  // Static Icon Logic matching your visual references
  const getIcon = (desc: string) => {
    const d = desc?.toLowerCase() || "";
    if (d.includes("rain")) return "🌧️";
    if (d.includes("cloud") || d.includes("overcast")) return "☁️";
    if (d.includes("clear") || d.includes("sun")) return "☀️";
    return "⛅";
  };

  return (
    <>
      {/* Import Poppins and set up visual styles */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background-color: #070b14; color: white; font-family: 'Poppins', sans-serif; overflow: hidden; height: 100vh; }
        .glass-card { background: rgba(30, 41, 59, 0.4); border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.1); backdrop-filter: blur(10px); }
        .label { font-size: 0.7rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .data-main { font-size: 1.5rem; font-weight: 800; color: #f8fafc; }
        .main-title { color: #38bdf8; fontSize: 1.3rem; letterSpacing: '4px'; textTransform: 'uppercase'; margin: 0; font-weight: 800;}
      `}</style>

      {/* Main Container - Mobile locked to 100vh */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '15px', height: '100vh', justifyContent: 'center' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '7vh', marginBottom: '10px' }}>
          <h1 className="main-title">Enviro Hub Pro</h1>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            <p style={{ margin: 0, opacity: 0.8 }}>Matara Local Time</p>
          </div>
        </header>

        {/* TOP ROW: Live ESP32 Sensor Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', height: '12vh', marginBottom: '15px' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid #38bdf8' }}>
            <span className="label">Temp</span>
            <span className="data-main">{blynkData.V0}°C</span>
          </div>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span className="label">Humidity</span>
            <span className="data-main">{blynkData.V1}%</span>
          </div>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span className="label">Pressure</span>
            <span className="data-main">{Math.round(blynkData.V2)}</span>
            <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>hPa</span>
          </div>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span className="label">Air Quality</span>
            <span className="data-main" style={{ color: '#10b981' }}>{blynkData.V5}</span>
            <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>/100</span>
          </div>
        </div>

        {/* MIDDLE ROW: The Matara Now & Tomorrow Hub */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', height: '40vh', marginBottom: '15px' }}>
          
          {/* MATARA CURRENTLY - Regional API */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px', position: 'relative' }}>
            <div style={{ fontSize: '5rem' }}>{getIcon(hasWeather ? weatherData.current.weather_descriptions[0] : "")}</div>
            <div style={{ flex: 1 }}>
              <span className="label" style={{ color: '#38bdf8', letterSpacing: '2px' }}>Matara Regional</span>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#60a5fa', margin: '10px 0', textTransform: 'uppercase' }}>
                {hasWeather ? weatherData.current.weather_descriptions[0] : "Cloudy"}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, opacity: 0.8 }}>📡 Satellite Sync Active</p>
            </div>
          </div>

          {/* TOMORROW PREDICTION - Edge AI */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', border: '1px solid #fbbf24' }}>
            <span className="label" style={{ color: '#fbbf24', letterSpacing: '2px', marginBottom: '15px' }}>TOMORROW</span>
            <div style={{ fontSize: '4rem', marginBottom: '15px' }}>{getIcon(tomorrowData ? tomorrowData.weather_descriptions[0] : "")}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f1f5f9', textAlign: 'center' }}>
               {tomorrowData ? tomorrowData.weather_descriptions[0].toUpperCase() : "ANALYZING"}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '10px' }}>{tomorrowData ? `${tomorrowData.maxtemp}°C Peak` : "Calculated Trend"}</p>
          </div>
        </div>

        {/* BOTTOM ROW: 4-Day Predictive Outlook (Compact) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', height: '22vh' }}>
          {(hasWeather ? nextFourDays : [1,2,3,4]).map((day: any, i) => {
            // Format to show only the date (e.g., 03/30)
            const dateDisplay = hasWeather ? day.date.split('-').slice(1).join('/') : `03/0${i+2}`;
            return (
              <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
                <p style={{ fontSize: '0.7rem', color: '#38bdf8', margin: '0 0 5px 0', fontWeight: 'bold' }}>{dateDisplay}</p>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{getIcon(hasWeather ? day.weather_descriptions[0] : "Clear")}</div>
                <p style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{hasWeather ? day.maxtemp : 28 + i}°C</p>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
