import datetime
from collections import defaultdict
from typing import List

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from PIL import Image
import io

from database import engine, get_db
import models, schemas, auth
from ml.predictor import predict_food
from scheduler import start_scheduler, aggregate_weekly_data

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

import os

origins = [
    "http://localhost:5173",
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    start_scheduler()


@app.get("/")
def root():
    return {"status": "ok"}

def calculate_daily_goal(user: models.User) -> int:
    if not user.weight_kg or not user.height_cm:
        return 2000
    base = user.weight_kg * 24  # ước lượng nhu cầu năng lượng cơ bản đơn giản
    if user.goal == "giảm cân":
        base -= 300
    elif user.goal == "tăng cân":
        base += 300
    return round(base)


# ---------- AUTH ----------

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email đã được sử dụng")

    new_user = models.User(
        email=user.email,
        password_hash=auth.hash_password(user.password),
        height_cm=user.height_cm,
        weight_kg=user.weight_kg,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

    token = auth.create_access_token({"sub": str(db_user.id)})
    return {"access_token": token}


# ---------- NHẬN DIỆN MÓN ĂN ----------

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    food_name, confidence = predict_food(image)

    food = db.query(models.Food).filter(models.Food.name == food_name).first()
    if not food:
        return {
            "food_name": food_name,
            "confidence": confidence,
            "nutrition": None,
            "note": "Không tìm thấy thông tin dinh dưỡng cho món này trong database"
        }

    return {
        "food_name": food_name,
        "confidence": confidence,
        "nutrition": {
            "calories_per_100g": food.calories_per_100g,
            "protein_g": food.protein_g,
            "fat_g": food.fat_g,
            "carbs_g": food.carbs_g,
        }
    }


# ---------- NHẬT KÝ BỮA ĂN ----------

@app.post("/meal-logs", response_model=schemas.MealLogOut)
def create_meal_log(
    log: schemas.MealLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Không tìm thấy món ăn")

    new_log = models.MealLog(
        user_id=current_user.id,
        food_id=log.food_id,
        portion_size=log.portion_size,
        meal_type=log.meal_type,
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@app.get("/meal-logs", response_model=List[schemas.MealLogOut])
def get_my_meal_logs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return db.query(models.MealLog).filter(models.MealLog.user_id == current_user.id).all()


@app.post("/meal-logs/from-photo", response_model=schemas.MealLogOut)
def create_meal_log_from_photo(
    log: schemas.MealLogFromPrediction,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    food = db.query(models.Food).filter(models.Food.name == log.food_name).first()
    if not food:
        raise HTTPException(status_code=404, detail="Không tìm thấy món ăn trong database")

    new_log = models.MealLog(
        user_id=current_user.id,
        food_id=food.id,
        portion_size=log.portion_size,
        meal_type=log.meal_type,
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


# ---------- DASHBOARD ----------

@app.get("/dashboard/daily-summary")
def get_daily_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    seven_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=7)

    logs = (
        db.query(models.MealLog)
        .filter(models.MealLog.user_id == current_user.id)
        .filter(models.MealLog.logged_at >= seven_days_ago)
        .all()
    )

    portion_multiplier = {"nhỏ": 0.7, "vừa": 1.0, "lớn": 1.4}
    daily_totals = defaultdict(lambda: {"calories": 0, "protein": 0, "fat": 0, "carbs": 0})

    for log in logs:
        food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
        if not food:
            continue
        date_key = log.logged_at.strftime("%Y-%m-%d")
        multiplier = portion_multiplier.get(log.portion_size, 1.0)

        daily_totals[date_key]["calories"] += food.calories_per_100g * multiplier
        daily_totals[date_key]["protein"] += food.protein_g * multiplier
        daily_totals[date_key]["fat"] += food.fat_g * multiplier
        daily_totals[date_key]["carbs"] += food.carbs_g * multiplier

    result = [
        {"date": date, **{k: round(v, 1) for k, v in totals.items()}}
        for date, totals in sorted(daily_totals.items())
    ]
    return result


# ---------- TEST AUTOMATION (tạm thời, để test job không cần chờ tới Chủ nhật) ----------

@app.post("/test-weekly-job")
def test_weekly_job():
    aggregate_weekly_data()
    return {"status": "đã chạy job tổng hợp tuần, xem log trong Terminal"}



@app.get("/weekly-plans/latest")
def get_latest_weekly_plan(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    plan = (
        db.query(models.WeeklyPlan)
        .filter(models.WeeklyPlan.user_id == current_user.id)
        .order_by(models.WeeklyPlan.created_at.desc())
        .first()
    )

    if not plan:
        return {"exists": False}

    import json
    content = json.loads(plan.content)

    return {
        "exists": True,
        "created_at": plan.created_at,
        "meal_plan": content.get("meal_plan", []),
        "priority_notes": content.get("priority_notes", []),
        "reasoning": content.get("reasoning", ""),
    }



@app.get("/dashboard/today-summary")
def get_today_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    today_start = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    logs = (
        db.query(models.MealLog)
        .filter(models.MealLog.user_id == current_user.id)
        .filter(models.MealLog.logged_at >= today_start)
        .all()
    )

    portion_multiplier = {"nhỏ": 0.7, "vừa": 1.0, "lớn": 1.4}
    total_calories = 0
    meal_count = len(logs)

    for log in logs:
        food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
        if not food:
            continue
        multiplier = portion_multiplier.get(log.portion_size, 1.0)
        total_calories += food.calories_per_100g * multiplier

    daily_goal = calculate_daily_goal(current_user)
    return {
        "meal_count": meal_count,
        "total_calories": round(total_calories, 0),
        "daily_goal": daily_goal,
        "remaining": round(daily_goal - total_calories, 0),
    }

@app.get("/admin/users")
def admin_get_all_users(
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth.require_admin),
):
    users = db.query(models.User).all()
    result = []
    for u in users:
        log_count = db.query(models.MealLog).filter(models.MealLog.user_id == u.id).count()
        result.append({
            "id": u.id,
            "email": u.email,
            "height_cm": u.height_cm,
            "weight_kg": u.weight_kg,
            "total_logs": log_count,
        })
    return result


@app.get("/admin/stats")
def admin_get_stats(
    db: Session = Depends(get_db),
    admin: models.User = Depends(auth.require_admin),
):
    total_users = db.query(models.User).count()
    total_logs = db.query(models.MealLog).count()
    total_plans = db.query(models.WeeklyPlan).count()
    return {
        "total_users": total_users,
        "total_logs": total_logs,
        "total_plans": total_plans,
    }

@app.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.put("/me", response_model=schemas.UserOut)
def update_me(
    update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    if update.height_cm is not None:
        current_user.height_cm = update.height_cm
    if update.weight_kg is not None:
        current_user.weight_kg = update.weight_kg
    if update.goal is not None:
        current_user.goal = update.goal
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/meal-logs/history")
def get_meal_history(
    date: str = None,
    meal_type: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    query = db.query(models.MealLog).filter(models.MealLog.user_id == current_user.id)

    if date:
        try:
            day_start = datetime.datetime.strptime(date, "%Y-%m-%d")
            day_end = day_start + datetime.timedelta(days=1)
            query = query.filter(models.MealLog.logged_at >= day_start, models.MealLog.logged_at < day_end)
        except ValueError:
            pass

    if meal_type and meal_type != "all":
        query = query.filter(models.MealLog.meal_type == meal_type)

    logs = query.order_by(models.MealLog.logged_at.desc()).all()

    result = []
    for log in logs:
        food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
        result.append({
            "id": log.id,
            "food_name": food.name if food else "Không rõ",
            "portion_size": log.portion_size,
            "meal_type": log.meal_type,
            "logged_at": log.logged_at,
        })
    return result

from agent import chat_with_ai

@app.post("/chat", response_model=schemas.ChatResponse)
def chat(
    req: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    today_start = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    logs = (
        db.query(models.MealLog)
        .filter(models.MealLog.user_id == current_user.id)
        .filter(models.MealLog.logged_at >= today_start)
        .all()
    )

    eaten_today = []
    for log in logs:
        food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
        if food:
            eaten_today.append(f"{food.name} ({log.portion_size})")

    context = {
        "chieu_cao_cm": current_user.height_cm,
        "can_nang_kg": current_user.weight_kg,
        "da_an_hom_nay": eaten_today,
    }

    history_list = [{"role": h.role, "content": h.content} for h in req.history]
    reply = chat_with_ai(req.message, context, history_list)
    return {"reply": reply}

@app.get("/foods", response_model=List[schemas.FoodOut])
def list_foods(q: str = "", db: Session = Depends(get_db)):
    query = db.query(models.Food)
    if q:
        query = query.filter(models.Food.name.ilike(f"%{q}%"))
    return query.order_by(models.Food.name).all()


from agent import analyze_weekly_trend, fallback_rule_based_analysis

@app.get("/dashboard/ai-analysis")
def get_ai_analysis(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    seven_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=7)
    logs = (
        db.query(models.MealLog)
        .filter(models.MealLog.user_id == current_user.id)
        .filter(models.MealLog.logged_at >= seven_days_ago)
        .all()
    )

    if not logs:
        return {"analysis": "Chưa có đủ dữ liệu để phân tích. Hãy ghi nhận thêm vài bữa ăn nhé!"}

    portion_multiplier = {"nhỏ": 0.7, "vừa": 1.0, "lớn": 1.4}
    daily_totals = defaultdict(lambda: {"calories": 0, "protein": 0, "fat": 0, "carbs": 0})

    for log in logs:
        food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
        if not food:
            continue
        date_key = log.logged_at.strftime("%Y-%m-%d")
        multiplier = portion_multiplier.get(log.portion_size, 1.0)
        daily_totals[date_key]["calories"] += food.calories_per_100g * multiplier
        daily_totals[date_key]["protein"] += food.protein_g * multiplier
        daily_totals[date_key]["fat"] += food.fat_g * multiplier
        daily_totals[date_key]["carbs"] += food.carbs_g * multiplier

    daily_data = [
        {"date": date, **{k: round(v, 1) for k, v in totals.items()}}
        for date, totals in sorted(daily_totals.items())
    ]

    try:
        analysis = analyze_weekly_trend(daily_data)
    except Exception as e:
        print(f"[AI Analysis] Lỗi gọi Gemini, dùng phân tích dự phòng: {e}")
        analysis = fallback_rule_based_analysis(daily_data)

    return {"analysis": analysis}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Cấu hình CORS cho phép Vercel truy cập
origins = [
    "https://nutrition-ai-system.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",  # Nếu dùng Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Hoặc dùng ["*"] để cho phép tất cả các domain
    allow_credentials=True,
    allow_methods=["*"],         # Cho phép tất cả phương thức HTTP (POST, GET, PUT, DELETE, OPTIONS)
    allow_headers=["*"],         # Cho phép tất cả các Header
)