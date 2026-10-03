import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-6xl mb-4">🍽️</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy trang</h1>
      <p className="text-gray-500 mb-6">Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2.5 rounded-lg transition"
      >
        Về trang chủ
      </button>
    </div>
  );
}

export default NotFound;