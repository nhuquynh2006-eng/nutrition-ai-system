import { useEffect, useState } from "react";
import { Bot } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";
import SafeImage from "../components/SafeImage";

const IMG_BANNER = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=60&auto=format&fit=crop";

function WeeklyPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/weekly-plans/latest")
      .then((res) => setPlan(res.data))
      .catch(() => setError("Không tải được kế hoạch"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kế hoạch dinh dưỡng tuần</h1>
            <p className="text-gray-500 text-sm">Do AI tự động tạo mỗi tối Chủ nhật</p>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden mb-6 h-28">
          <SafeImage src={IMG_BANNER} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-purple-700/30" />
          <div className="relative h-full flex items-center px-6">
            <p className="text-white font-semibold max-w-xs drop-shadow">
              Thực đơn cá nhân hóa, không cần tự tính toán
            </p>
          </div>
        </div>

        {loading && <p className="text-gray-500 text-center py-10">Đang tải...</p>}
        {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {!loading && plan && !plan.exists && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <span className="text-4xl mb-2 block">🕒</span>
            <p className="text-gray-500">
              Chưa có kế hoạch nào — kế hoạch sẽ được AI tự động tạo vào mỗi tối Chủ nhật,
              dựa trên dữ liệu ăn uống trong tuần của bạn.
            </p>
          </div>
        )}

        {!loading && plan && plan.exists && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Tạo lúc: {new Date(plan.created_at).toLocaleString("vi-VN")}
            </p>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">🍽️ Gợi ý thực đơn</h3>
              <ul className="space-y-2">
                {plan.meal_plan.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-gray-700 text-sm">
                    <span className="text-green-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">⚠️ Lưu ý ưu tiên</h3>
              <ul className="space-y-2">
                {plan.priority_notes.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-amber-800 text-sm">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">💡 Vì sao đề xuất như vậy</h3>
              <p className="text-green-800 text-sm leading-relaxed">{plan.reasoning}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeeklyPlan;