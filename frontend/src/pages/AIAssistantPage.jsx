import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Send, Cpu, ShieldCheck, Sparkles, Sun, Droplets, ArrowRight, User, Bot } from 'lucide-react';
import { api } from '../services/api';

export function AIAssistantPage({ initialSelectedPlantId }) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your Local Micro-Climate Gardening Assistant. How can I help you grow thriving plants outdoors today?',
      outdoorAction: 'Step outside into your garden area for 5 minutes and check which pots receive direct sun right now.',
      aiStatus: 'ready'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedPlantId, setSelectedPlantId] = useState(initialSelectedPlantId || '');
  const [allPlants, setAllPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    async function loadInitial() {
      try {
        const stat = await api.getAssistantStatus();
        setAiStatus(stat);

        const plants = await api.getPlants();
        setAllPlants(plants);
      } catch (e) {
        console.error('Failed assistant setup:', e);
      }
    }
    loadInitial();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query || query.trim() === '') return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(query, selectedPlantId || null);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: res.reply,
          outdoorAction: res.suggested_outdoor_action,
          aiStatus: res.ai_status,
          modelName: res.model_name
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I am operating in local fallback mode. Perform a finger moisture check 1 inch deep in your soil before watering.',
          outdoorAction: 'Walk outdoors and inspect your container soil moisture right now.',
          aiStatus: 'deterministic_fallback'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'What can I plant this week?',
    'Why is basil suitable for my balcony?',
    'How often should I water in extreme heat?',
    'How can I improve pot drainage?',
    'What can I grow with 3 hours of sun?'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header & Status */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-emerald-700" />
            <h1 className="text-2xl font-bold text-emerald-950">AI Gardening Assistant</h1>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Grounded by your saved garden profile and local plant knowledge dataset.
          </p>
        </div>

        {/* AI Status Badge */}
        <div className="flex items-center space-x-2">
          {aiStatus?.available ? (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Ollama: {aiStatus.target_model}</span>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Deterministic Rule Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* Context Selector & Privacy Notice */}
      <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex items-center space-x-2">
          <label className="text-xs font-bold text-emerald-950 whitespace-nowrap">Target Plant Context:</label>
          <select
            value={selectedPlantId}
            onChange={(e) => setSelectedPlantId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-emerald-300 text-xs bg-white text-emerald-900 font-medium outline-none"
          >
            <option value="">General Garden Profile Context</option>
            {allPlants.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
            ))}
          </select>
        </div>

        <div className="text-[11px] text-emerald-800 font-medium flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Local Privacy - No cloud AI API keys required</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                msg.sender === 'user' ? 'bg-emerald-800' : 'bg-forest'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble */}
            <div className={`space-y-3 max-w-[82%] ${msg.sender === 'user' ? 'items-end' : ''}`}>
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white font-medium rounded-tr-none'
                    : 'bg-emerald-50/80 text-emerald-950 border border-emerald-100 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>

              {/* Outdoor Action Highlight Box for Assistant Answers */}
              {msg.sender === 'assistant' && msg.outdoorAction && (
                <div className="bg-gradient-to-r from-emerald-100 to-amber-50 p-3.5 rounded-2xl border border-emerald-300 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Suggested Outdoor Action ("Touch Grass"):</span>
                  </div>
                  <p className="text-[11px] text-emerald-950 font-medium pl-5">{msg.outdoorAction}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-xs text-emerald-800">
            <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Thinking & consulting micro-climate dataset...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1 mr-1">
          <span>Quick Questions:</span>
        </span>
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="bg-white hover:bg-emerald-50 text-emerald-900 text-xs px-3 py-1.5 rounded-xl border border-emerald-200 transition-all hover:border-emerald-400"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-3"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a gardening question (e.g. How often to water basil during heat spikes?)..."
          disabled={loading}
          className="flex-1 bg-white px-5 py-3.5 rounded-2xl border border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-xs text-gray-800 outline-none shadow-xs"
        />

        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white p-3.5 rounded-2xl font-bold shadow-md transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
