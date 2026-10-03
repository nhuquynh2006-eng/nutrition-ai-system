from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import declarative_base
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    height_cm = Column(Float)
    weight_kg = Column(Float)
    is_admin = Column(Boolean, default=False)
    goal = Column(String, default="duy trì")  # "giảm cân" / "tăng cân" / "duy trì"

class Food(Base):
    __tablename__ = "foods"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    calories_per_100g = Column(Float)
    protein_g = Column(Float)
    fat_g = Column(Float)
    carbs_g = Column(Float)

class MealLog(Base):
    __tablename__ = "meal_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    food_id = Column(Integer, ForeignKey("foods.id"))
    portion_size = Column(String)
    meal_type = Column(String, default="khác")  # "sáng" / "trưa" / "tối" / "khác"
    logged_at = Column(DateTime, default=datetime.datetime.utcnow)

class WeeklyPlan(Base):
    __tablename__ = "weekly_plans"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(String)   # lưu kế hoạch dạng JSON string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

