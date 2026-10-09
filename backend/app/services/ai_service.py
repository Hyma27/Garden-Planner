import httpx
import logging
from typing import Dict, Any, Optional
from app.config import OLLAMA_BASE_URL, OLLAMA_MODEL
from app.services.plant_knowledge import get_plant_by_id, get_all_plants

logger = logging.getLogger(__name__)

async def check_ollama_status() -> Dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            res = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if res.status_code == 200:
                models = res.json().get("models", [])
                model_names = [m.get("name") for m in models]
                return {
                    "available": True,
                    "models": model_names,
                    "target_model": OLLAMA_MODEL,
                    "message": f"Ollama service active. Available models: {', '.join(model_names) if model_names else 'None found'}"
                }
    except Exception as e:
        logger.info(f"Ollama check failed: {e}")
    
    return {
        "available": False,
        "models": [],
        "target_model": OLLAMA_MODEL,
        "message": "Local Ollama AI service unavailable. Running in high-performance deterministic fallback mode."
    }

async def generate_ai_assistant_response(
    user_message: str,
    profile: Optional[Dict[str, Any]] = None,
    plant_id: Optional[str] = None
) -> Dict[str, Any]:
    status = await check_ollama_status()
    
    # Context assembly
    profile_ctx = ""
    if profile:
        profile_ctx = (
            f"User Garden Profile: City={profile.get('city')}, Type={profile.get('garden_type')}, "
            f"Sunlight={profile.get('daily_sunlight')}, Soil={profile.get('soil_type')}, "
            f"Goal={profile.get('growing_goal')}, Water={profile.get('water_availability')}, "
            f"Temp={profile.get('current_temp_c')}°C."
        )

    plant_ctx = ""
    target_plant = None
    if plant_id:
        target_plant = get_plant_by_id(plant_id)
        if target_plant:
            plant_ctx = (
                f"Selected Plant: {target_plant['name']} ({target_plant.get('scientific_name')}). "
                f"Category={target_plant['category']}, Ideal Temp={target_plant['ideal_temp_range']}, "
                f"Sunlight={', '.join(target_plant['sunlight_requirement'])}, Water={target_plant['water_need']} demand. "
                f"Days to harvest={target_plant['days_to_harvest']} days."
            )

    # Attempt Ollama inference if available
    if status["available"]:
        system_prompt = (
            "You are a friendly, encouraging micro-climate gardening expert assistant. "
            "Help beginners, balcony gardeners, and outdoor growers with practical, concise, grounded advice. "
            "Do not hallucinate fake weather data or promise impossible growth. "
            "Always end your advice with a concrete outdoor action starting with 'Outdoor Action:'."
        )
        full_prompt = f"{system_prompt}\n\nContext:\n{profile_ctx}\n{plant_ctx}\n\nUser Question: {user_message}"

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": OLLAMA_MODEL,
                        "prompt": full_prompt,
                        "stream": False
                    }
                )
                if response.status_code == 200:
                    raw_text = response.json().get("response", "").strip()
                    
                    # Split out outdoor action if model formatted it
                    outdoor_action = "Step outside into your garden area for 10 minutes to inspect leaf tips and soil moisture."
                    reply_text = raw_text
                    if "Outdoor Action:" in raw_text:
                        parts = raw_text.split("Outdoor Action:")
                        reply_text = parts[0].strip()
                        outdoor_action = parts[1].strip()

                    return {
                        "reply": reply_text,
                        "suggested_outdoor_action": outdoor_action,
                        "ai_status": "ollama_active",
                        "model_name": OLLAMA_MODEL,
                        "grounded_context_used": True
                    }
        except Exception as e:
            logger.warning(f"Ollama generation request failed: {e}. Falling back.")

    # High-quality Deterministic Fallback Engine
    return generate_deterministic_gardening_response(user_message, profile, target_plant)

def generate_deterministic_gardening_response(
    message: str,
    profile: Optional[Dict[str, Any]] = None,
    plant: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    msg_lower = message.lower()
    
    city = profile.get("city", "your garden area") if profile else "your garden area"
    gtype = profile.get("garden_type", "balcony") if profile else "balcony"
    sun = profile.get("daily_sunlight", "partial") if profile else "partial"
    
    # 1. Plant specific questions
    if plant:
        p_name = plant["name"]
        if "water" in msg_lower or "how often" in msg_lower:
            reply = (
                f"For {p_name} in your {gtype}, water when the top 1 inch of soil feels dry to the touch. "
                f"{p_name} has a {plant['water_need']} water demand. In warm weather, check containers daily, "
                f"making sure water drains freely from the bottom holes to protect roots."
            )
            action = f"Touch the soil around your {p_name} pot. If dry 1 inch down, give it a thorough gentle watering until it drips into the drainage tray."
        elif "sun" in msg_lower or "light" in msg_lower:
            reply = (
                f"{p_name} thrives best in {', '.join(plant['sunlight_requirement'])} sunlight (minimum {plant['sunlight_hours_min']} hours daily). "
                f"Since your setup is a {gtype} with {sun} sun, position it where it catches the brightest unobstructed morning rays."
            )
            action = f"Observe where the sun hits your {gtype} between 10 AM and 2 PM to place your {p_name} in prime light."
        else:
            reply = (
                f"{p_name} ({plant.get('scientific_name')}) is an excellent choice for a {gtype}. "
                f"It takes approximately {plant['germination_days']} days to germinate and {plant['days_to_harvest']} days to harvest. "
                f"Best grown in temperatures between {plant.get('ideal_temp_range', '18-28°C')}."
            )
            action = f"Inspect your {p_name} container today to ensure soil is moist and free of fallen debris."
        
        return {
            "reply": reply,
            "suggested_outdoor_action": action,
            "ai_status": "deterministic_fallback",
            "model_name": None,
            "grounded_context_used": True
        }

    # 2. General Microclimate / Watering / Heat / Soil questions
    if "water" in msg_lower or "how often" in msg_lower:
        reply = (
            f"In a {gtype} micro-climate, fixed watering schedules often lead to overwatering. "
            f"Always perform the finger test: push your index finger 1 inch into the soil. If it feels cool and moist, wait another day. "
            f"If dry, water deeply until moisture drains from pot bottom holes."
        )
        action = "Walk to your plants right now, test 3 pots with your finger, and note which ones actually need water."

    elif "heat" in msg_lower or "hot" in msg_lower or "summer" in msg_lower:
        reply = (
            f"During intense heat spikes in {city}, potted containers heat up rapidly. "
            f"Group containers together to shade each other's pots, mulch the top soil layer with wood chips or straw, "
            f"and water during early morning hours before midday heat evaporates moisture."
        )
        action = "Move delicate leafy greens into partial midday shade and add 1/2 inch of mulch around pot roots."

    elif "drainage" in msg_lower or "container" in msg_lower or "pot" in msg_lower:
        reply = (
            f"Good drainage is essential for container gardening on {gtype}s. Ensure every pot has at least 3-4 drainage holes at the bottom. "
            f"Mix 20% perlite or coarse sand into standard potting soil to prevent compaction and keep root zones aerated."
        )
        action = "Check underneath your potted plants to verify drainage holes are elevated above standing water trays."

    elif "shade" in msg_lower or "low sunlight" in msg_lower or "sun" in msg_lower:
        reply = (
            f"With {sun} sunlight in your {gtype}, focus on leafy greens (Spinach, Kale, Radishes) and hardy herbs (Spearmint, Chives). "
            f"These plants generate good yields with as little as 3-4 hours of daily sunlight."
        )
        action = "Track and time direct sunbeams on your balcony for 2 hours today."

    elif "plant this week" in msg_lower or "what can i plant" in msg_lower or "recommend" in msg_lower:
        plants = get_all_plants()
        top_names = [p["name"] for p in plants[:3]]
        reply = (
            f"Based on your profile in {city} ({gtype} with {sun} sunlight), "
            f"this week is great for starting: {', '.join(top_names)}. "
            f"These crops have high suitability scores for beginner growers."
        )
        action = "Prepare a fresh container pot with moist potting mix and sow your first pack of herb seeds outdoor today!"

    else:
        reply = (
            f"Welcome to your Local Micro-Climate Assistant! You are gardening in {city} on a {gtype} with {sun} sunlight. "
            f"To get the best yield, maintain moist (not soggy) organic soil, ensure good airflow, and pick plants suited for container growth."
        )
        action = "Spend 15 minutes screen-free outdoors examining your plants and soil today."

    return {
        "reply": reply,
        "suggested_outdoor_action": action,
        "ai_status": "deterministic_fallback",
        "model_name": None,
        "grounded_context_used": True
    }
