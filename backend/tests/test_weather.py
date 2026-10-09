import pytest
from app.services.weather_service import get_fallback_weather

def test_fallback_weather_structure():
    weather = get_fallback_weather("TestCity", "Simulated error")
    assert weather["city"] == "TestCity"
    assert weather["is_live_data"] is False
    assert "temp_c" in weather
    assert "humidity_percent" in weather
    assert len(weather["warnings"]) > 0
