import json
import logging
from typing import List, Dict, Any, Optional
from app.config import PLANTS_JSON_PATH

logger = logging.getLogger(__name__)

_plants_cache: List[Dict[str, Any]] = []

def load_plants_dataset() -> List[Dict[str, Any]]:
    global _plants_cache
    if not _plants_cache:
        try:
            with open(PLANTS_JSON_PATH, "r", encoding="utf-8") as f:
                _plants_cache = json.load(f)
        except Exception as e:
            logger.error(f"Error loading plants dataset: {e}")
            _plants_cache = []
    return _plants_cache

def get_all_plants() -> List[Dict[str, Any]]:
    return load_plants_dataset()

def get_plant_by_id(plant_id: str) -> Optional[Dict[str, Any]]:
    plants = load_plants_dataset()
    for plant in plants:
        if plant["id"] == plant_id:
            return plant
    return None

def filter_plants(
    category: Optional[str] = None,
    sunlight: Optional[str] = None,
    water: Optional[str] = None,
    difficulty: Optional[str] = None,
    container_only: Optional[bool] = None,
    search: Optional[str] = None
) -> List[Dict[str, Any]]:
    plants = load_plants_dataset()
    filtered = []
    
    for p in plants:
        if category and category.lower() != "all" and p["category"].lower() != category.lower():
            continue
        if sunlight and sunlight.lower() != "all" and sunlight.lower() not in [s.lower() for s in p["sunlight_requirement"]]:
            continue
        if water and water.lower() != "all" and p["water_need"].lower() != water.lower():
            continue
        if difficulty and difficulty.lower() != "all" and p["difficulty"].lower() != difficulty.lower():
            continue
        if container_only is True and not p.get("container_suitable", False):
            continue
        if search:
            q = search.lower()
            text_haystack = f"{p['name']} {p['scientific_name']} {p['category']} {p['description']}".lower()
            if q not in text_haystack:
                continue
        filtered.append(p)
        
    return filtered
