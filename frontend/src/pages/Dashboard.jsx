import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart3, Sparkles, Flame, Drumstick, CalendarCheck } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";


function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/daily-summary")
      .then((res) => setData(res.data))
      .catch(() => setError("Không tải được dữ liệu dashboard"))
      .finally(() => setLoading(false));

    api.get("/dashboard/ai-analysis")
      .then((res) => setAnalysis(res.data.analysis))
      .catch(() => setAnalysis(""))
      .finally(() => setAnalysisLoading(false));
  }, []);

  const avgCalories = data.length ? Math.round(data.reduce((s, d) => s + d.calories, 0) / data.length) : 0;
  const avgProtein = data.length ? Math.round(data.reduce((s, d) => s + d.protein, 0) / data.length) : 0;
  const daysLogged = data.length;

  const statCards = [
    { icon: Flame, label: "Calo trung bình/ngày", value: `${avgCalories} kcal`, color: "from-red-50 to-red-100 text-red-600" },
    { icon: Drumstick, label: "Đạm trung bình/ngày", value: `${avgProtein} g`, color: "from-blue-50 to-blue-100 text-blue-600" },
    { icon: CalendarCheck, label: "Số ngày đã ghi nhận", value: `${daysLogged}/7 ngày`, color: "from-green-50 to-green-100 text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <BarChart3 size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Xu hướng dinh dưỡng</h1>
            <p className="text-gray-500 text-sm">Theo dõi 7 ngày gần nhất</p>
          </div>
        </div>

        {!loading && data.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {statCards.map((c) => (
              <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4`}>
                <c.icon size={18} className="mb-2" />
                <div className="font-bold text-lg">{c.value}</div>
                <div className="text-xs opacity-80">{c.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2 text-sm">
            <Sparkles size={16} /> Nhận xét từ AI
          </div>
          {analysisLoading ? (
            <p className="text-gray-400 text-sm">Đang phân tích...</p>
          ) : (
            <p className="text-gray-700 text-sm leading-relaxed">{analysis}</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {loading && <p className="text-gray-500 text-center py-10">Đang tải...</p>}
          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          {!loading && data.length === 0 && (
            <div className="text-center py-10">
              <span className="text-4xl mb-2 block">📭</span>
              <p className="text-gray-500">Chưa có dữ liệu — hãy ghi nhận vài bữa ăn trước nhé!</p>
            </div>
          )}

          {!loading && data.length > 0 && (
            <div className="w-full h-80">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="calories" stroke="#e74c3c" name="Calo" strokeWidth={2} />
                  <Line type="monotone" dataKey="protein" stroke="#3498db" name="Đạm (g)" strokeWidth={2} />
                  <Line type="monotone" dataKey="fat" stroke="#f39c12" name="Béo (g)" strokeWidth={2} />
                  <Line type="monotone" dataKey="carbs" stroke="#2ecc71" name="Tinh bột (g)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;