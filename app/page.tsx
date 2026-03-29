"use client";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Thermometer, Wind, Droplets, Activity, CloudRain } from 'lucide-react';

export default function WeatherDashboard() {
  const [liveData, setLiveData] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const BLYNK_TOKEN = "pM0_GwoRXsJuSq8FARjyv5YEt1SuZW1D";

  useEffect(() => {
    // 1. Fetch 7-Day History for Homagama (Memory)
    fetch("https://archive-api.open-meteo.com/v1/archive?latitude=6.8403&longitude=80.0034&start_date=2026-03-22&end_date=2026-03-29&hourly=temperature_2m,surface_pressure")
      .then(res => res.json())
      .then(data => {
        const formatted = data.hourly.time.map((t: any, i: number) => ({
          time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: data.hourly.temperature_2m[i],
          pressure: data.hourly.surface_pressure[i]
        })).filter((_: any, index: number) => index % 12 === 0); // Show data every 12 hours
        setHistory(formatted);
      });

    // 2. Fetch Live Data from Blynk (Nerves)
    const fetchData = () => {
      fetch(`https://blynk.cloud/external/api/getAll?token=${BLYNK_TOKEN}`)
        .then(res => res.json())
        .then(data => setLiveData(data))
        .catch(err => console.error("Blynk Error:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">ENVIRO <span className="text-blue-500">AI</span></h1>
            <p className="text-slate-500 text-sm">Trend-Based Forecast System | Homagama Station</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 px-4 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 text-xs font-mono uppercase">Live Station Active</span>
          </div>
        </header>

        {/* Live Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Thermometer/>} title="Temp" value={liveData?.V0} unit="°C" color="text-orange-400" />
          <StatCard icon={<Wind/>} title="Pressure" value={liveData?.V2} unit="hPa" color="text-blue-400" />
          <StatCard icon={<Droplets/>} title="Rain Intensity" value={liveData?.V3} unit="%" color="text-cyan-400" />
          <StatCard icon={<Activity/>} title="Air Quality" value={liveData?.V5} unit="/100" color="text-emerald-400" />
        </div>

        {/* Forecast Banner */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-6 rounded-3xl mb-8 flex items-center justify-between">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase mb-1">AI Prediction Result</p>
            <h2 className="text-3xl font-bold text-white uppercase italic">{liveData?.V6 || "Analyzing Trends..."}</h2>
          </div>
          <CloudRain size={48} className="text-blue-500 opacity-50" />
        </div>

        {/* History Chart */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
          <h3 className="text-lg font-semibold mb-6">Atmospheric Pressure Trend (Past 7 Days)</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" fontSize={12} />
                <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={12} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}} />
                <Line type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={4} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, unit, color }: any) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl hover:border-slate-700 transition-all">
      <div className="flex items-center gap-3 mb-3 text-slate-500">
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold font-mono ${color}`}>{value || "0.0"}</span>
        <span className="text-slate-600 font-medium">{unit}</span>
      </div>
    </div>
  );
}
