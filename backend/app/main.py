import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import router as api_router
from app.database import init_db, get_latest_garden_profile, save_garden_profile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("garden_planner")

app = FastAPI(
    title="Local Micro-Climate Garden Planner API",
    description="Intelligent gardening assistant recommending suitable plants based on micro-climate, sunlight, soil, temperature, and seasonal factors.",
    version="1.0.0"
)

# CORS setup for Vite frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    # Check if profile exists, otherwise seed initial default profile
    profile = get_latest_garden_profile()
    if not profile:
        save_garden_profile({
            "location": "Seattle, WA",
            "city": "Seattle",
            "garden_type": "balcony",
            "available_space_sqft": 12.0,
            "daily_sunlight": "partial",
            "soil_type": "potting_mix",
            "growing_goal": "herbs",
            "experience_level": "beginner",
            "water_availability": "moderate",
            "current_temp_c": 21.0,
            "current_humidity": 55.0,
            "wind_exposure": "moderate",
            "drainage_quality": "good"
        })
    logger.info("Garden Planner API backend started.")

app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
