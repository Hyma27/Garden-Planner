import sqlite3
import json
import logging
from typing import Dict, Any, List, Optional
from app.config import DB_PATH

logger = logging.getLogger(__name__)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Garden Profile Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS garden_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location TEXT,
        city TEXT,
        garden_type TEXT,
        available_space_sqft REAL,
        daily_sunlight TEXT,
        soil_type TEXT,
        growing_goal TEXT,
        experience_level TEXT,
        water_availability TEXT,
        current_temp_c REAL,
        current_humidity REAL,
        wind_exposure TEXT,
        drainage_quality TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # User Garden Plants Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_garden_plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_id TEXT NOT NULL,
        plant_name TEXT NOT NULL,
        category TEXT,
        planted_date TEXT,
        stage TEXT DEFAULT 'seeded',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Action Tasks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS action_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_number INTEGER,
        task_date TEXT,
        title TEXT NOT NULL,
        instructions TEXT,
        estimated_minutes INTEGER,
        materials TEXT,
        rationale TEXT,
        is_completed INTEGER DEFAULT 0,
        plant_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

# Always ensure database tables exist when database module is imported
init_db()

# Helper queries
def save_garden_profile(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM garden_profile")
    
    cursor.execute("""
        INSERT INTO garden_profile (
            location, city, garden_type, available_space_sqft, daily_sunlight,
            soil_type, growing_goal, experience_level, water_availability,
            current_temp_c, current_humidity, wind_exposure, drainage_quality
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        profile_data.get("location", ""),
        profile_data.get("city", "Local Garden"),
        profile_data.get("garden_type", "balcony"),
        float(profile_data.get("available_space_sqft", 10.0)),
        profile_data.get("daily_sunlight", "partial"),
        profile_data.get("soil_type", "potting_mix"),
        profile_data.get("growing_goal", "herbs"),
        profile_data.get("experience_level", "beginner"),
        profile_data.get("water_availability", "moderate"),
        profile_data.get("current_temp_c"),
        profile_data.get("current_humidity"),
        profile_data.get("wind_exposure", "moderate"),
        profile_data.get("drainage_quality", "good")
    ))
    conn.commit()
    profile_id = cursor.lastrowid
    conn.close()
    
    return get_latest_garden_profile()

def get_latest_garden_profile() -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM garden_profile ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def add_plant_to_garden(plant_data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO user_garden_plants (plant_id, plant_name, category, planted_date, stage, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        plant_data["plant_id"],
        plant_data["plant_name"],
        plant_data.get("category", "herb"),
        plant_data.get("planted_date", ""),
        plant_data.get("stage", "seeded"),
        plant_data.get("notes", "")
    ))
    conn.commit()
    inserted_id = cursor.lastrowid
    conn.close()
    return get_garden_plant_by_id(inserted_id)

def get_garden_plant_by_id(id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_garden_plants WHERE id = ?", (id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def get_user_garden_plants() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_garden_plants ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def remove_user_garden_plant(id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM user_garden_plants WHERE id = ?", (id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def update_user_garden_plant(id: int, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    fields = []
    values = []
    for k, v in updates.items():
        if k in ["stage", "notes", "planted_date"]:
            fields.append(f"{k} = ?")
            values.append(v)
    if not fields:
        conn.close()
        return get_garden_plant_by_id(id)
    values.append(id)
    cursor.execute(f"UPDATE user_garden_plants SET {', '.join(fields)} WHERE id = ?", values)
    conn.commit()
    conn.close()
    return get_garden_plant_by_id(id)

def get_action_tasks() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM action_tasks ORDER BY day_number ASC, id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_action_task(task: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO action_tasks (day_number, task_date, title, instructions, estimated_minutes, materials, rationale, is_completed, plant_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        task.get("day_number", 1),
        task.get("task_date", ""),
        task["title"],
        task.get("instructions", ""),
        task.get("estimated_minutes", 15),
        task.get("materials", ""),
        task.get("rationale", ""),
        1 if task.get("is_completed") else 0,
        task.get("plant_id", "")
    ))
    conn.commit()
    inserted_id = cursor.lastrowid
    conn.close()
    return {"id": inserted_id, **task}

def toggle_task_completion(task_id: int, is_completed: bool) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE action_tasks SET is_completed = ? WHERE id = ?", (1 if is_completed else 0, task_id))
    conn.commit()
    cursor.execute("SELECT * FROM action_tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def seed_default_tasks_if_empty():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as cnt FROM action_tasks")
    cnt = cursor.fetchone()["cnt"]
    conn.close()
    if cnt == 0:
        default_tasks = [
            {
                "day_number": 1,
                "task_date": "Day 1",
                "title": "Sunlight Observation Walk",
                "instructions": "Step outside for 15 minutes at morning, mid-day, and afternoon. Record direct vs shaded hours in your garden area.",
                "estimated_minutes": 15,
                "materials": "Notebook or phone notes",
                "rationale": "Micro-climates vary drastically based on wall shadows, balconies, and surrounding trees.",
                "is_completed": 0,
                "plant_id": ""
            },
            {
                "day_number": 2,
                "task_date": "Day 2",
                "title": "Soil Moisture & Drainage Check",
                "instructions": "Insert your finger 2 inches deep into your pot or garden bed. Pour a cup of water to check if water drains freely within 30 seconds.",
                "estimated_minutes": 10,
                "materials": "Watering can, potting soil check",
                "rationale": "Prevents root rot and verifies whether container drainage holes are clear.",
                "is_completed": 0,
                "plant_id": ""
            },
            {
                "day_number": 3,
                "task_date": "Day 3",
                "title": "Prepare Pots & Nutrient Mix",
                "instructions": "Fill container pots with high-quality potting mix enriched with 20% organic compost.",
                "estimated_minutes": 20,
                "materials": "Containers with drainage holes, potting mix, compost",
                "rationale": "Provides a aerated, nutrient-dense foundation for young root systems.",
                "is_completed": 0,
                "plant_id": ""
            },
            {
                "day_number": 4,
                "task_date": "Day 4",
                "title": "Sow First Batch of Herb Seeds",
                "instructions": "Sow sweet basil or mint seeds 1/4 inch deep. Gently mist with water to avoid displacing seeds.",
                "estimated_minutes": 15,
                "materials": "Seeds, spray mister bottle",
                "rationale": "Herbs germinate quickly and build gardening confidence early.",
                "is_completed": 0,
                "plant_id": "basil"
            },
            {
                "day_number": 5,
                "task_date": "Day 5",
                "title": "Balcony & Wind Exposure Check",
                "instructions": "Inspect higher shelf locations or balconies for harsh gusts. Move delicate seedlings to sheltered nooks.",
                "estimated_minutes": 10,
                "materials": "Plant saucers or wind shield guards",
                "rationale": "Strong winds desicate tender leaves and dry out upper potted soil fast.",
                "is_completed": 0,
                "plant_id": ""
            },
            {
                "day_number": 6,
                "task_date": "Day 6",
                "title": "Pest Inspection & Natural Shielding",
                "instructions": "Examine leaf undersides for aphids or mites. Wipe gently with soapy water spray if spotted.",
                "estimated_minutes": 15,
                "materials": "Water mister, mild liquid organic soap",
                "rationale": "Catching pests early avoids chemical pesticides and protects pollinators.",
                "is_completed": 0,
                "plant_id": ""
            },
            {
                "day_number": 7,
                "task_date": "Day 7",
                "title": "Weekly Outdoor Touch-Grass Reflection",
                "instructions": "Sit in your garden spot for 15 minutes with no digital screens. Observe morning dew, soil scent, and seedling growth.",
                "estimated_minutes": 15,
                "materials": "A comfortable outdoor chair or garden mat",
                "rationale": "Encourages mindfulness and connection with outdoor nature.",
                "is_completed": 0,
                "plant_id": ""
            }
        ]
        for t in default_tasks:
            create_action_task(t)
