from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    height_cm: Optional[float]
    weight_kg: Optional[float]
    goal: Optional[str] = "duy trì"
    is_admin: bool = False

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

from datetime import datetime

class MealLogCreate(BaseModel):
    food_id: int
    portion_size: str
    meal_type: str = "khác"

class MealLogOut(BaseModel):
    id: int
    food_id: int
    portion_size: str
    meal_type: str
    logged_at: datetime

    class Config:
        from_attributes = True

class Config:
            from_attributes = True

class MealLogFromPrediction(BaseModel):
    food_name: str
    portion_size: str
    meal_type: str = "khác"

class UserUpdate(BaseModel):
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    goal: Optional[str] = None

class ChatMessage(BaseModel):
    role: str  # "user" hoặc "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str

class FoodOut(BaseModel):
    id: int
    name: str
    calories_per_100g: float
    protein_g: float
    fat_g: float
    carbs_g: float

    class Config:
        from_attributes = True