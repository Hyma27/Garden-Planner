import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "ollama" in data

def test_plants_list():
    res = client.get("/api/plants")
    assert res.status_code == 200
    plants = res.json()
    assert len(plants) >= 10

def test_plants_filter_category():
    res = client.get("/api/plants?category=herb")
    assert res.status_code == 200
    herbs = res.json()
    for h in herbs:
        assert h["category"].lower() == "herb"

def test_garden_profile_post_and_get():
    payload = {
        "location": "Denver, CO",
        "city": "Denver",
        "garden_type": "terrace",
        "available_space_sqft": 25.0,
        "daily_sunlight": "full",
        "soil_type": "loamy",
        "growing_goal": "vegetables",
        "experience_level": "intermediate",
        "water_availability": "high",
        "current_temp_c": 22.5,
        "current_humidity": 45.0
    }
    post_res = client.post("/api/garden-profile", json=payload)
    assert post_res.status_code == 200

    get_res = client.get("/api/garden-profile")
    assert get_res.status_code == 200
    profile = get_res.json()
    assert profile["city"] == "Denver"
    assert profile["garden_type"] == "terrace"

def test_garden_plants_crud():
    # 1. Add plant
    add_res = client.post("/api/garden/plants", json={
        "plant_id": "spearmint",
        "plant_name": "Spearmint",
        "stage": "seeded",
        "notes": "Testing mint pot"
    })
    assert add_res.status_code == 200
    item = add_res.json()["item"]
    item_id = item["id"]

    # 2. List garden plants
    list_res = client.get("/api/garden")
    assert list_res.status_code == 200
    garden_items = list_res.json()
    assert any(i["id"] == item_id for i in garden_items)

    # 3. Delete plant
    del_res = client.delete(f"/api/garden/plants/{item_id}")
    assert del_res.status_code == 200
