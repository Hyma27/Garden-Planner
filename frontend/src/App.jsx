import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { GardenSetupPage } from './pages/GardenSetupPage';
import { ClimateDashboardPage } from './pages/ClimateDashboardPage';
import { PlantRecommendationsPage } from './pages/PlantRecommendationsPage';
import { MyGardenPage } from './pages/MyGardenPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ActionPlanPage } from './pages/ActionPlanPage';
import { PlantLibraryPage } from './pages/PlantLibraryPage';
import { Sprout, Code2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPlantForAssistant, setSelectedPlantForAssistant] = useState(null);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'setup':
        return <GardenSetupPage onNavigate={setActiveTab} />;
      case 'climate':
        return <ClimateDashboardPage onNavigate={setActiveTab} />;
      case 'recommendations':
        return <PlantRecommendationsPage onNavigate={setActiveTab} />;
      case 'my-garden':
        return (
          <MyGardenPage 
            onNavigate={setActiveTab}
            onSelectPlantForAssistant={(plantId) => setSelectedPlantForAssistant(plantId)}
          />
        );
      case 'tasks':
        return <ActionPlanPage />;
      case 'assistant':
        return <AIAssistantPage initialSelectedPlantId={selectedPlantForAssistant} />;
      case 'library':
        return <PlantLibraryPage onNavigate={setActiveTab} />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9f6] text-emerald-950 font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActivePage()}
      </main>

      <footer className="bg-emerald-950 text-emerald-200 border-t border-emerald-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-300 font-bold">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">Local Micro-Climate Garden Planner</span>
            <span className="text-emerald-400">| Hacktoberfest 2026</span>
          </div>

          <p className="text-emerald-300/80">
            Encouraging outdoor mindfulness, screen breaks, and touch grass gardening. 🌱
          </p>

          <div className="flex items-center space-x-3 text-emerald-300">
            <span>Built with React + FastAPI + Ollama</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
