import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Sun, Droplets, Compass, Wind, Layers, Award, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export function GardenSetupPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    location: 'Seattle, WA',
    city: 'Seattle',
    garden_type: 'balcony',
    available_space_sqft: 12,
    daily_sunlight: 'partial',
    soil_type: 'potting_mix',
    growing_goal: 'herbs',
    experience_level: 'beginner',
    water_availability: 'moderate',
    current_temp_c: 21,
    current_humidity: 55,
    wind_exposure: 'moderate',
    drainage_quality: 'good'
  });

  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await api.getGardenProfile();
        if (p) {
          setFormData({
            location: p.location || 'Seattle, WA',
            city: p.city || 'Seattle',
            garden_type: p.garden_type || 'balcony',
            available_space_sqft: p.available_space_sqft || 12,
            daily_sunlight: p.daily_sunlight || 'partial',
            soil_type: p.soil_type || 'potting_mix',
            growing_goal: p.growing_goal || 'herbs',
            experience_level: p.experience_level || 'beginner',
            water_availability: p.water_availability || 'moderate',
            current_temp_c: p.current_temp_c ?? 21,
            current_humidity: p.current_humidity ?? 55,
            wind_exposure: p.wind_exposure || 'moderate',
            drainage_quality: p.drainage_quality || 'good'
          });
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.saveGardenProfile(formData);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onNavigate('recommendations');
      }, 1000);
    } catch (err) {
      alert('Failed to save garden profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-5 h-5 text-emerald-700" />
            <h1 className="text-2xl font-bold text-emerald-950">Garden Profile Setup</h1>
          </div>
          <p className="text-xs text-gray-600">
            Define your space and micro-climate parameters to receive tailored plant recommendations and outdoor action plans.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-300 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved! Loading Recommendations...</span>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-8">
        
        {/* Section 1: Location & Garden Type */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-emerald-100 pb-2">
            <Compass className="w-5 h-5 text-emerald-700" />
            <h2 className="font-bold text-emerald-950 text-base">Location & Space Type</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-emerald-900 mb-1">
                City / Location Name
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Seattle, Austin, London"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs text-gray-800 outline-none"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Manual entry supported. No GPS required.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-900 mb-1">
                Garden Growing Space
              </label>
              <select
                name="garden_type"
                value={formData.garden_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs text-gray-800 outline-none bg-white"
              >
                <option value="balcony">Balcony Container Garden</option>
                <option value="terrace">Roof Terrace / Deck</option>
                <option value="backyard">Backyard Garden Plot</option>
                <option value="windowsill">Sunny Windowsill</option>
                <option value="indoor">Indoor Grow Station</option>
                <option value="community_garden">Community Shared Bed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-900 mb-1">
                Available Area (sq. ft)
              </label>
              <input
                type="number"
                name="available_space_sqft"
                value={formData.available_space_sqft}
                onChange={handleChange}
                min="0.5"
                max="1000"
                step="0.5"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs text-gray-800 outline-none"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">1 sq ft ≈ 0.1 sq meters</span>
            </div>
          </div>
        </div>

        {/* Section 2: Micro-Climate Sunlight & Soil */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-emerald-950 text-base">Sunlight & Soil Conditions</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-emerald-950">
                  Daily Direct Sunlight
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === 'sun' ? null : 'sun')}
                  className="text-amber-700 hover:text-amber-900 text-[10px] font-medium flex items-center space-x-0.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Sun Guide</span>
                </button>
              </div>

              {activeTooltip === 'sun' && (
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-[11px] text-gray-700 space-y-1">
                  <p><strong>Full Sun:</strong> 6+ hours of unobstructed direct rays (best for tomatoes & peppers).</p>
                  <p><strong>Partial Sun:</strong> 3-6 hours direct or bright dappled shade (herbs, kale).</p>
                  <p><strong>Low Sun:</strong> Under 3 hours direct sun (baby spinach, mint, radishes).</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Low (<3h)' },
                  { id: 'partial', label: 'Partial (3-6h)' },
                  { id: 'full', label: 'Full (6h+)' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, daily_sunlight: item.id }))}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      formData.daily_sunlight === item.id
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-emerald-950">
                  Soil Type
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === 'soil' ? null : 'soil')}
                  className="text-emerald-700 hover:text-emerald-900 text-[10px] font-medium flex items-center space-x-0.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Soil Info</span>
                </button>
              </div>

              {activeTooltip === 'soil' && (
                <div className="bg-white p-3 rounded-xl border border-emerald-200 text-[11px] text-gray-700 space-y-1">
                  <p><strong>Potting Mix:</strong> Lightweight, aerated blend for container pots.</p>
                  <p><strong>Loamy:</strong> Balanced rich garden soil with high nutrient retention.</p>
                  <p><strong>Sandy/Clay:</strong> Coarse fast-draining or heavy dense earth.</p>
                </div>
              )}

              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs text-gray-800 outline-none bg-white"
              >
                <option value="potting_mix">Potting Soil Mix (Container friendly)</option>
                <option value="loamy">Loamy / Organic Soil Bed</option>
                <option value="sandy">Sandy Soil (Fast draining)</option>
                <option value="clay">Clay Soil (Dense)</option>
                <option value="unknown">Unknown / Not Sure Yet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Goals, Water, & Experience */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-emerald-100 pb-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <h2 className="font-bold text-emerald-950 text-base">Gardening Goals & Water Routine</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-emerald-900 mb-1">
                Primary Growing Goal
              </label>
              <select
                name="growing_goal"
                value={formData.growing_goal}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 text-xs text-gray-800 outline-none bg-white"
              >
                <option value="herbs">Fresh Culinary Herbs</option>
                <option value="vegetables">Homegrown Vegetables</option>
                <option value="flowers">Ornamental Flowers</option>
                <option value="fruits">Berry Fruits</option>
                <option value="pollinator_friendly">Bee & Butterfly Pollinator Haven</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-900 mb-1">
                Water Availability Routine
              </label>
              <select
                name="water_availability"
                value={formData.water_availability}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 text-xs text-gray-800 outline-none bg-white"
              >
                <option value="low">Low (1-2 times a week)</option>
                <option value="moderate">Moderate (Every 2-3 days)</option>
                <option value="high">High (Daily watering accessible)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-900 mb-1">
                Gardening Experience Level
              </label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 text-xs text-gray-800 outline-none bg-white"
              >
                <option value="beginner">Beginner (First-time gardener)</option>
                <option value="intermediate">Intermediate (Some potted success)</option>
                <option value="advanced">Advanced Green Thumb</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Optional Micro-Climate Environment Inputs */}
        <div className="space-y-4 bg-gray-50/70 p-5 rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">Optional Micro-Climate Environment Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Current Temp (°C)
              </label>
              <input
                type="number"
                name="current_temp_c"
                value={formData.current_temp_c ?? ''}
                onChange={handleChange}
                placeholder="21"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Current Humidity (%)
              </label>
              <input
                type="number"
                name="current_humidity"
                value={formData.current_humidity ?? ''}
                onChange={handleChange}
                placeholder="55"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Wind Exposure
              </label>
              <select
                name="wind_exposure"
                value={formData.wind_exposure}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
              >
                <option value="sheltered">Sheltered (Low wind)</option>
                <option value="moderate">Moderate breeze</option>
                <option value="high_wind">High wind exposure (Upper balcony)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Pot Drainage Quality
              </label>
              <select
                name="drainage_quality"
                value={formData.drainage_quality}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
              >
                <option value="good">Good (Elevated bottom holes)</option>
                <option value="fair">Fair (Standard saucer)</option>
                <option value="poor">Poor (No drainage holes)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-4 border-t border-emerald-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Saving Profile...</span>
            ) : (
              <>
                <span>Save Profile & Generate Plant Matches</span>
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
