import { useState, useEffect } from "react";
import { Camera, Keyboard, Search } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";


const IMG_PLACEHOLDER = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=60&auto=format&fit=crop";

function LogMeal() {
  const [mode, setMode] = useState("photo");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [portionSize, setPortionSize] = useState("vừa");
  const [mealType, setMealType] = useState("sáng");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    if (mode !== "manual" || searchTerm.trim() === "") {
      setFoodResults([]);
      return;
    }
    const timer = setTimeout(() => {
      api.get(`/foods?q=${encodeURIComponent(searchTerm)}`)
        .then((res) => setFoodResults(res.data))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, mode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
    setSaved(false);
    setError("");
  };

  const handlePredict = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await api.post("/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(response.data);
    } catch (err) {
      setError("Không nhận diện được món ăn, thử lại nhé");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFromPhoto = async () => {
    if (!prediction) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/meal-logs/from-photo", {
        food_name: prediction.food_name,
        portion_size: portionSize,
        meal_type: mealType,
      });
      setSaved(true);
    } catch (err) {
      setError("Lưu log thất bại, thử lại nhé");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveManual = async () => {
    if (!selectedFood) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/meal-logs", {
        food_id: selectedFood.id,
        portion_size: portionSize,
        meal_type: mealType,
      });
      setSaved(true);
    } catch (err) {
      setError("Lưu log thất bại, thử lại nhé");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setSelectedFood(null);
    setSearchTerm("");
    setSaved(false);
    setError("");
  };

  const nutritionTiles = (n) => (
    <div className="grid grid-cols-4 gap-2 text-center text-sm mb-4">
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl py-2.5">
        <div className="font-bold text-red-600">{n.calories_per_100g}</div>
        <div className="text-red-400 text-xs">kcal</div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl py-2.5">
        <div className="font-bold text-blue-600">{n.protein_g}g</div>
        <div className="text-blue-400 text-xs">Đạm</div>
      </div>
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl py-2.5">
        <div className="font-bold text-orange-600">{n.fat_g}g</div>
        <div className="text-orange-400 text-xs">Béo</div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl py-2.5">
        <div className="font-bold text-green-600">{n.carbs_g}g</div>
        <div className="text-green-400 text-xs">Tinh bột</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
            <Camera size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ghi nhận bữa ăn</h1>
            <p className="text-gray-500 text-sm">Chụp ảnh hoặc nhập thủ công</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode("photo"); resetAll(); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
              mode === "photo" ? "bg-green-500 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <Camera size={16} /> Chụp ảnh
          </button>
          <button
            onClick={() => { setMode("manual"); resetAll(); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
              mode === "manual" ? "bg-green-500 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <Keyboard size={16} /> Nhập thủ công
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {mode === "photo" && (
            <>
              {!previewUrl && (
                <label className="relative flex flex-col items-center justify-center rounded-2xl py-14 cursor-pointer overflow-hidden group">
                  <img
                    src={IMG_PLACEHOLDER}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-green-300 rounded-2xl" />
                  <span className="relative w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center mb-3 shadow-lg">
                    <Camera size={24} />
                  </span>
                  <span className="relative text-gray-700 font-medium text-sm">Chọn ảnh món ăn từ máy</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}

              {previewUrl && (
                <div className="mb-4">
                  <img src={previewUrl} alt="preview" className="w-full rounded-xl object-cover max-h-80" />
                  <label className="text-sm text-blue-500 cursor-pointer mt-2 inline-block">
                    Chọn ảnh khác
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              )}

              {selectedFile && !prediction && (
                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
                >
                  {loading ? "Đang nhận diện..." : "🔍 Nhận diện món ăn"}
                </button>
              )}

              {prediction && (
                <div className="mt-4 bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{prediction.food_name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      prediction.confidence >= 0.7 ? "bg-green-100 text-green-700"
                      : prediction.confidence >= 0.4 ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}>
                      {(prediction.confidence * 100).toFixed(0)}% chắc chắn
                    </span>
                  </div>

                  {prediction.confidence < 0.6 && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-3 py-2 mb-3">
                      ⚠️ Độ tin cậy không cao — nếu món này không đúng, hãy dùng{" "}
                      <button onClick={() => { setMode("manual"); resetAll(); }} className="underline font-medium">
                        chế độ Nhập thủ công
                      </button>.
                    </div>
                  )}

                  {prediction.nutrition && nutritionTiles(prediction.nutrition)}

                  <MealTypeAndPortion mealType={mealType} setMealType={setMealType} portionSize={portionSize} setPortionSize={setPortionSize} />

                  {!saved ? (
                    <button
                      onClick={handleSaveFromPhoto}
                      disabled={loading}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 mt-3"
                    >
                      {loading ? "Đang lưu..." : "✅ Xác nhận & Lưu"}
                    </button>
                  ) : (
                    <div className="text-center text-green-600 font-medium bg-green-50 py-2.5 rounded-xl mt-3">
                      🎉 Đã lưu vào nhật ký ăn uống!
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {mode === "manual" && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm món ăn</label>
              <div className="relative mb-2">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setSelectedFood(null); setSaved(false); }}
                  placeholder="Nhập tên món (vd: bánh mì, sữa chua...)"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {foodResults.length > 0 && !selectedFood && (
                <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 mb-4 max-h-48 overflow-y-auto">
                  {foodResults.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => { setSelectedFood(f); setFoodResults([]); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm"
                    >
                      {f.name} <span className="text-gray-400 text-xs">— {f.calories_per_100g} kcal/100g</span>
                    </button>
                  ))}
                </div>
              )}

              {searchTerm && foodResults.length === 0 && !selectedFood && (
                <p className="text-gray-400 text-sm mb-4">Không tìm thấy món phù hợp trong database.</p>
              )}

              {selectedFood && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{selectedFood.name}</h3>
                  {nutritionTiles(selectedFood)}

                  <MealTypeAndPortion mealType={mealType} setMealType={setMealType} portionSize={portionSize} setPortionSize={setPortionSize} />

                  {!saved ? (
                    <button
                      onClick={handleSaveManual}
                      disabled={loading}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 mt-3"
                    >
                      {loading ? "Đang lưu..." : "✅ Xác nhận & Lưu"}
                    </button>
                  ) : (
                    <div className="text-center text-green-600 font-medium bg-green-50 py-2.5 rounded-xl mt-3">
                      🎉 Đã lưu vào nhật ký ăn uống!
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg mt-3">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MealTypeAndPortion({ mealType, setMealType, portionSize, setPortionSize }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bữa</label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="sáng">Sáng</option>
          <option value="trưa">Trưa</option>
          <option value="tối">Tối</option>
          <option value="khác">Ăn vặt / Khác</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Khẩu phần</label>
        <select
          value={portionSize}
          onChange={(e) => setPortionSize(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="nhỏ">Nhỏ</option>
          <option value="vừa">Vừa</option>
          <option value="lớn">Lớn</option>
        </select>
      </div>
    </div>
  );
}

export default LogMeal;