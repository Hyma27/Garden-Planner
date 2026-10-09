import React, { useEffect, useState } from 'react';
import { CloudSun, Thermometer, Droplets, Wind, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, Sun, Compass } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { api } from '../services/api';

export function ClimateDashboardPage({ onNavigate }) {
  const [weather, setWeather] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const prof = await api.getGardenProfile();
      setProfile(prof);
      
      const cityToFetch = prof?.city || 'Seattle';
      const w = await api.getWeather(cityToFetch);
      setWeather(w);

      const recs = await api.getRecommendations({ profile: prof });
      setRecommendations(recs);
    } catch (err) {
      console.error('Error loading climate data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const chartData = recommendations.slice(0, 6).map(r => ({
    name: r.plant.name,
    score: r.suitability_score,
    category: r.plant.category
  }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-emerald-900 font-medium text-sm">Analyzing local climate & micro-climate suitability...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CloudSun className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-bold text-emerald-950">Local Climate Dashboard</h1>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Real-time weather insights paired with your micro-climate environment profile.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-200 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Climate Data</span>
        </button>
      </div>

      {/* Warnings Banner if any exist */}
      {weather?.warnings && weather.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Micro-Climate Alerts & Weather Warnings</span>
          </div>
          <ul className="space-y-1 pl-7 text-xs text-amber-800 list-disc">
            {weather.warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Grid Section 1: Weather Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Live Weather Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-900 to-forest text-white p-7 rounded-3xl shadow-md space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-emerald-300 text-xs uppercase font-extrabold tracking-wider">Garden Location</span>
              <h2 className="text-3xl font-extrabold tracking-tight">{weather?.city || profile?.city || 'Local Garden'}</h2>
              <p className="text-emerald-200 text-xs mt-0.5">{profile?.garden_type ? profile.garden_type.toUpperCase().replace('_', ' ') : 'BALCONY'} MICRO-CLIMATE</p>
            </div>

            {/* Live Data Badge */}
            <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 border ${
              weather?.is_live_data 
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${weather?.is_live_data ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span>{weather?.is_live_data ? 'Live Open-Meteo API' : 'Manual Climate Fallback'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-emerald-700/50">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-200 text-xs font-medium">
                <Thermometer className="w-4 h-4 text-emerald-300" />
                <span>Temperature</span>
              </div>
              <p className="text-2xl font-black text-white">{weather?.temp_c}°C</p>
              <p className="text-[10px] text-emerald-300">{weather?.temp_f}°F ({weather?.temp_min_c}° - {weather?.temp_max_c}°)</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-200 text-xs font-medium">
                <Droplets className="w-4 h-4 text-emerald-300" />
                <span>Humidity</span>
              </div>
              <p className="text-2xl font-black text-white">{weather?.humidity_percent}%</p>
              <p className="text-[10px] text-emerald-300">Moisture Index</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-200 text-xs font-medium">
                <Wind className="w-4 h-4 text-emerald-300" />
                <span>Wind Speed</span>
              </div>
              <p className="text-2xl font-black text-white">{weather?.wind_speed_kmh} <span className="text-xs font-normal">km/h</span></p>
              <p className="text-[10px] text-emerald-300">{profile?.wind_exposure || 'Moderate'} Exposure</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-200 text-xs font-medium">
                <Sun className="w-4 h-4 text-amber-300" />
                <span>Daily Sun</span>
              </div>
              <p className="text-2xl font-black text-white uppercase">{profile?.daily_sunlight || 'Partial'}</p>
              <p className="text-[10px] text-emerald-300">Direct exposure window</p>
            </div>
          </div>

          <div className="text-[11px] text-emerald-300/80 flex items-center justify-between pt-2 border-t border-emerald-800">
            <span>Source: {weather?.source || 'Open-Meteo'}</span>
            <span>Last fetched: {weather?.timestamp || 'Just now'}</span>
          </div>
        </div>

        {/* Micro-Climate Suitability Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-emerald-50 pb-2">
              <Compass className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-emerald-950 text-base">Micro-Climate Assessment</h3>
            </div>

            <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
              <p>
                <strong>Space Type:</strong> {profile?.garden_type?.toUpperCase().replace('_', ' ') || 'BALCONY'}. 
                {profile?.garden_type === 'balcony' && ' Upper levels experience higher evaporation and wind gusts.'}
              </p>
              <p>
                <strong>Soil Base:</strong> {profile?.soil_type?.toUpperCase().replace('_', ' ') || 'POTTING MIX'}. Excellent for root aeration.
              </p>
              <p>
                <strong>Water Demand:</strong> Matched with {profile?.water_availability || 'moderate'} routine.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Optimal Planting Condition</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Current climate supports high germination for spring/summer herbs, leaf greens, and compact fruiting container crops.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Recharts Crop Suitability Visualization */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-emerald-950 text-lg">Top Crop Suitability Breakdown</h3>
            <p className="text-xs text-gray-600">Calculated micro-climate compatibility score out of 100.</p>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            View Full Recommendations →
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#1b4332' }} interval={0} angle={-15} textAnchor="end" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(val) => [`${val}% Match`, 'Suitability Score']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #b7e4c7', fontSize: '12px' }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.score >= 80 ? '#2d6a4f' : entry.score >= 60 ? '#52b788' : '#e07a5f'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
