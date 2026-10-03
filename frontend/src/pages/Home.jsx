import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, BarChart3, Bot, Flame, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import SloganBanner from "../components/SloganBanner";
import api from "../api";

const IMG_LOGMEAL = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=70&auto=format&fit=crop";
const IMG_TREND = "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=70&auto=format&fit=crop";
const IMG_PLAN = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=70&auto=format&fit=crop";

function Home() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/dashboard/today-summary")
      .then((res) => setSummary(res.data))
      .catch(() => {});
  }, []);

  const menuItems = [
    { icon: Camera, label: "Ghi nhận bữa ăn", desc: "Chụp ảnh hoặc nhập thủ công", path: "/log-meal", img: IMG_LOGMEAL },
    { icon: BarChart3, label: "Xem xu hướng", desc: "Biểu đồ 7 ngày + phân tích AI", path: "/dashboard", img: IMG_TREND },
    { icon: Bot, label: "Kế hoạch AI", desc: "Thực đơn gợi ý hằng tuần", path: "/weekly-plan", img: IMG_PLAN },
  ];

  const percent = summary ? Math.min(100, Math.round((summary.total_calories / summary.daily_goal) * 100)) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Xin chào! 👋</h1>
        <p className="text-gray-500 text-sm mb-4">Hôm nay bạn đã ăn gì chưa?</p>

        <SloganBanner />

        {summary && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <Flame className="text-orange-500" size={20} />
                Calo hôm nay
              </div>
              <span className="text-sm text-gray-400">{summary.meal_count} bữa đã ghi</span>
            </div>

            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold text-gray-800">{summary.total_calories}</span>
              <span className="text-gray-400 mb-1">/ {summary.daily_goal} kcal</span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Còn lại {summary.remaining > 0 ? summary.remaining : 0} kcal cho hôm nay
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative h-40 rounded-2xl overflow-hidden shadow-md group text-left"
            >
              <img
                src={item.img}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-110 duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
              <div className="relative h-full flex flex-col justify-end p-4 text-white">
                <item.icon size={22} className="mb-1.5" />
                <span className="font-bold text-sm leading-tight">{item.label}</span>
                <span className="text-xs text-white/80 mt-0.5">{item.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;