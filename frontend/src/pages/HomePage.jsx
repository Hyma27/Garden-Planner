import React from 'react';
import { Sprout, Sun, Thermometer, ShieldCheck, ArrowRight, CheckCircle2, Leaf, Calendar, Sparkles } from 'lucide-react';

export function HomePage({ onNavigate }) {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero text-white p-8 md:p-14 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-100">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Hacktoberfest 2026: Touch Grass Challenge</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Grow Smarter. <br />
            <span className="text-emerald-300">Start Where You Are.</span>
          </h1>

          <p className="text-emerald-100 text-base md:text-lg leading-relaxed max-w-2xl">
            Transform your balcony, patio, windowsill, or backyard into a thriving micro-climate garden. 
            Step away from screens, step outdoors, and cultivate plants tailored to your exact sunlight, soil, and temperature.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('setup')}
              className="flex items-center space-x-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <span>Plan My Garden</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('library')}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
            >
              <span>Explore Plants</span>
              <Leaf className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background sprout blur */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Three Easy Steps */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-950">How Micro-Climate Gardening Works</h2>
          <p className="text-gray-600 text-sm">Three simple steps to transition from digital screens to garden soil.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-emerald-950 text-lg">Discover Your Climate</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Input your city, garden location (balcony, windowsill, or bed), daily sunlight hours, and soil type to map your unique micro-climate.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-emerald-950 text-lg">Find Your Plants</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our rule-based scoring engine matches crops based on temperature tolerance, container fit, companion compatibility, and seasonal timing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-emerald-950 text-lg">Grow Outdoors</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Follow personalized 7-day outdoor action tasks, observe real-world soil moisture, and track germination without screen burnout.
            </p>
          </div>
        </div>
      </section>

      {/* Core Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 space-y-3">
          <Sun className="w-8 h-8 text-amber-600" />
          <h4 className="font-bold text-emerald-950 text-base">Sunlight Matching</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Accurately assesses direct vs partial sunlight windows so plants like tomatoes get heat while leafy spinach gets cool shade.
          </p>
        </div>

        <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 space-y-3">
          <Thermometer className="w-8 h-8 text-emerald-700" />
          <h4 className="font-bold text-emerald-950 text-base">Live & Manual Weather</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Integrates Open-Meteo live climate forecasts with a deterministic manual fallback when network access is unavailable.
          </p>
        </div>

        <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 space-y-3">
          <Calendar className="w-8 h-8 text-teal-700" />
          <h4 className="font-bold text-emerald-950 text-base">7-Day Outdoor Plan</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Hands-on outdoor tasks like soil finger checks, container potting, and leaf pest inspection to get you outdoors.
          </p>
        </div>

        <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-800" />
          <h4 className="font-bold text-emerald-950 text-base">Local-First AI</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Powered by local open-weight models via Ollama. 100% private garden data with deterministic rule fallbacks.
          </p>
        </div>
      </section>

      {/* Sample Garden Recommendation Preview */}
      <section className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-emerald-950">Sample Micro-Climate Match</h3>
            <p className="text-xs text-gray-600">Previewing plant suitability for a typical 10 sq.ft sunny balcony garden.</p>
          </div>
          <button 
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
          >
            <span>See Full Recommendation List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 text-base">Sweet Basil</span>
              <span className="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full">94.5% Match</span>
            </div>
            <p className="text-xs text-gray-600">Thrives on sunny balconies; fast culinary harvest in 45 days.</p>
            <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium pt-2 border-t border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Container suited • Full/Partial Sun</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 text-base">Cherry Tomato</span>
              <span className="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full">88.0% Match</span>
            </div>
            <p className="text-xs text-gray-600">High yield potted crop. Loves bright direct warmth and regular moisture.</p>
            <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium pt-2 border-t border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Container suited • Full Sun</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 text-base">Spearmint</span>
              <span className="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full">91.0% Match</span>
            </div>
            <p className="text-xs text-gray-600">Ultra hardy herb. Perfect for separate pots with 3-6 hours sun.</p>
            <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium pt-2 border-t border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Resilient • Low to Full Sun</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-forest text-white rounded-3xl p-8 md:p-10 text-center space-y-4">
        <h3 className="text-2xl font-bold">Ready to Touch Grass Today?</h3>
        <p className="text-emerald-200 text-sm max-w-xl mx-auto">
          Set up your micro-climate profile in 60 seconds and start growing healthy herbs, vegetables, and flowers outdoors.
        </p>
        <button
          onClick={() => onNavigate('setup')}
          className="inline-flex items-center space-x-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all"
        >
          <span>Configure Your Garden Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
