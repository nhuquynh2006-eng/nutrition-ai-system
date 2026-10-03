import { useEffect, useState } from "react";
import { History, Calendar, Search } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";
import SafeImage from "../components/SafeImage";

const IMG_BANNER = "https://images.unsplash.com/photo-1498579397066-22750a3cb424?w=1000&q=60&auto=format&fit=crop";

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=60&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=60&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=60&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=60&auto=format&fit=crop",
];

function pickImage(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % CARD_IMAGES.length;
  return CARD_IMAGES[hash];
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function MealHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [mealType, setMealType] = useState("all");

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (mealType !== "all") params.append("meal_type", mealType);

    api.get(`/meal-logs/history?${params.toString()}`)
      .then((res) => setLogs(res.data))
      .catch(() => setError("Không tải được lịch sử"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, mealType]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <History size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Lịch sử bữa ăn</h1>
            <p className="text-gray-500 text-sm">Toàn bộ bữa ăn đã ghi nhận</p>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden mb-5 h-32">
          <SafeImage src={IMG_BANNER} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-700/25" />
          <div className="relative h-full flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg drop-shadow">Nhật ký bữa ăn</p>
            <p className="text-white/85 text-sm drop-shadow max-w-md">
              Xem lại những bữa ăn bạn đã ghi nhận và nhận ra nhịp điệu ăn uống của mình.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 mb-5 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Ngày</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={date}
                max={todayStr()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Loại bữa ăn</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="all">Tất cả bữa ăn</option>
              <option value="sáng">Sáng</option>
              <option value="trưa">Trưa</option>
              <option value="tối">Tối</option>
              <option value="khác">Ăn vặt / Khác</option>
            </select>
          </div>
          {date && (
            <button
              onClick={() => setDate("")}
              className="self-end text-xs text-gray-400 hover:text-gray-600 underline pb-2"
            >
              Xóa lọc ngày
            </button>
          )}
        </div>

        {loading && <p className="text-gray-500 text-center py-10">Đang tải...</p>}
        {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {!loading && logs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <Search className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-gray-600 font-medium">
              Chưa có bữa ăn phù hợp với bộ lọc này. Hãy thử ghi nhận một bữa ăn mới.
            </p>
          </div>
        )}

        {!loading && logs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {logs.map((log) => (
              <div key={log.id} className="relative h-36 rounded-2xl overflow-hidden shadow-md">
                <SafeImage src={pickImage(log.food_name)} alt={log.food_name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{log.food_name}</span>
                    <span className="text-xs bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded-full">
                      {log.portion_size}
                    </span>
                  </div>
                  <span className="text-white/80 text-xs mt-0.5">
                    Bữa {log.meal_type} • {new Date(log.logged_at).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MealHistory;