import { useEffect, useState } from "react";
import { User } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";
import SafeImage from "../components/SafeImage";

const IMG_BANNER = "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&q=60&auto=format&fit=crop";

function Profile() {
  const [email, setEmail] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [goal, setGoal] = useState("duy trì");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/me")
      .then((res) => {
        setEmail(res.data.email);
        setHeightCm(res.data.height_cm ?? "");
        setWeightKg(res.data.weight_kg ?? "");
        setGoal(res.data.goal ?? "duy trì");
      })
      .catch(() => setError("Không tải được hồ sơ"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await api.put("/me", {
        height_cm: heightCm ? parseFloat(heightCm) : null,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
        goal,
      });
      setSaved(true);
    } catch (err) {
      setError("Lưu thất bại, thử lại nhé");
    } finally {
      setSaving(false);
    }
  };

  const bmi = heightCm && weightKg ? (weightKg / ((heightCm / 100) ** 2)).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <User size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
            <p className="text-gray-500 text-sm">Thông tin và mục tiêu của bạn</p>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden mb-6 h-24">
          <SafeImage src={IMG_BANNER} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/75 via-amber-700/55 to-amber-600/25" />
          <div className="relative h-full flex items-center px-6">
            <p className="text-white font-semibold text-sm drop-shadow">Hiểu cơ thể mình để ăn uống đúng cách</p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-10">Đang tải...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl"
              />
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chiều cao (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cân nặng (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="giảm cân">Giảm cân</option>
                  <option value="duy trì">Duy trì</option>
                  <option value="tăng cân">Tăng cân</option>
                </select>
              </div>

              {bmi && (
                <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-700">
                  Chỉ số BMI hiện tại: <span className="font-bold">{bmi}</span>
                </div>
              )}

              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              {saved && <p className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg">Đã lưu thay đổi!</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;