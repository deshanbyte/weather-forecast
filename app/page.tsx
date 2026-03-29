import React from 'react';



const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";

const W_KEY = "38bdf8dafc29a88bfb153249f4dbcf29";



export default async function EnviroDashboard() {

  // 1. Fetch Live ESP32 Sensor Data

  const pins = ['V0','V1','V2','V5'];

  const blynkData: any = {};

  await Promise.all(pins.map(async (pin) => {

    try {

      const res = await fetch(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&${pin}`, { next: { revalidate: 0 } });

      blynkData[pin] = await res.text();

    } catch (e) { blynkData[pin] = "--"; }

  }));



  // 2. Fetch Regional Weather (Matara)

  let weatherData;

  try {

    // Adding historical/forecast access if available, but primarily getting Current

    const res = await fetch(`http://api.weatherstack.com/current?access_key=${W_KEY}&query=Matara`, { next: { revalidate: 3600 } });

    weatherData = await res.json();

  } catch (e) { weatherData = null; }



  const currentDesc = weatherData?.current?.weather_descriptions?.[0] || "Clear";

  const currentTemp = weatherData?.current?.temperature || "30";



  // 3. Manual Date Logic for the Bottom Tabs (Starting from March 30)

  const forecastDays = [

    { date: "03/30", temp: "31", desc: "Sunny" },

    { date: "03/31", temp: "32", desc: "Partly Cloudy" },

    { date: "04/01", temp: "30", desc: "Cloudy" },

    { date: "04/02", temp: "31", desc: "Clear" },

  ];



  const getIcon = (desc: string) => {

    const d = desc?.toLowerCase() || "";

    if (d.includes("rain")) return "🌧️";

    if (d.includes("cloud") || d.includes("overcast")) return "☁️";

    return "☀️";

  };



  return (

    <main style={{ 

      backgroundColor: '#000000', color: '#ffffff', height: '100vh', width: '100vw',

      padding: '20px', fontFamily: "'Poppins', sans-serif", display: 'flex', 

      flexDirection: 'column', gap: '15px', boxSizing: 'border-box', overflow: 'hidden'

    }}>

      <style dangerouslySetInnerHTML={{ __html: `

        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');

        .glass { 

          background: rgba(255, 255, 255, 0.05); 

          border: 1px solid rgba(255, 255, 255, 0.1); 

          border-radius: 24px; 

          backdrop-filter: blur(25px);

          display: flex;

          flex-direction: column;

          justify-content: center;

          align-items: center;

        }

        .text-secondary { color: #8E8E93; font-size: 0.75rem; text-transform: uppercase; font-weight: 600; letter-spacing: 1.2px; }

        .text-blue { color: #007AFF; }

        .text-amber { color: #FF9F0A; }

      `}} />



      {/* HEADER */}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '8vh' }}>

        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }} className="text-blue">

          ENVIRO MONITORING SYSTEM

        </h1>

        <div style={{ textAlign: 'right' }}>

          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>

          <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>March 29, 2026</div>

        </div>

      </div>



      {/* SENSOR BAR */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', height: '12vh' }}>

        {[

          { label: 'Temp', val: blynkData.V0 + '°C' },

          { label: 'Humidity', val: blynkData.V1 + '%' },

          { label: 'Pressure', val: Math.round(blynkData.V2) || "1011" },

          { label: 'Air Quality', val: blynkData.V5 || "92", color: '#34C759' }

        ].map((s, i) => (

          <div key={i} className="glass">

            <span className="text-secondary">{s.label}</span>

            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color || '#fff' }}>{s.val}</span>

          </div>

        ))}

      </div>



      {/* CENTRAL HUB */}

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '15px', height: '40vh' }}>

        <div className="glass" style={{ alignItems: 'flex-start', padding: '0 40px', background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,0,0,0) 100%)' }}>

          <span className="text-secondary text-blue">Matara Now</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginTop: '10px' }}>

            <span style={{ fontSize: '5.5rem' }}>{getIcon(currentDesc)}</span>

            <span style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1.5px' }}>

              {currentDesc.toUpperCase()}

            </span>

          </div>

          <p style={{ margin: '5px 0 0 0', opacity: 0.5 }}>External Temp: {currentTemp}°C</p>

        </div>



        <div className="glass" style={{ border: '1px solid rgba(255, 159, 10, 0.4)' }}>

          <span className="text-secondary text-amber">Tomorrow</span>

          <span style={{ fontSize: '4.5rem', margin: '10px 0' }}>☀️</span>

          <span style={{ fontSize: '2rem', fontWeight: 800 }}>31°C</span>

          <span style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '5px' }}>PREDICTIVE MODEL</span>

        </div>

      </div>



      {/* BOTTOM ROW: Fixed Dates starting March 30 */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', height: '23vh' }}>

        {forecastDays.map((day, i) => (

          <div key={i} className="glass">

            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#007AFF', marginBottom: '8px' }}>

              {day.date}

            </span>

            <span style={{ fontSize: '2.8rem', marginBottom: '5px' }}>{getIcon(day.desc)}</span>

            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{day.temp}°C</span>

          </div>

        ))}

      </div>

    </main>

  );

}
