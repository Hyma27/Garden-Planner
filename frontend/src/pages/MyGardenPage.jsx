import React, { useEffect, useState } from 'react';
import { Sprout, Trash2, Edit3, Save, Calendar, MessageSquare, PlusCircle, CheckCircle2, ChevronRight, Leaf } from 'lucide-react';
import { api } from '../services/api';

export function MyGardenPage({ onNavigate, onSelectPlantForAssistant }) {
  const [gardenPlants, setGardenPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ stage: '', notes: '', planted_date: '' });

  const loadGarden = async () => {
    try {
      setLoading(true);
      const items = await api.getGardenPlants();
      setGardenPlants(items);
    } catch (err) {
      console.error('Error loading garden plants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGarden();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this plant from your garden tracker?')) return;
    try {
      await api.deleteGardenPlant(id);
      setGardenPlants(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to remove plant.');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      stage: item.stage || 'seeded',
      notes: item.notes || '',
      planted_date: item.planted_date || new Date().toISOString().split('T')[0]
    });
  };

  const saveEdit = async (id) => {
    try {
      const updated = await api.updateGardenPlant(id, editForm);
      setGardenPlants(prev => prev.map(item => item.id === id ? updated : item));
      setEditingId(null);
    } catch (err) {
      alert('Failed to update progress.');
    }
  };

  const handleAskAI = (plantId) => {
    if (onSelectPlantForAssistant) {
      onSelectPlantForAssistant(plantId);
    }
    onNavigate('assistant');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-900 font-medium text-sm">Loading your garden database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sprout className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-bold text-emerald-950">My Outdoor Garden</h1>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Track germination, growth stages, watering notes, and harvest timing for your active crops.
          </p>
        </div>

        <button
          onClick={() => onNavigate('recommendations')}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Recommended Plants</span>
        </button>
      </div>

      {/* Empty State */}
      {gardenPlants.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-emerald-100 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 mx-auto">
            <Leaf className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-emerald-950">Your garden bed is currently empty</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Browse plant recommendations tailored to your micro-climate and add your first crop to start tracking growth outdoors.
          </p>
          <button
            onClick={() => onNavigate('recommendations')}
            className="inline-flex items-center space-x-2 bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-emerald-800 transition-all"
          >
            <span>Explore Recommended Plants</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Active Garden Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gardenPlants.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
                    <div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                        {item.category || 'Herb'}
                      </span>
                      <h3 className="text-xl font-bold text-emerald-950 mt-1">{item.plant_name}</h3>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAskAI(item.plant_id)}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 text-xs font-semibold flex items-center space-x-1"
                        title="Ask AI Assistant about this plant"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Ask AI</span>
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-all"
                        title="Delete plant entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Growth Stage Indicator */}
                  {!isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Current Stage:</span>
                        <span className="bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded-full capitalize text-[11px]">
                          🌱 {item.stage || 'seeded'}
                        </span>
                      </div>

                      {item.planted_date && (
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Planted on: <strong>{item.planted_date}</strong></span>
                        </div>
                      )}

                      <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-950">
                        <strong className="text-[11px] block font-bold text-emerald-900 mb-0.5">Garden Observations:</strong>
                        <p className="italic text-gray-700">{item.notes || 'No custom notes recorded yet.'}</p>
                      </div>
                    </div>
                  ) : (
                    /* Edit Form */
                    <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Growth Stage</label>
                        <select
                          value={editForm.stage}
                          onChange={(e) => setEditForm(p => ({ ...p, stage: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white"
                        >
                          <option value="seeded">Seeded / Sown</option>
                          <option value="sprouted">Sprouted Seedling</option>
                          <option value="growing">Active Vegetative Growth</option>
                          <option value="flowering">Flowering / Fruit Setting</option>
                          <option value="harvestable">Ready for Harvest</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Planted Date</label>
                        <input
                          type="date"
                          value={editForm.planted_date}
                          onChange={(e) => setEditForm(p => ({ ...p, planted_date: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Notes & Observations</label>
                        <textarea
                          value={editForm.notes}
                          onChange={(e) => setEditForm(p => ({ ...p, notes: e.target.value }))}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white"
                          placeholder="e.g. 2 true leaves sprouted, watered with organic tea..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-emerald-50 flex justify-end">
                  {!isEditing ? (
                    <button
                      onClick={() => startEdit(item)}
                      className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update Stage & Notes</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="flex items-center space-x-1 bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Progress</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
