from typing import Dict, Any, List, Tuple
from app.services.plant_knowledge import get_all_plants

def score_plant_for_profile(plant: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
    reasons: List[str] = []
    warnings: List[str] = list(plant.get("warnings", []))
    breakdown: Dict[str, float] = {}

    # 1. Sunlight Matching (Max 25 pts)
    sunlight_score = 0.0
    user_sun = profile.get("daily_sunlight", "partial").lower()
    plant_suns = [s.lower() for s in plant.get("sunlight_requirement", [])]
    
    if user_sun in plant_suns:
        sunlight_score = 25.0
        reasons.append(f"Ideal sunlight match: your space gets {user_sun} sun which perfectly suits {plant['name']}.")
    elif "partial" in plant_suns and user_sun == "low":
        sunlight_score = 15.0
        reasons.append(f"Tolerates low/partial shade, though harvest volume may be slightly lower.")
    elif "full" in plant_suns and user_sun == "partial":
        sunlight_score = 16.0
        reasons.append(f"Requires direct sun, but will still grow under partial sunlight conditions.")
    else:
        sunlight_score = 5.0
        warnings.append(f"Sunlight mismatch: requires {', '.join(plant_suns)} sun, but your space gets {user_sun} sun.")

    breakdown["sunlight"] = sunlight_score

    # 2. Temperature Matching (Max 20 pts)
    temp_score = 15.0  # default assume moderate temp if unprovided
    curr_temp = profile.get("current_temp_c")
    if curr_temp is not None:
        t_min = plant.get("temp_min_c", 10)
        t_max = plant.get("temp_max_c", 35)
        if t_min <= curr_temp <= t_max:
            temp_score = 20.0
            reasons.append(f"Temperature compatible: current {curr_temp}°C falls comfortably in range ({t_min}°C - {t_max}°C).")
        elif curr_temp < t_min:
            temp_score = 4.0
            warnings.append(f"Current temp ({curr_temp}°C) is below minimum safe temperature ({t_min}°C). Protect from frost.")
        else:
            temp_score = 6.0
            warnings.append(f"Current temp ({curr_temp}°C) exceeds optimal limit ({t_max}°C). Provide extra shade & water.")
    else:
        reasons.append(f"Suitable for typical season climate ({plant.get('ideal_temp_range', '15-28°C')}).")

    breakdown["temperature"] = temp_score

    # 3. Space & Container Suitability (Max 20 pts)
    space_score = 0.0
    garden_type = profile.get("garden_type", "balcony").lower()
    avail_space = float(profile.get("available_space_sqft", 10.0))
    min_space = float(plant.get("min_space_sqft", 1.0))
    container_suited = plant.get("container_suitable", True)

    if garden_type in ["balcony", "windowsill", "terrace", "indoor"]:
        if container_suited:
            space_score += 15.0
            reasons.append(f"Container friendly: thrives in pots on {garden_type}s.")
        else:
            space_score += 2.0
            warnings.append(f"Not recommended for small containers; requires deep outdoor garden beds.")
    else:
        space_score += 15.0
        reasons.append(f"Great fit for outdoor garden plots and beds.")

    if avail_space >= min_space:
        space_score += 5.0
    else:
        warnings.append(f"Requires at least {min_space} sq.ft per plant (you specified {avail_space} sq.ft total space).")

    breakdown["space_container"] = space_score

    # 4. Soil Compatibility (Max 15 pts)
    soil_score = 0.0
    user_soil = profile.get("soil_type", "potting_mix").lower()
    plant_soils = [s.lower() for s in plant.get("soil_types", [])]

    if user_soil in plant_soils or user_soil == "unknown" or user_soil == "potting_mix":
        soil_score = 15.0
        reasons.append(f"Soil compatible: {user_soil.replace('_', ' ')} provides suitable texture and aeration.")
    else:
        soil_score = 8.0
        reasons.append(f"Soil type ({user_soil}) can be amended with potting soil for better results.")

    breakdown["soil"] = soil_score

    # 5. Water & Drainage (Max 10 pts)
    water_score = 0.0
    user_water = profile.get("water_availability", "moderate").lower()
    plant_water = plant.get("water_need", "moderate").lower()

    if user_water == plant_water or user_water == "high":
        water_score = 10.0
        reasons.append(f"Watering routine aligns with plant requirement ({plant_water} water demand).")
    elif user_water == "low" and plant_water == "high":
        water_score = 3.0
        warnings.append(f"High water demand plant; may dry out under your low water availability routine.")
    else:
        water_score = 7.0

    breakdown["water"] = water_score

    # 6. Experience & Goal Bonus (Max 10 pts)
    bonus_score = 0.0
    user_exp = profile.get("experience_level", "beginner").lower()
    plant_diff = plant.get("difficulty", "beginner").lower()
    user_goal = profile.get("growing_goal", "herbs").lower()
    plant_cat = plant.get("category", "").lower()

    if user_exp == "beginner" and plant_diff == "beginner":
        bonus_score += 5.0
        reasons.append("Beginner friendly crop with quick, reliable germination.")

    if user_goal == plant_cat or (user_goal == "pollinator_friendly" and plant.get("pollinator_friendly")):
        bonus_score += 5.0
        reasons.append(f"Matches your primary goal: growing {user_goal.replace('_', ' ')}.")

    breakdown["experience_goal_bonus"] = bonus_score

    total_score = sum(breakdown.values())
    total_score = min(100.0, max(0.0, round(total_score, 1)))

    return {
        "plant": plant,
        "suitability_score": total_score,
        "reasons": list(set(reasons)),
        "warnings": list(set(warnings)),
        "breakdown": breakdown
    }

def get_recommendations_for_profile(profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    plants = get_all_plants()
    scored_list = []
    for plant in plants:
        rec = score_plant_for_profile(plant, profile)
        scored_list.append(rec)
    
    # Sort descending by suitability_score
    scored_list.sort(key=lambda x: x["suitability_score"], reverse=True)
    return scored_list
