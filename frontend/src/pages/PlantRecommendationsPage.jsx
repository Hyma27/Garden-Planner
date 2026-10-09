import React, { useEffect, useState } from 'react';
import { Leaf, Sun, Droplets, Thermometer, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, PlusCircle, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export function PlantRecommendationsPage({ onNavigate }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [addedPlantIds, setAddedPlantIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function fetchRecs() {
      try {
        setLoading(true);
        const data = await api.getRecommendations();
        setRecommendations(data);

        // Fetch user's existing garden plants to flag ones already added
        const gardenItems = await api.getGardenPlants();
        setAddedPlantIds(gardenItems.map(i => i.plant_id));
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecs();
  }, []);

  const handleGrowPlant = async (plant) => {
    try {
      await api.addGardenPlant({
        plant_id: plant.id,
        plant_name: plant.name,
        category: plant.category,
        stage: 'seeded',
        notes: `Planted for micro-climate: ${plant.category}`
      });

      setAddedPlantIds(prev => [...prev, plant.id]);
      setToastMessage(`" ${plant.name} " added to your Garden tracker! 🌱`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Could not add plant to garden. Please try again.');
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'bg-emerald-600 text-white border-emerald-700';
    if (score >= 60) return 'bg-amber-500 text-white border-amber-600';
    return 'bg-rose-500 text-white border-rose-600';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-900 font-medium text-sm">Evaluating plants against micro-climate rules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-emerald-700 animate-slide-up">
          <Sparkles className="w-5 h-5 text-emerald-300" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button 
            onClick={() => onNavigate('my-garden')}
            className="text-xs underline text-emerald-300 hover:text-white font-semibold ml-2"
          >
            View My Garden
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-bold text-emerald-950">Recommended Plants</h1>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Deterministic rule-based scoring matched to your garden profile & weather limits.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1 font-semibold text-emerald-800">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>High (80-100)</span>
          </span>
          <span className="flex items-center space-x-1 font-semibold text-amber-700">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Moderate (60-79)</span>
          </span>
          <span className="flex items-center space-x-1 font-semibold text-rose-700">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Challenging (&lt;60)</span>
          </span>
        </div>
      </div>

      {/* Plant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => {
          const p = rec.plant;
          const isExpanded = expandedId === p.id;
          const isAdded = addedPlantIds.includes(p.id);

          return (
            <div 
              key={p.id}
              className="bg-white rounded-3xl border border-emerald-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Header & Score Pill */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={p.image_url} 
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 right-4">
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-md border ${getScoreBadge(rec.suitability_score)}`}>
                      {rec.suitability_score}% Suitability
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {p.category}
                    </span>
                    <h3 className="text-xl font-extrabold leading-tight mt-1">{p.name}</h3>
                    <p className="text-xs italic text-emerald-100/90">{p.scientific_name}</p>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed">{p.description}</p>

                  {/* Attributes Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px] pt-1">
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex items-center space-x-1.5 text-emerald-950 font-medium">
                      <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{p.sunlight_requirement.join(', ')} Sun</span>
                    </div>

                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex items-center space-x-1.5 text-emerald-950 font-medium">
                      <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="capitalize">{p.water_need} Water</span>
                    </div>

                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex items-center space-x-1.5 text-emerald-950 font-medium">
                      <Thermometer className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{p.ideal_temp_range}</span>
                    </div>
                  </div>

                  {/* Germination & Harvest quick stats */}
                  <div className="flex items-center justify-between text-[11px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>Germination: <strong className="text-gray-900">{p.germination_days} days</strong></div>
                    <div>Harvest: <strong className="text-gray-900">{p.days_to_harvest} days</strong></div>
                    <div>Space: <strong className="text-gray-900">{p.min_space_sqft} sq.ft</strong></div>
                  </div>

                  {/* Rationale Reasons */}
                  <div className="space-y-1.5">
                    <h4 className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Why it suits your garden:</h4>
                    <ul className="space-y-1 text-xs text-emerald-800">
                      {rec.reasons.slice(0, 2).map((reason, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Warnings if any */}
                  {rec.warnings.length > 0 && (
                    <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="flex items-center space-x-1 font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Important Consideration:</span>
                      </div>
                      <p className="text-[11px] text-amber-800 pl-4">{rec.warnings[0]}</p>
                    </div>
                  )}

                  {/* Expandable Breakdown Details */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-emerald-100 space-y-3 text-xs animate-fade-in">
                      <h4 className="font-bold text-emerald-950">Detailed Scoring Breakdown:</h4>
                      <div className="space-y-1 text-[11px] text-gray-700 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                        <div className="flex justify-between">
                          <span>Sunlight Match:</span>
                          <strong className="text-emerald-800">{rec.breakdown.sunlight} / 25 pts</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Temperature Range:</span>
                          <strong className="text-emerald-800">{rec.breakdown.temperature} / 20 pts</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Container & Space:</span>
                          <strong className="text-emerald-800">{rec.breakdown.space_container} / 20 pts</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Soil Type Match:</span>
                          <strong className="text-emerald-800">{rec.breakdown.soil} / 15 pts</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Water Compatibility:</span>
                          <strong className="text-emerald-800">{rec.breakdown.water} / 10 pts</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Beginner/Goal Bonus:</span>
                          <strong className="text-emerald-800">{rec.breakdown.experience_goal_bonus} / 10 pts</strong>
                        </div>
                      </div>

                      {p.companion_plants && p.companion_plants.length > 0 && (
                        <p className="text-[11px] text-gray-600">
                          <strong>Companion Plants:</strong> {p.companion_plants.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  className="flex items-center space-x-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
                >
                  <span>{isExpanded ? 'Hide Details' : 'View Scoring Rationale'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleGrowPlant(p)}
                  disabled={isAdded}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isAdded
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>In My Garden</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Grow This Plant</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
