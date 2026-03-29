return (
  <div style={{ 
    padding: '15px', 
    backgroundColor: '#0f172a', 
    color: 'white', 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    overflow: 'hidden' // Prevents accidental scrolling
  }}>
    <h1 style={{ 
      color: '#38bdf8', 
      textAlign: 'center', 
      fontSize: '1.2rem', 
      marginBottom: '15px',
      textTransform: 'uppercase' 
    }}>
      Enviro AI: Matara Prediction Hub
    </h1>
    
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '15px', 
      width: '95%', 
      margin: '0 auto' 
    }}>
      
      {/* LOCAL PREDICTION CARD */}
      <div style={{ 
        background: '#1e293b', 
        padding: '20px', 
        borderRadius: '15px', 
        border: '2px solid #38bdf8',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '0.8rem', color: '#94a3b8' }}>LOCAL ANALYSIS</h2>
        <div style={{ 
          fontSize: '1.8rem', 
          fontWeight: 'bold', 
          color: '#fbbf24', 
          margin: '10px 0',
          lineHeight: '1.2'
        }}>
          {localForecast.includes("error") ? "CALIBRATING" : localForecast.toUpperCase()}
        </div>
        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>LIVE SENSOR TREND</span>
      </div>

      {/* REGIONAL PREDICTION CARD */}
      <div style={{ 
        background: '#1e293b', 
        padding: '20px', 
        borderRadius: '15px', 
        border: '1px solid #334155',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '0.8rem', color: '#94a3b8' }}>REGIONAL (API)</h2>
        <div style={{ 
          fontSize: '1.8rem', 
          fontWeight: 'bold', 
          color: '#60a5fa', 
          margin: '10px 0',
          lineHeight: '1.2'
        }}>
          {hasData ? weatherData.current.weather_descriptions[0].toUpperCase() : "PARTLY CLOUDY"}
        </div>
        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>WEATHERSTACK SYNC</span>
      </div>
    </div>

    {/* 5-DAY PREDICTION TABLE - COMPACT */}
    <div style={{ 
      marginTop: '20px', 
      background: '#1e293b', 
      padding: '15px', 
      borderRadius: '15px',
      width: '95%',
      margin: '20px auto 0'
    }}>
      <h3 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '10px', textAlign: 'center' }}>
        7-Day Predictive Outlook
      </h3>
      <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
        {displayForecast.map((day, i) => (
          <div key={i} style={{ padding: '5px' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.7rem', margin: '0' }}>{day.date.split('-').slice(1).join('/')}</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '5px 0' }}>{day.maxtemp}°</p>
            <p style={{ fontSize: '0.6rem', color: '#fbbf24', margin: '0' }}>{day.mintemp}° L</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
