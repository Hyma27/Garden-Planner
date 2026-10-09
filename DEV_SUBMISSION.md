# Local Micro-Climate Garden Planner 🌱 — Grow Smarter. Touch Grass.

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## ## What I Built

The **Local Micro-Climate Garden Planner** is a full-stack, local-first web application designed to encourage people to spend less time staring at digital screens and more time outside interacting with nature ("Touch Grass").

### 🌿 The Problem
Urban micro-climates vary drastically within the exact same city. A 4th-floor south-facing balcony experiences intense sun and dry winds, while a ground-floor terrace remains shaded. Generic online advice leads to withered seedlings and frustrated beginner gardeners.

### 🎯 The Solution
Our application acts as a personal, intelligent gardening mentor:
1. **Micro-Climate Profiling**: Captures garden location, growing space (*balcony, terrace, windowsill, plot*), daily sunlight, soil mix, water routine, and temperature.
2. **Transparent 6-Factor Rule Engine**: Scores plant suitability from 0 to 100% using deterministic biological rules—ensuring plant safety without black-box AI hallucinations.
3. **Live & Offline Climate Dashboard**: Integrates real-time weather from Open-Meteo API with a zero-network manual fallback.
4. **Local Open-Weight AI Assistant**: Powered by Ollama (`qwen2.5` / `llama3.2`) with 100% local privacy (no paid cloud API keys required) and deterministic fallbacks.
5. **7-Day Outdoor Action Plan**: Climate-aware daily tasks (*soil finger test, pot drainage check, seed sowing, leaf inspection*) specifically designed to get users outdoors.
6. **My Garden Progress Tracker**: SQLite-backed tracker to monitor growth stages (*seeded, sprouted, growing, harvestable*) and record observations.

---

## ## Demo

- **Repository**: [https://github.com/Hyma27/Garden-Planner](https://github.com/Hyma27/Garden-Planner)
- **Local Application URL**: `http://localhost:5173`
- **FastAPI Backend & Swagger Docs**: `http://localhost:8000/docs`

### 📸 Application Highlights
- **Home Hero**: Nature-inspired modern SaaS dashboard inviting users to plan their garden.
- **Micro-Climate Setup**: Accessible forms with tooltips explaining direct vs partial sunlight and soil aeration.
- **Climate Dashboard**: Recharts crop suitability visualization and real-time Open-Meteo weather warnings for extreme heat or frost.
- **Plant Recommendations**: Suitability score badges with full point breakdown rationale ("Why this suits your garden").
- **AI Gardening Assistant**: Context-grounded chat interface that highlights a *"Suggested Outdoor Action"* with every response.

---

## ## Code

The project is built with a modular, maintainable full-stack architecture:

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React Icons, Recharts
- **Backend**: Python 3.12, FastAPI, Pydantic v2, Uvicorn, HTTPX
- **Database**: SQLite (Zero-config local persistence)
- **AI Engine**: Ollama running open-weight models (`qwen2.5:latest` or `llama3.2:latest`)
- **Live Weather**: Open-Meteo REST API (No API key needed)
- **Test Suite**: Pytest (11/11 tests passing for recommendation scoring, SQLite CRUD, and AI fallback)

### 🐙 Repository Link
👉 **[GitHub Repository: Hyma27/Garden-Planner](https://github.com/Hyma27/Garden-Planner)**

---

## ## Open Innovation & Local-First AI

We believe open innovation makes technology more private, transparent, and accessible:
- **100% Local Inference**: Runs locally via Ollama. Personal garden details and chat messages never leave your machine.
- **Zero Paid API Keys**: Requires no cloud AI subscriptions or API keys.
- **Deterministic Rule Safety**: Recommendations are calculated via verified biological constraints rather than LLM text generation.
- **Offline Fallback Engine**: If Ollama is offline or hardware is limited, the app seamlessly switches to a rule-based fallback response engine.

---

## ## My Agent Session

This full-stack application was pair-programmed and built using **Google Antigravity AI Agent**. The agent performed:
- End-to-end project scaffolding (React + FastAPI + SQLite).
- Designing the rule-based plant recommendation engine.
- Open-Meteo API integration with fallback handling.
- Ollama local AI client integration.
- Unit and integration testing with Pytest (11 passing tests).

---

## ## Prize Categories

- **Primary Category**: Hacktoberfest Open-Source AI Challenge — Week 1: Touch Grass

---

*Grow smarter. Step outside. Touch grass. 🌱*
