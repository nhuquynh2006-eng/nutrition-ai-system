import onnxruntime as ort
import numpy as np
from PIL import Image
import json
import os

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "food_model.onnx")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "class_names.json")

session = ort.InferenceSession(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
    class_names = json.load(f)

MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

def preprocess_image(image: Image.Image) -> np.ndarray:
    image = image.convert("RGB").resize((224, 224))
    img_array = np.array(image).astype(np.float32) / 255.0
    img_array = (img_array - MEAN) / STD
    img_array = img_array.transpose(2, 0, 1)  # HWC -> CHW
    img_array = np.expand_dims(img_array, axis=0)  # thêm chiều batch
    return img_array.astype(np.float32)

def predict_food(image: Image.Image):
    input_tensor = preprocess_image(image)
    outputs = session.run(None, {"input": input_tensor})
    logits = outputs[0][0]

    # softmax để ra xác suất
    exp_logits = np.exp(logits - np.max(logits))
    probs = exp_logits / exp_logits.sum()

    predicted_idx = int(np.argmax(probs))
    confidence = float(probs[predicted_idx])
    food_name = class_names[predicted_idx]

    return food_name, confidence