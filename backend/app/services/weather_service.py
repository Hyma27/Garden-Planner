import httpx
import logging
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

async def fetch_weather_for_location(city: str) -> Dict[str, Any]:
    if not city or city.strip() == "":
        city = "Seattle"

    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            # Step 1: Geocode city name to lat/lon
            geo_res = await client.get(GEOCODING_URL, params={"name": city, "count": 1})
            geo_data = geo_res.json()
            
            if not geo_data.get("results"):
                return get_fallback_weather(city, reason=f"Location '{city}' not found in Open-Meteo geocode database.")
            
            location_info = geo_data["results"][0]
            lat = location_info["latitude"]
            lon = location_info["longitude"]
            resolved_city = location_info.get("name", city)
            country = location_info.get("country", "")

            # Step 2: Fetch weather forecast data
            weather_res = await client.get(WEATHER_URL, params={
                "latitude": lat,
                "longitude": lon,
                "current_weather": "true",
                "hourly": "relative_humidity_2m",
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max",
                "timezone": "auto"
            })
            w_data = weather_res.json()
            
            curr = w_data.get("current_weather", {})
            temp_c = curr.get("temperature", 20.0)
            wind_speed = curr.get("windspeed", 8.0)
            
            # Extract humidity if available
            hourly_h = w_data.get("hourly", {}).get("relative_humidity_2m", [55.0])
            humidity = hourly_h[0] if hourly_h else 55.0

            daily = w_data.get("daily", {})
            temp_max = daily.get("temperature_2m_max", [temp_c + 4.0])[0]
            temp_min = daily.get("temperature_2m_min", [temp_c - 4.0])[0]
            precip = daily.get("precipitation_sum", [0.0])[0]

            # Warnings generator
            warnings = []
            if temp_c >= 32:
                warnings.append("Extreme Heat Warning: Ensure containers are watered twice daily and provide afternoon shade.")
            elif temp_c <= 5:
                warnings.append("Cold Frost Warning: Protect cold-sensitive herbs like Basil and Peppers indoors.")
            if wind_speed >= 25:
                warnings.append("High Wind Exposure: Secure potted balcony plants against gusts.")
            if precip >= 15:
                warnings.append("Heavy Rain Alert: Ensure pots have good drainage holes to prevent waterlogging.")

            return {
                "city": resolved_city,
                "country": country,
                "latitude": lat,
                "longitude": lon,
                "temp_c": round(temp_c, 1),
                "temp_f": round(temp_c * 9/5 + 32, 1),
                "humidity_percent": round(humidity, 1),
                "wind_speed_kmh": round(wind_speed, 1),
                "temp_max_c": round(temp_max, 1),
                "temp_min_c": round(temp_min, 1),
                "precipitation_mm": round(precip, 1),
                "is_live_data": True,
                "source": "Open-Meteo Live API",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "warnings": warnings,
                "status_note": "Live weather active from Open-Meteo"
            }

    except Exception as e:
        logger.warning(f"Failed to fetch live weather for '{city}': {e}")
        return get_fallback_weather(city, reason=str(e))

def get_fallback_weather(city: str = "Local Garden", reason: str = "Operating without live weather network connection.") -> Dict[str, Any]:
    return {
        "city": city,
        "country": "Manual Climate Mode",
        "latitude": 0.0,
        "longitude": 0.0,
        "temp_c": 21.0,
        "temp_f": 69.8,
        "humidity_percent": 50.0,
        "wind_speed_kmh": 10.0,
        "temp_max_c": 25.0,
        "temp_min_c": 16.0,
        "precipitation_mm": 0.0,
        "is_live_data": False,
        "source": "Manual / Deterministic Fallback Mode",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "warnings": [
            "Operating in manual climate mode. Live weather updates are currently paused."
        ],
        "status_note": f"Dashboard operating in offline/manual mode ({reason})."
    }
