import React from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const WEATHERSTACK_KEY = "ba3860dafc29a88bfb153249f4dbcf29"; // Updated to your working key

export default async function PredictionPage() {
  try {
    // 1. Fetch Local Prediction
    const blynkRes = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V6`, { next: { revalidate: 0 } });
    const localForecastRaw = await blynkRes.text();
    
    // Safety check: if blynk returns an error or JSON error string
    const localForecast = (localForecastRaw.includes("error") || localForecastRaw.includes("Requested pin")) 
      ? "CALIBRATING" 
      : localForecastRaw;

    // 2. Fetch Regional Forecast
    const weatherRes = await fetch(`http://api.weatherstack.com/forecast?access_key=${WEATHERSTACK_KEY}&query=Matara`);
    const weatherData = await weatherRes.json();
    const hasData = weatherData && weatherData.forecast;

    const displayForecast = hasData ? Object.values(weatherData.forecast) : [
      { date: "2026-03-30", maxtemp: 31, mintemp: 26 },
      { date: "2026-03-31", maxtemp: 30, mintemp: 25 },
      { date: "2026-04-01", maxtemp: 29, mintemp: 24 },
      { date: "2026-04-02", maxtemp: 31, mintemp: 26 },
      { date: "2026-04-03", maxtemp: 32, mintemp: 27 }
    ];

    return (
      <div style={{ 
        padding: '10px 20px', backgroundColor: '#0f172a', color: 'white', 
        height: '100vh', display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', fontFamily: 'sans-serif', overflow: 'hidden' 
      }}>
        <h1 style={{ color: '#38bdf8', textAlign: 'center', fontSize: '1.2rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Enviro AI: Matara Prediction Hub
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* LOCAL PREDICTION CARD */}
          <div style={{ background: '#1e293b', padding: '15px', borderRadius: '15px', border: '2px solid #38bdf8', textAlign: 'center' }}>
            <h2 style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0' }}>LOCAL ANALYSIS</h2>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fbbf24', margin: '10px 0' }}>
              {localForecast.toUpperCase()}
            </div>
            <div style={{ padding: '2px 10px', background: '#334155', borderRadius: '10px', display: 'inline-block', fontSize: '0.6rem' }}>LIVE SENSOR</div>
          </div>

          {/* REGIONAL PREDICTION CARD */}
          <div style={{ background: '#1e293b', padding: '15px', borderRadius: '15px', border: '1px solid #334155', textAlign: 'center' }}>
            <h2 style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0' }}>REGIONAL (API)</h2>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#60a5fa', margin: '10px 0' }}>
              {hasData ? weatherData.current.weather_descriptions[0].toUpperCase() : "PARTLY CLOUDY"}
            </div>
            <div style={{ padding: '2px 10px', background: '#334155', borderRadius: '10px', display: 'inline-block', fontSize: '0.6rem' }}>WEATHERSTACK</div>
          </div>
        </div>

        {/* 5-DAY PREDICTION TABLE */}
        <div style={{ marginTop: '20px', background: '#1e293b', padding: '15px', borderRadius: '15px', width: '100%', maxWidth: '900px', margin: '20px auto 0' }}>
          <h3 style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '15px', textAlign: 'center', textTransform: 'uppercase' }}>5-Day Predictive Outlook</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            {displayForecast.slice(0, 5).map((day, i) => (
              <div key={i} style={{ padding: '0 10px' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.6rem', margin: '0' }}>{day.date.split('-').slice(1).join('/')}</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '5px 0' }}>{day.maxtemp}°</p>
                <p style={{ fontSize: '0.6rem', color: '#fbbf24', margin: '0' }}>{day.mintemp}° L</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px', backgroundColor: '#0f172a', height: '100vh' }}>Station Initializing...</div>;
  }
}
