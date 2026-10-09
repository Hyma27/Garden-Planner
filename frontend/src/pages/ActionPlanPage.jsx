import React, { useEffect, useState } from 'react';
import { Calendar, CheckSquare, Square, Clock, Wrench, Info, PlusCircle, Sparkles, Trophy } from 'lucide-react';
import { api } from '../services/api';

export function ActionPlanPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    day_number: 1,
    title: '',
    instructions: '',
    estimated_minutes: 15,
    materials: '',
    rationale: ''
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load action tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggle = async (taskId, currentStatus) => {
    try {
      const updated = await api.toggleTask(taskId, !currentStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    } catch (err) {
      alert('Failed to update task.');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const created = await api.addTask(newTask);
      setTasks(prev => [...prev, created]);
      setShowAddModal(false);
      setNewTask({
        day_number: 1,
        title: '',
        instructions: '',
        estimated_minutes: 15,
        materials: '',
        rationale: ''
      });
    } catch (err) {
      alert('Could not add task.');
    }
  };

  const completedCount = tasks.filter(t => t.is_completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-900 font-medium text-sm">Generating your climate-aware 7-day plan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-bold text-emerald-950">Weekly Outdoor Action Plan</h1>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Practical hands-on outdoor tasks to build gardening confidence and touch grass daily.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-forest text-white p-6 rounded-3xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-sm text-emerald-100">Outdoor Goal Progress</span>
          </div>
          <span className="text-xs font-extrabold text-emerald-200">
            {completedCount} of {tasks.length} Tasks Completed ({progressPct}%)
          </span>
        </div>

        <div className="w-full bg-emerald-950/80 rounded-full h-3 overflow-hidden border border-emerald-700/50">
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((t) => (
          <div
            key={t.id}
            className={`p-6 rounded-3xl border transition-all space-y-3 ${
              t.is_completed
                ? 'bg-emerald-50/40 border-emerald-200 opacity-90'
                : 'bg-white border-emerald-100 shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleToggle(t.id, t.is_completed)}
                  className="mt-1 text-emerald-700 hover:text-emerald-900 transition-all shrink-0"
                >
                  {t.is_completed ? (
                    <CheckSquare className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Square className="w-6 h-6 text-gray-300" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                      Day {t.day_number}
                    </span>
                    <h3 className={`text-base font-bold ${t.is_completed ? 'line-through text-gray-500' : 'text-emerald-950'}`}>
                      {t.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">{t.instructions}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full shrink-0 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.estimated_minutes} min</span>
              </div>
            </div>

            {/* Task Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-emerald-50 text-xs text-gray-600">
              {t.materials && (
                <div className="flex items-center space-x-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Materials: <strong className="text-gray-800">{t.materials}</strong></span>
                </div>
              )}

              {t.rationale && (
                <div className="flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Why it matters: <em className="text-gray-800">{t.rationale}</em></span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-emerald-950">Add Custom Outdoor Task</h3>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Task Day Number</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newTask.day_number}
                  onChange={(e) => setNewTask(p => ({ ...p, day_number: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Add compost mulch layer to balcony pots"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={newTask.instructions}
                  onChange={(e) => setNewTask(p => ({ ...p, instructions: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    value={newTask.estimated_minutes}
                    onChange={(e) => setNewTask(p => ({ ...p, estimated_minutes: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Materials Needed</label>
                  <input
                    type="text"
                    value={newTask.materials}
                    onChange={(e) => setNewTask(p => ({ ...p, materials: e.target.value }))}
                    placeholder="e.g. Organic compost"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Why it matters</label>
                <input
                  type="text"
                  value={newTask.rationale}
                  onChange={(e) => setNewTask(p => ({ ...p, rationale: e.target.value }))}
                  placeholder="e.g. Retains topsoil moisture during sunny weather"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs text-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs hover:bg-emerald-800"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
