import React, { useEffect, useState } from 'react';
import { Sprout, Sun, ShieldCheck, Cpu, CloudSun, Leaf, Calendar, MessageSquare, BookOpen, LayoutDashboard } from 'lucide-react';
import { api } from '../services/api';

export function Navbar({ activeTab, setActiveTab }) {
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const stat = await api.getAssistantStatus();
        setAiStatus(stat);
      } catch (e) {
        setAiStatus({ available: false, message: 'Offline mode' });
      }
    }
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sprout },
    { id: 'setup', label: 'Garden Setup', icon: LayoutDashboard },
    { id: 'climate', label: 'Climate Dashboard', icon: CloudSun },
    { id: 'recommendations', label: 'Recommendations', icon: Leaf },
    { id: 'my-garden', label: 'My Garden', icon: Sprout },
    { id: 'tasks', label: '7-Day Outdoor Plan', icon: Calendar },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'library', label: 'Plant Library', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-emerald-300 shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-emerald-950 tracking-tight">Micro-Climate</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full">Touch Grass 🌱</span>
              </div>
              <p className="text-xs text-emerald-700 font-medium">Local Outdoor Garden Planner</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-emerald-900 hover:bg-emerald-50 hover:text-emerald-950'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* AI Status Badge */}
          <div className="flex items-center space-x-2">
            {aiStatus?.available ? (
              <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-medium text-emerald-800" title={aiStatus.message}>
                <Cpu className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Ollama Active</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-medium text-amber-800" title="Deterministic fallback active">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Local Fallback Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex overflow-x-auto py-2 border-t border-emerald-50 space-x-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 shrink-0 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                  isActive
                    ? 'bg-emerald-800 text-white'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
