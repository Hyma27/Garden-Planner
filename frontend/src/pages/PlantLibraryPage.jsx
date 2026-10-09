import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Sun, Droplets, Thermometer, ShieldAlert, X, PlusCircle, CheckCircle2, Filter } from 'lucide-react';
import { api } from '../services/api';

export function PlantLibraryPage({ onNavigate }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sunlight: 'all',
    water: 'all',
    difficulty: 'all',
    container_only: false
  });

  const loadPlants = async () => {
    try {
      setLoading(true);
      const data = await api.getPlants(filters);
      setPlants(data);
    } catch (err) {
      console.error('Failed to load library plants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-bold text-emerald-950">Plant Knowledge Library</h1>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Searchable open dataset of crops, herbs, flowers, and fruits for outdoor growers.
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-950 border-b border-emerald-50 pb-2">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filter & Search Plant Dataset</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search basil, tomato, spearmint..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
            >
              <option value="all">All Categories</option>
              <option value="herb">Herbs</option>
              <option value="vegetable">Vegetables</option>
              <option value="flower">Flowers</option>
              <option value="fruit">Fruits</option>
            </select>
          </div>

          {/* Sunlight */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Sunlight</label>
            <select
              name="sunlight"
              value={filters.sunlight}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
            >
              <option value="all">All Sunlight</option>
              <option value="full">Full Sun (6h+)</option>
              <option value="partial">Partial Sun (3-6h)</option>
              <option value="low">Low Sun (&lt;3h)</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2 border-t border-emerald-50">
          <input
            type="checkbox"
            id="container_only"
            name="container_only"
            checked={filters.container_only}
            onChange={handleFilterChange}
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="container_only" className="text-xs font-semibold text-emerald-950 cursor-pointer">
            Show Container-Suitable Plants Only (Balcony / Windowsill Friendly)
          </label>
        </div>
      </div>

      {/* Grid of Plants */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPlant(p)}
              className="bg-white rounded-3xl border border-emerald-100 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-800/90 text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                      {p.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-emerald-950">{p.name}</h3>
                    <p className="text-xs italic text-gray-500">{p.scientific_name}</p>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-gray-700 bg-emerald-50/60 p-2.5 rounded-xl">
                    <span>Sun: <strong>{p.sunlight_requirement.join('/')}</strong></span>
                    <span>Water: <strong className="capitalize">{p.water_need}</strong></span>
                    <span>Harvest: <strong>{p.days_to_harvest}d</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  className="w-full text-center py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs transition-all"
                >
                  View Full Plant Specs →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plant Detail Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 relative p-6 md:p-8">
            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4 border-b border-emerald-100 pb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                <img src={selectedPlant.image_url} alt={selectedPlant.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  {selectedPlant.category}
                </span>
                <h2 className="text-2xl font-bold text-emerald-950 mt-1">{selectedPlant.name}</h2>
                <p className="text-xs italic text-gray-500">{selectedPlant.scientific_name}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
              <p className="text-sm">{selectedPlant.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <div>
                  <span className="text-gray-500 block">Sunlight:</span>
                  <strong className="text-emerald-950 font-bold">{selectedPlant.sunlight_requirement.join(', ')}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Water Need:</span>
                  <strong className="text-emerald-950 font-bold capitalize">{selectedPlant.water_need}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Ideal Temp:</span>
                  <strong className="text-emerald-950 font-bold">{selectedPlant.ideal_temp_range}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Space Sq.Ft:</span>
                  <strong className="text-emerald-950 font-bold">{selectedPlant.min_space_sqft} sq.ft</strong>
                </div>
              </div>

              {selectedPlant.warnings && selectedPlant.warnings.length > 0 && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                  <strong className="font-bold block">Important Growing Warnings:</strong>
                  <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                    {selectedPlant.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPlant.companion_plants && (
                <div>
                  <strong className="font-bold text-emerald-950">Companion Planting Tips:</strong>
                  <p className="text-xs text-emerald-800">Pairs exceptionally well with: {selectedPlant.companion_plants.join(', ')}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-emerald-100 flex justify-end">
              <button
                onClick={() => setSelectedPlant(null)}
                className="bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
              >
                Close Plant Specs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
