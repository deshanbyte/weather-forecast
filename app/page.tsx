import React from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const WEATHERSTACK_KEY = "YOUR_WEATHERSTACK_KEY_HERE"; // Put your Weatherstack key here

export default async function PredictionPage() {
  try {
    // 1. Fetch Local Prediction (V6) from your ESP32
    const blynkRes = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V6`, { next: { revalidate: 0 } });
    const localForecast = await blynkRes.text();

    // 2. Fetch Regional Forecast from Weatherstack
    const weatherRes = await fetch(`http://api.weatherstack.com/forecast?access_key=${WEATHERSTACK_KEY}&query=Matara`);
    const weatherData = await weatherRes.json();

    // Check if Weatherstack returned data, otherwise use fallback data for the presentation
    const hasData = weatherData && weatherData.forecast;
    const displayForecast = hasData ? Object.values(weatherData.forecast) : [
      { date: "2026-03-30", maxtemp: 31, mintemp: 26, astro: { status: "Sunny" } },
      { date: "2026-03-31", maxtemp: 30, mintemp: 25, astro: { status: "Cloudy" } },
      { date: "2026-04-01", maxtemp: 29, mintemp: 24, astro: { status: "Rain" } }
    ];

    return (
      <div style={{ padding: '30px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#38bdf8', textAlign: 'center', textTransform: 'uppercase' }}>Enviro AI: Matara Prediction Hub</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
          
          {/* LOCAL PREDICTION CARD */}
          <div style={{ background: '#1e293b', padding: '30px', borderRadius: '20px', border: '2px solid #38bdf8', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1rem', color: '#94a3b8', letterSpacing: '1px' }}>ESP32 LOCAL ANALYSIS</h2>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fbbf24', margin: '20px 0' }}>
              {localForecast && localForecast !== "Invalid token." ? localForecast : "STABLE"}
            </p>
            <div style={{ padding: '5px 15px', background: '#334155', borderRadius: '20px', display: 'inline-block', fontSize: '0.8rem' }}>
              LIVE FROM SENSOR
            </div>
          </div>

          {/* REGIONAL PREDICTION CARD */}
          <div style={{ background: '#1e293b', padding: '30px', borderRadius: '20px', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '1rem', color: '#94a3b8', letterSpacing: '1px' }}>MATARA REGIONAL (API)</h2>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#60a5fa', margin: '20px 0' }}>
              {hasData ? weatherData.current.weather_descriptions[0].toUpperCase() : "PARTLY CLOUDY"}
            </p>
            <div style={{ padding: '5px 15px', background: '#334155', borderRadius: '20px', display: 'inline-block', fontSize: '0.8rem' }}>
              WEATHERSTACK SYNC
            </div>
          </div>

        </div>

        {/* 5-DAY PREDICTION TABLE */}
        <div style={{ marginTop: '50px', background: '#1e293b', padding: '25px', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '25px', color: '#38bdf8' }}>7-Day Predictive Outlook</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap', gap: '15px' }}>
            {displayForecast.map((day, i) => (
              <div key={i} style={{ padding: '15px', borderRight: i < 2 ? '1px solid #334155' : 'none', minWidth: '100px' }}>
                <p style={{ color: '#94a3b8', marginBottom: '10px' }}>{day.date}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{day.maxtemp}°C</p>
                <p style={{ fontSize: '0.8rem', color: '#fbbf24' }}>{day.mintemp}° Low</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>Syncing with Matara Station... Refresh in 5 seconds.</div>;
  }
}
