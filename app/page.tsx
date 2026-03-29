import React from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const W_KEY = "38bdf8dafc29a88bfb153249f4dbcf29";

export default async function WeatherHub() {
  const pins = ['V0','V1','V2','V5'];
  const blynkData: any = {};
  
  await Promise.all(pins.map(async (pin) => {
    try {
      const res = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&${pin}`, { next: { revalidate: 0 } });
      blynkData[pin] = await res.text();
    } catch (e) { blynkData[pin] = "--"; }
  }));

  let weatherData;
  try {
    const res = await fetch(`http://api.weatherstack.com/forecast?access_key=${W_KEY}&query=Matara`, { next: { revalidate: 3600 } });
    weatherData = await res.json();
  } catch (e) { weatherData = null; }

  const hasWeather = weatherData && weatherData.current && weatherData.forecast;
  const tomorrowData = hasWeather ? Object.values(weatherData.forecast)[1] as any : null;
  const nextFiveDays = hasWeather ? Object.values(weatherData.forecast).slice(1, 6) : [];

  const getIcon = (desc: string) => {
    const d = desc?.toLowerCase() || "";
    if (d.includes("rain")) return "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";
    if (d.includes("cloud") || d.includes("overcast")) return "https://cdn-icons-png.flaticon.com/512/4834/4834559.png";
    return "https://cdn-icons-png.flaticon.com/512/869/869869.png";
  };

  return (
    <div style={{ 
      backgroundColor: '#0f1115', color: '#ffffff', height: '100vh', 
      display: 'flex', flexDirection: 'column', padding: '20px', 
      fontFamily: '"Inter", sans-serif', overflow: 'hidden', boxSizing: 'border-box' 
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        @font-face { font-family: 'Aboris'; src: url('https://fonts.cdnfonts.com/s/16218/Aboris.woff') format('woff'); }
        .glass { background: rgba(25, 28, 35, 0.7); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); }
        .stat-card { padding: 15px; display: flex; flex-direction: column; justify-content: center; }
        .label { font-size: 0.7rem; color: #71717a; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .value { font-size: 1.4rem; font-weight: 800; margin-top: 4px; }
        .glow-blue { color: #38bdf8; text-shadow: 0 0 20px rgba(56, 189, 248, 0.3); }
      `}</style>

      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '8vh', marginBottom: '10px' }}>
        <h1 style={{ fontFamily: 'Aboris', fontSize: '1.2rem', letterSpacing: '3px' }} className="glow-blue">ENVIRO HUB</h1>
        <div style={{ fontSize: '0.8rem', color: '#71717a' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
      </header>

      {/* TOP: MAIN WEATHER DISPLAY (Weighted Left) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '20px', height: '35vh', marginBottom: '20px' }}>
        <div className="glass" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '40px', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(25, 28, 35, 0.7) 100%)' }}>
          <img src={getIcon(hasWeather ? weatherData.current.weather_descriptions[0] : "")} style={{ width: '100px' }} />
          <div>
            <div style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1' }}>{blynkData.V0 || "30"}°</div>
            <div style={{ fontSize: '1.2rem', color: '#94a3b8', marginTop: '5px' }}>{hasWeather ? weatherData.current.weather_descriptions[0] : "Partly Cloudy"}</div>
            <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '10px' }}>Matara, Sri Lanka</div>
          </div>
        </div>
        
        <div className="glass stat-card" style={{ textAlign: 'center' }}>
          <span className="label" style={{ color: '#fbbf24' }}>Tomorrow</span>
          <img src={getIcon(tomorrowData?.weather_descriptions[0])} style={{ width: '50px', margin: '15px auto' }} />
          <span className="value">{tomorrowData?.maxtemp || "31"}°</span>
          <span style={{ fontSize: '0.7rem', color: '#71717a' }}>Mostly Sunny</span>
        </div>
      </div>

      {/* MIDDLE: SENSOR HIGHLIGHTS (Horizontal Row) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', height: '15vh', marginBottom: '20px' }}>
        <div className="glass stat-card">
          <span className="label">Humidity</span>
          <span className="value">{blynkData.V1 || "74"}%</span>
          <div style={{ height: '4px', background: '#38bdf8', width: '70%', borderRadius: '2px', marginTop: '10px' }}></div>
        </div>
        <div className="glass stat-card">
          <span className="label">Pressure</span>
          <span className="value">{Math.round(blynkData.V2) || "1010"}</span>
          <span style={{ fontSize: '0.6rem', color: '#71717a' }}>hPa</span>
        </div>
        <div className="glass stat-card">
          <span className="label">Air Quality</span>
          <span className="value" style={{ color: '#10b981' }}>{blynkData.V5 || "Excellent"}</span>
          <span style={{ fontSize: '0.6rem', color: '#71717a' }}>Index Level</span>
        </div>
        <div className="glass stat-card">
          <span className="label">Wind Speed</span>
          <span className="value">12</span>
          <span style={{ fontSize: '0.6rem', color: '#71717a' }}>km/h</span>
        </div>
      </div>

      {/* BOTTOM: 5-DAY PREDICTIVE (Sleek Vertical/Horizontal Mix) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', height: '20vh' }}>
        {nextFiveDays.map((day: any, i) => (
          <div key={i} className="glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
            <span style={{ fontSize: '0.7rem', color: '#71717a', marginBottom: '8px' }}>{day.date.split('-').slice(1).join('/')}</span>
            <img src={getIcon(day.weather_descriptions[0])} style={{ width: '30px', marginBottom: '8px' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{day.maxtemp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
