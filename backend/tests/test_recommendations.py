import pytest
from app.services.recommendation_engine import score_plant_for_profile, get_recommendations_for_profile
from app.services.plant_knowledge import get_plant_by_id

def test_basil_scoring_sunny_balcony():
    basil = get_plant_by_id("basil")
    assert basil is not None

    profile = {
        "city": "Austin",
        "garden_type": "balcony",
        "daily_sunlight": "full",
        "soil_type": "potting_mix",
        "water_availability": "moderate",
        "available_space_sqft": 5.0,
        "growing_goal": "herbs",
        "experience_level": "beginner",
        "current_temp_c": 24.0
    }

    res = score_plant_for_profile(basil, profile)
    assert res["suitability_score"] >= 80.0
    assert any("Ideal sunlight match" in r for r in res["reasons"])
    assert any("Container friendly" in r for r in res["reasons"])

def test_cherry_tomato_low_sunlight_penalty():
    tomato = get_plant_by_id("cherry_tomato")
    assert tomato is not None

    low_sun_profile = {
        "city": "Seattle",
        "garden_type": "windowsill",
        "daily_sunlight": "low",
        "soil_type": "sandy",
        "water_availability": "low",
        "available_space_sqft": 1.0,
        "growing_goal": "herbs",
        "experience_level": "beginner",
        "current_temp_c": 18.0
    }

    res = score_plant_for_profile(tomato, low_sun_profile)
    assert res["suitability_score"] <= 65.0
    assert any("Sunlight mismatch" in w for w in res["warnings"])

def test_recommendations_returns_sorted_list():
    profile = {
        "daily_sunlight": "partial",
        "garden_type": "balcony",
        "available_space_sqft": 10.0
    }
    recs = get_recommendations_for_profile(profile)
    assert len(recs) > 5
    # Verify sorted descending
    scores = [r["suitability_score"] for r in recs]
    assert scores == sorted(scores, reverse=True)
