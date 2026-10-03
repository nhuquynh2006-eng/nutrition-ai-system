import { useEffect, useState } from "react";
import { Users, UtensilsCrossed, Calendar, ShieldCheck } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";
import SafeImage from "../components/SafeImage";

const IMG_BANNER = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&q=60&auto=format&fit=crop";

function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/admin/users")])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data);
      })
      .catch(() => setError("Không tải được dữ liệu quản trị"))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Người dùng", value: stats.total_users, icon: Users, color: "from-blue-50 to-blue-100 text-blue-600" },
        { label: "Bữa ăn đã ghi", value: stats.total_logs, icon: UtensilsCrossed, color: "from-green-50 to-green-100 text-green-600" },
        { label: "Kế hoạch AI đã tạo", value: stats.total_plans, icon: Calendar, color: "from-purple-50 to-purple-100 text-purple-600" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Trang quản trị</h1>
            <p className="text-gray-500 text-sm">Tổng quan hệ thống</p>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden mb-6 h-24">
          <SafeImage src={IMG_BANNER} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-700/30" />
          <div className="relative h-full flex items-center px-6">
            <p className="text-white font-semibold text-sm drop-shadow">Giám sát toàn bộ hệ thống trong một màn hình</p>
          </div>
        </div>

        {loading && <p className="text-gray-500 text-center py-10">Đang tải...</p>}
        {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {!loading && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {statCards.map((card) => (
              <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5`}>
                <card.icon size={20} className="mb-2" />
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-sm opacity-80">{card.label}</div>
              </div>
            ))}
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-800">Danh sách người dùng</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="px-5 py-2 font-medium">Email</th>
                  <th className="px-5 py-2 font-medium">Chiều cao</th>
                  <th className="px-5 py-2 font-medium">Cân nặng</th>
                  <th className="px-5 py-2 font-medium">Số bữa đã ghi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 text-gray-800">{u.email}</td>
                    <td className="px-5 py-3 text-gray-500">{u.height_cm ? `${u.height_cm} cm` : "—"}</td>
                    <td className="px-5 py-3 text-gray-500">{u.weight_kg ? `${u.weight_kg} kg` : "—"}</td>
                    <td className="px-5 py-3 text-gray-500">{u.total_logs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;