import pytest
from app.services.ai_service import generate_deterministic_gardening_response
from app.services.plant_knowledge import get_plant_by_id

def test_ai_fallback_watering_query():
    res = generate_deterministic_gardening_response("How often should I water my balcony plants?")
    assert res["ai_status"] == "deterministic_fallback"
    assert "finger test" in res["reply"].lower()
    assert "suggested_outdoor_action" in res
    assert len(res["suggested_outdoor_action"]) > 10

def test_ai_fallback_with_plant_context():
    basil = get_plant_by_id("basil")
    res = generate_deterministic_gardening_response("How much sun does basil need?", plant=basil)
    assert res["ai_status"] == "deterministic_fallback"
    assert "sweet basil" in res["reply"].lower() or "basil" in res["reply"].lower()
    assert "suggested_outdoor_action" in res
