from apscheduler.schedulers.background import BackgroundScheduler
from database import SessionLocal
import models
import datetime
import json
from agent import generate_weekly_plan, fallback_weekly_plan


def aggregate_weekly_data():
    db = SessionLocal()
    try:
        one_week_ago = datetime.datetime.utcnow() - datetime.timedelta(days=7)

        users = db.query(models.User).all()
        for user in users:
            logs = (
                db.query(models.MealLog)
                .filter(models.MealLog.user_id == user.id)
                .filter(models.MealLog.logged_at >= one_week_ago)
                .all()
            )

            if not logs:
                continue

            total_calories = 0
            total_protein = 0
            total_fat = 0
            total_carbs = 0

            portion_multiplier = {"nhỏ": 0.7, "vừa": 1.0, "lớn": 1.4}

            for log in logs:
                food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
                if not food:
                    continue
                multiplier = portion_multiplier.get(log.portion_size, 1.0)
                total_calories += food.calories_per_100g * multiplier
                total_protein += food.protein_g * multiplier
                total_fat += food.fat_g * multiplier
                total_carbs += food.carbs_g * multiplier

            weekly_data = {
                "so_bua_da_ghi": len(logs),
                "tong_calo": round(total_calories, 1),
                "tong_dam_g": round(total_protein, 1),
                "tong_beo_g": round(total_fat, 1),
                "tong_tinh_bot_g": round(total_carbs, 1),
            }

            print(f"[Tổng hợp tuần] User {user.email}: {weekly_data}")

            try:
                plan = generate_weekly_plan(user.email, weekly_data)
                print(f"[AI Agent] Đã tạo kế hoạch tuần (Gemini) cho {user.email}")
            except Exception as e:
                print(f"[AI Agent] Gemini lỗi cho {user.email}, dùng kế hoạch dự phòng: {e}")
                plan = fallback_weekly_plan(weekly_data)

            new_plan = models.WeeklyPlan(
                user_id=user.id,
                content=json.dumps(plan, ensure_ascii=False),
            )
            db.add(new_plan)
            db.commit()

    finally:
        db.close()


scheduler = BackgroundScheduler()


def start_scheduler():
    scheduler.add_job(aggregate_weekly_data, "cron", day_of_week="sun", hour=20)
    scheduler.start()
    print("Scheduler đã khởi động — job tổng hợp tuần sẽ chạy mỗi tối Chủ nhật lúc 20h")