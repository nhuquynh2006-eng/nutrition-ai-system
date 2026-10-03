import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Camera, BarChart3, Bot, LogOut, Salad, ShieldCheck, User, History, MessageCircle } from "lucide-react";
import api from "../api";

function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    api.get("/me")
      .then((res) => setIsAdmin(res.data.is_admin))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
  { icon: Home, label: "Trang chủ", path: "/home" },
  { icon: Camera, label: "Ghi nhận", path: "/log-meal" },
  { icon: History, label: "Lịch sử", path: "/meal-history" },
  { icon: BarChart3, label: "Xu hướng", path: "/dashboard" },
  { icon: Bot, label: "Kế hoạch AI", path: "/weekly-plan" },
  { icon: User, label: "Hồ sơ", path: "/profile" },
  { icon: MessageCircle, label: "Trợ lý AI", path: "/chat" },
];

  if (isAdmin) {
    navItems.push({ icon: ShieldCheck, label: "Quản trị", path: "/admin" });
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-16">
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 cursor-pointer text-green-600 font-bold"
        >
          <Salad size={24} />
          <span className="hidden sm:inline">NutritionAI</span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600 transition text-xs"
            >
              <item.icon size={18} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition text-xs"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;