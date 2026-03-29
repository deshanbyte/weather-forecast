import React from 'react';

const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";
const W_KEY = "38bdf8dafc29a88bfb153249f4dbcf29"; 

export default async function Dashboard() {
  const blynkRes = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V6`, { next: { revalidate: 0 } });
  const tomorrow = await blynkRes.text();

  const weatherRes = await fetch(`http://api.weatherstack.com/forecast?access_key=${W_KEY}&query=Matara`);
  const data = await weatherRes.json();
  const current = data && data.current ? data.current.weather_descriptions[0] : "Cloudy";

  return (
    <div style={{ backgroundColor: '#070b14', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden', padding: '20px' }}>
      <style>{`
        @font-face { font-family: 'Aboris'; src: url('https://fonts.cdnfonts.com/s/16218/Aboris.woff') format('woff'); }
        @keyframes bgMove { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
        .weather-card { animation: bgMove 10s linear infinite; background: linear-gradient(90deg, #1e293b, #334155, #1e293b); background-size: 200% 200%; }
      `}</style>

      <h1 style={{ textAlign: 'center', color: '#38bdf8', fontSize: '1.4rem', fontFamily: 'Aboris, sans-serif', letterSpacing: '4px', marginBottom: '25px' }}>
        ENVIRO WEATHER FORECAST
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        {/* TOMORROW PREDICTION */}
        <div style={{ background: '#111827', padding: '30px', borderRadius: '20px', border: '2px solid #38bdf8', textAlign: 'center' }}>
          <h2 style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TOMORROW'S PREDICTION</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24', margin: '15px 0' }}>{tomorrow.toUpperCase()}</div>
          <span style={{ fontSize: '0.6rem', padding: '4px 12px', background: '#1f2937', borderRadius: '10px' }}>HYBRID AI TREND</span>
        </div>

        {/* CURRENT REGIONAL ANIMATED */}
        <div className="weather-card" style={{ padding: '30px', borderRadius: '20px', border: '1px solid #334155', textAlign: 'center' }}>
          <h2 style={{ fontSize: '0.7rem', color: '#94a3b8' }}>CURRENTLY IN MATARA</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#60a5fa', margin: '15px 0' }}>{current.toUpperCase()}</div>
          <span style={{ fontSize: '0.6rem', padding: '4px 12px', background: '#0f172a', borderRadius: '10px' }}>SATELLITE DATA</span>
        </div>
      </div>

      <div style={{ marginTop: '40px', background: '#111827', padding: '20px', borderRadius: '20px', border: '1px solid #1f2937', maxWidth: '900px', margin: '40px auto 0', width: '100%' }}>
         <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase' }}>5-Day Regional Outlook System Active</p>
      </div>
    </div>
  );
}
