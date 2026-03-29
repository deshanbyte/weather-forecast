// app/page.tsx
import React from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const WEATHER_KEY = "ba3860dafc29a88bfb153249f4dbcf29";

export default async function PredictionPage() {
  // 1. Fetch Local Prediction from ESP32 via Blynk (V6)
  const blynkRes = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V6`, { cache: 'no-store' });
  const localForecast = await blynkRes.text(); // V6 returns a string like "Rain Likely"

  // 2. Fetch Regional Forecast from OpenWeather for Matara
  const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=5.9549&lon=80.5550&appid=${WEATHER_KEY}&units=metric`, { cache: 'no-store' });
  const weatherData = await weatherRes.json();

  // Filter to get the next 5 days of data (at Noon)
  const dailyPredictions = weatherData.list.filter((item: any) => item.dt_txt.includes("12:00:00"));

  return (
    <div style={{ padding: '40px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#38bdf8' }}>Enviro AI: Predictive Analysis</h1>
      
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr', marginTop: '30px' }}>
        {/* Card 1: Local Prediction */}
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' }}>
          <h3>ESP32 Local Forecast</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>{localForecast || "Stable"}</p>
          <small>Source: Barometric Pressure Trend (V6)</small>
        </div>

        {/* Card 2: Regional Prediction */}
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' }}>
          <h3>Matara Regional Forecast</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>{dailyPredictions[0].weather[0].main}</p>
          <small>Source: OpenWeather Global Model</small>
        </div>
      </div>

      <h2 style={{ marginTop: '50px' }}>7-Day Pressure Trend (Matara)</h2>
      {/* Insert your Line Chart here using dailyPredictions */}
    </div>
  );
}
