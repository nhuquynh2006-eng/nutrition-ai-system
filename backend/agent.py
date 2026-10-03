from google import genai
import os
import json

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_weekly_plan(user_email: str, weekly_data: dict) -> dict:
    prompt = f"""
Bạn là chuyên gia dinh dưỡng. Dưới đây là dữ liệu ăn uống tuần qua của một người dùng:
{json.dumps(weekly_data, ensure_ascii=False)}

Hãy trả về DUY NHẤT một JSON hợp lệ (không thêm chữ nào khác ngoài JSON), theo đúng cấu trúc:
{{
  "meal_plan": ["gợi ý bữa 1", "gợi ý bữa 2", "gợi ý bữa 3"],
  "priority_notes": ["lưu ý 1", "lưu ý 2"],
  "reasoning": "giải thích ngắn gọn vì sao đề xuất như vậy"
}}
"""
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )
    text = response.text.strip()

    if text.startswith("```"):
        text = text.strip("`")
        text = text.replace("json", "", 1).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "meal_plan": [],
            "priority_notes": [],
            "reasoning": f"Không parse được phản hồi từ AI: {text[:200]}"
        }

def chat_with_ai(user_message: str, context: dict, history: list) -> str:
    history_text = ""
    for turn in history[-6:]:  # chỉ lấy 6 lượt gần nhất để prompt không quá dài
        role = "Người dùng" if turn["role"] == "user" else "Trợ lý"
        history_text += f"{role}: {turn['content']}\n"

    prompt = f"""
Bạn là trợ lý dinh dưỡng thân thiện, trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu (không quá 150 từ).
Bối cảnh dữ liệu ăn uống hôm nay của người dùng: {json.dumps(context, ensure_ascii=False)}

Lịch sử hội thoại gần đây:
{history_text}

Câu hỏi mới của người dùng: {user_message}

Trả lời trực tiếp, không lặp lại câu hỏi. Nếu câu hỏi liên quan tới bệnh lý nghiêm trọng, khuyên người dùng gặp bác sĩ/chuyên gia dinh dưỡng thay vì tự chẩn đoán.
"""
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )
    return response.text.strip()

def analyze_weekly_trend(daily_data: list) -> str:
    prompt = f"""
Bạn là chuyên gia dinh dưỡng. Dưới đây là dữ liệu dinh dưỡng theo từng ngày trong tuần qua của một người dùng:
{json.dumps(daily_data, ensure_ascii=False)}

Hãy viết một đoạn nhận xét ngắn gọn (khoảng 60-80 từ), bằng tiếng Việt, về xu hướng ăn uống này:
- Có đang tăng/giảm/ổn định không
- Có điểm gì đáng chú ý (thiếu đạm, dư tinh bột, ăn không đều...)
- Một gợi ý ngắn gọn để cải thiện

Chỉ trả về đoạn văn nhận xét, không thêm tiêu đề hay định dạng markdown.
"""
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )
    return response.text.strip()

def fallback_rule_based_analysis(daily_data: list) -> str:
    if not daily_data:
        return "Chưa có đủ dữ liệu để phân tích."

    avg_calories = sum(d["calories"] for d in daily_data) / len(daily_data)
    avg_protein = sum(d["protein"] for d in daily_data) / len(daily_data)
    num_days = len(daily_data)

    parts = [f"Trong {num_days} ngày gần đây, trung bình bạn nạp khoảng {avg_calories:.0f} kcal/ngày."]

    if avg_calories < 1200:
        parts.append("Mức calo này khá thấp so với nhu cầu thông thường, nên cân nhắc ăn đủ bữa hơn.")
    elif avg_calories > 2500:
        parts.append("Mức calo này khá cao, nên chú ý kiểm soát khẩu phần nếu mục tiêu là duy trì hoặc giảm cân.")
    else:
        parts.append("Mức calo này nằm trong khoảng hợp lý.")

    if avg_protein < 40:
        parts.append("Lượng đạm trung bình còn thấp, nên bổ sung thêm thịt, cá, trứng, đậu.")

    parts.append("(Nhận xét cơ bản — hệ thống AI phân tích chi tiết hơn hiện đang tạm thời quá tải.)")
    return " ".join(parts)

def fallback_weekly_plan(weekly_data: dict) -> dict:
    total_calories = weekly_data.get("tong_calo", 0)
    total_protein = weekly_data.get("tong_dam_g", 0)
    meal_count = weekly_data.get("so_bua_da_ghi", 0)

    priority_notes = []
    if meal_count < 14:  # ít hơn 2 bữa/ngày trung bình
        priority_notes.append("Bạn ghi chép chưa đầy đủ trong tuần qua, nên cố gắng ghi nhận cả 3 bữa mỗi ngày để theo dõi chính xác hơn.")
    if total_calories < 7000:  # ước lượng thấp cho cả tuần
        priority_notes.append("Tổng năng lượng tuần qua khá thấp, nên ăn đủ bữa và tăng khẩu phần hợp lý.")
    elif total_calories > 17500:
        priority_notes.append("Tổng năng lượng tuần qua khá cao, nên giảm bớt tinh bột và đồ chiên rán.")
    if total_protein < 250:
        priority_notes.append("Lượng đạm còn thấp, nên bổ sung thêm thịt, cá, trứng, đậu trong các bữa ăn.")
    if not priority_notes:
        priority_notes.append("Chế độ ăn tuần qua khá cân bằng, hãy tiếp tục duy trì.")

    meal_plan = [
        "Bữa sáng: 1 phần tinh bột (phở/bún/bánh mì) kèm 1 nguồn đạm (trứng/thịt) và rau",
        "Bữa trưa: cơm với 1 món đạm chính (thịt/cá/đậu hũ), rau xanh, hạn chế chiên rán",
        "Bữa tối: ăn nhẹ hơn bữa trưa, ưu tiên rau và đạm, giảm tinh bột",
    ]

    return {
        "meal_plan": meal_plan,
        "priority_notes": priority_notes,
        "reasoning": "Đây là kế hoạch cơ bản được tạo tự động do hệ thống AI đang tạm thời không phản hồi (quá tải hoặc hết hạn mức miễn phí trong ngày). Kế hoạch dựa trên quy tắc dinh dưỡng thông thường, sẽ được thay thế bằng phân tích AI chi tiết hơn ở lần cập nhật tiếp theo.",
    }