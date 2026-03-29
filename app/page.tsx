import React from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const W_KEY = "38bdf8dafc29a88bfb153249f4dbcf29"; 

export default async function Dashboard() {
  const blynkRes = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V6`, { next: { revalidate: 0 } });
  const localPrediction = await blynkRes.text();

  const weatherRes = await fetch(`http://api.weatherstack.com/forecast?access_key=${W_KEY}&query=Matara`);
  const data = await weatherRes.json();
  const hasData = data && data.forecast;

  return (
    <div style={{ backgroundColor: '#070b14', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'sans-serif', overflow: 'hidden', padding: '20px' }}>
      <style>{`
        @keyframes drift { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
        .animate-bg { animation: drift 15s linear infinite; background: linear-gradient(90deg, #1e293b, #334155, #1e293b); background-size: 200% 200%; }
      `}</style>

      <h1 style={{ textAlign: 'center', color: '#38bdf8', fontSize: '1.4rem', letterSpacing: '3px', marginBottom: '20px' }}>ENVIRO WEATHER MONITORING</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        {/* LOCAL BOX */}
        <div style={{ background: '#111827', padding: '25px', borderRadius: '20px', border: '2px solid #38bdf8', textAlign: 'center' }}>
          <h2 style={{ fontSize: '0.7rem', color: '#94a3b8' }}>LOCAL AI PREDICTION</h2>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#fbbf24', margin: '15px 0' }}>{localPrediction.includes("error") ? "STABLE" : localPrediction.toUpperCase()}</div>
          <span style={{ fontSize: '0.6rem', padding: '3px 10px', background: '#1f2937', borderRadius: '5px' }}>EDGE COMPUTING</span>
        </div>

        {/* REGIONAL BOX WITH ANIMATION */}
        <div className="animate-bg" style={{ padding: '25px', borderRadius: '20px', border: '1px solid #334155', textAlign: 'center' }}>
          <h2 style={{ fontSize: '0.7rem', color: '#94a3b8' }}>MATARA REGIONAL</h2>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#60a5fa', margin: '15px 0' }}>{hasData ? data.current.weather_descriptions[0].toUpperCase() : "PARTLY CLOUDY"}</div>
          <span style={{ fontSize: '0.6rem', padding: '3px 10px', background: '#0f172a', borderRadius: '5px' }}>API SYNC</span>
        </div>

      </div>

      {/* 5-DAY OUTLOOK */}
      <div style={{ marginTop: '30px', background: '#111827', padding: '20px', borderRadius: '20px', maxWidth: '900px', margin: '30px auto 0', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {hasData ? Object.values(data.forecast).slice(0, 5).map((day, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{day.date.split('-').slice(1).join('/')}</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{day.maxtemp}°</p>
              <p style={{ fontSize: '0.6rem', color: '#fbbf24' }}>{day.mintemp}° L</p>
            </div>
          )) : <p>Loading regional trends...</p>}
        </div>
      </div>
    </div>
  );
}
