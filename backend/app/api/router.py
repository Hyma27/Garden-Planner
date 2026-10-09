from fastapi import APIRouter, HTTPException, Query, Path as FastPath
from typing import List, Optional, Dict, Any

from app.schemas.schemas import (
    GardenProfileSchema, PlantSchema, RecommendationResponseItem,
    RecommendationRequest, UserGardenPlantCreate, UserGardenPlantUpdate,
    ActionTaskSchema, ChatRequest, ChatResponse
)
from app.services.plant_knowledge import get_all_plants, get_plant_by_id, filter_plants
from app.services.recommendation_engine import get_recommendations_for_profile, score_plant_for_profile
from app.services.weather_service import fetch_weather_for_location, get_fallback_weather
from app.services.ai_service import check_ollama_status, generate_ai_assistant_response
from app.database import (
    save_garden_profile, get_latest_garden_profile,
    add_plant_to_garden, get_user_garden_plants, remove_user_garden_plant,
    update_user_garden_plant, get_action_tasks, create_action_task,
    toggle_task_completion, seed_default_tasks_if_empty
)

router = APIRouter()

@router.get("/health")
async def health_check():
    ollama_stat = await check_ollama_status()
    profile = get_latest_garden_profile()
    return {
        "status": "healthy",
        "database": "sqlite_connected",
        "ollama": ollama_stat,
        "active_profile": profile.get("city") if profile else "default_demo"
    }

@router.get("/plants", response_model=List[PlantSchema])
def list_plants(
    category: Optional[str] = Query(None, description="herb, vegetable, flower, fruit"),
    sunlight: Optional[str] = Query(None, description="low, partial, full"),
    water: Optional[str] = Query(None, description="low, moderate, high"),
    difficulty: Optional[str] = Query(None, description="beginner, intermediate, advanced"),
    container_only: Optional[bool] = Query(False),
    search: Optional[str] = Query(None)
):
    return filter_plants(
        category=category,
        sunlight=sunlight,
        water=water,
        difficulty=difficulty,
        container_only=container_only,
        search=search
    )

@router.get("/plants/{plant_id}", response_model=PlantSchema)
def get_plant_detail(plant_id: str = FastPath(...)):
    plant = get_plant_by_id(plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail=f"Plant with id '{plant_id}' not found.")
    return plant

@router.post("/garden-profile")
def update_profile(profile: GardenProfileSchema):
    updated = save_garden_profile(profile.model_dump())
    return {"message": "Garden profile saved successfully.", "profile": updated}

@router.get("/garden-profile")
def get_profile():
    profile = get_latest_garden_profile()
    if not profile:
        # Default fallback profile for immediate demo
        default_p = GardenProfileSchema()
        saved = save_garden_profile(default_p.model_dump())
        return saved
    return profile

@router.post("/recommendations", response_model=List[RecommendationResponseItem])
def get_recommendations(req: Optional[RecommendationRequest] = None):
    profile_dict = None
    if req and req.profile:
        profile_dict = req.profile.model_dump()
    else:
        profile_dict = get_latest_garden_profile()
        if not profile_dict:
            profile_dict = GardenProfileSchema().model_dump()

    if req and req.manual_temp_c is not None:
        profile_dict["current_temp_c"] = req.manual_temp_c
    if req and req.manual_humidity is not None:
        profile_dict["current_humidity"] = req.manual_humidity

    recommendations = get_recommendations_for_profile(profile_dict)
    return recommendations

@router.get("/garden")
def list_garden_plants():
    return get_user_garden_plants()

@router.post("/garden/plants")
def add_plant(item: UserGardenPlantCreate):
    plant = get_plant_by_id(item.plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail=f"Plant '{item.plant_id}' does not exist in dataset.")
    
    plant_data = item.model_dump()
    if not plant_data.get("plant_name"):
        plant_data["plant_name"] = plant["name"]
    plant_data["category"] = plant.get("category", "herb")
    
    added = add_plant_to_garden(plant_data)
    return {"message": "Plant added to your garden!", "item": added}

@router.delete("/garden/plants/{id}")
def delete_plant(id: int = FastPath(...)):
    success = remove_user_garden_plant(id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Garden plant entry {id} not found.")
    return {"message": f"Plant entry {id} removed successfully."}

@router.patch("/garden/plants/{id}")
def update_plant_progress(id: int, updates: UserGardenPlantUpdate):
    updated = update_user_garden_plant(id, updates.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail=f"Garden plant entry {id} not found.")
    return updated

@router.get("/tasks", response_model=List[ActionTaskSchema])
def list_tasks():
    seed_default_tasks_if_empty()
    tasks = get_action_tasks()
    return tasks

@router.post("/tasks", response_model=ActionTaskSchema)
def add_task(task: ActionTaskSchema):
    created = create_action_task(task.model_dump())
    return created

@router.patch("/tasks/{id}")
def toggle_task(id: int = FastPath(...), completed: bool = Query(...)):
    updated = toggle_task_completion(id, completed)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Task {id} not found.")
    return updated

@router.get("/weather")
async def get_weather(city: Optional[str] = Query(None)):
    if not city:
        profile = get_latest_garden_profile()
        city = profile.get("city", "Seattle") if profile else "Seattle"
    
    weather_data = await fetch_weather_for_location(city)
    return weather_data

@router.get("/assistant/status")
async def assistant_status():
    return await check_ollama_status()

@router.post("/assistant/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest):
    profile = get_latest_garden_profile()
    res = await generate_ai_assistant_response(
        user_message=req.message,
        profile=profile,
        plant_id=req.context_plant_id
    )
    return res
