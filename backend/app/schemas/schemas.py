from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class GardenProfileSchema(BaseModel):
    location: Optional[str] = "Seattle, WA"
    city: Optional[str] = "Seattle"
    garden_type: str = Field(default="balcony", description="balcony, terrace, backyard, windowsill, indoor, community_garden")
    available_space_sqft: float = Field(default=10.0, ge=0.1, le=10000.0)
    daily_sunlight: str = Field(default="partial", description="low, partial, full")
    soil_type: str = Field(default="potting_mix", description="sandy, clay, loamy, potting_mix, unknown")
    growing_goal: str = Field(default="herbs", description="vegetables, herbs, flowers, fruits, pollinator_friendly")
    experience_level: str = Field(default="beginner", description="beginner, intermediate, advanced")
    water_availability: str = Field(default="moderate", description="low, moderate, high")
    current_temp_c: Optional[float] = None
    current_humidity: Optional[float] = None
    wind_exposure: Optional[str] = "moderate"
    drainage_quality: Optional[str] = "good"

class PlantSchema(BaseModel):
    id: str
    name: str
    scientific_name: Optional[str] = None
    category: str
    description: str
    sunlight_requirement: List[str]
    sunlight_hours_min: float
    sunlight_hours_max: float
    soil_types: List[str]
    water_need: str
    temp_min_c: float
    temp_max_c: float
    ideal_temp_range: str
    min_space_sqft: float
    container_suitable: bool
    germination_days: int
    days_to_harvest: int
    difficulty: str
    best_planting_season: List[str]
    warnings: List[str]
    companion_plants: Optional[List[str]] = []
    pest_resilience: Optional[str] = "moderate"
    pollinator_friendly: Optional[bool] = False
    image_url: Optional[str] = None

class RecommendationResponseItem(BaseModel):
    plant: PlantSchema
    suitability_score: float
    reasons: List[str]
    warnings: List[str]
    breakdown: Dict[str, float]

class RecommendationRequest(BaseModel):
    profile: Optional[GardenProfileSchema] = None
    city: Optional[str] = None
    manual_temp_c: Optional[float] = None
    manual_humidity: Optional[float] = None

class UserGardenPlantCreate(BaseModel):
    plant_id: str
    plant_name: str
    category: Optional[str] = "herb"
    planted_date: Optional[str] = ""
    stage: Optional[str] = "seeded"
    notes: Optional[str] = ""

class UserGardenPlantUpdate(BaseModel):
    stage: Optional[str] = None
    notes: Optional[str] = None
    planted_date: Optional[str] = None

class ActionTaskSchema(BaseModel):
    id: Optional[int] = None
    day_number: int
    task_date: Optional[str] = ""
    title: str
    instructions: str
    estimated_minutes: int = 15
    materials: Optional[str] = ""
    rationale: str
    is_completed: bool = False
    plant_id: Optional[str] = ""

class ChatRequest(BaseModel):
    message: str
    context_plant_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_outdoor_action: str
    ai_status: str  # "ollama_active" or "deterministic_fallback"
    model_name: Optional[str] = None
    grounded_context_used: bool = True
