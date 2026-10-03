import { useNavigate } from "react-router-dom";
import { Camera, BarChart3, Bot, MessageCircle, Salad, Sparkles, Target, PieChart } from "lucide-react";
import SafeImage from "../components/SafeImage";

const IMG_HERO = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80&auto=format&fit=crop";
const IMG_STEP1 = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80&auto=format&fit=crop";
const IMG_STEP2 = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80&auto=format&fit=crop";
const IMG_STEP3 = "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80&auto=format&fit=crop";
const IMG_SHOWCASE = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=700&q=80&auto=format&fit=crop";

function Landing() {
  const navigate = useNavigate();

  const steps = [
    { img: IMG_STEP1, num: "01", title: "Chụp ảnh", desc: "Chụp nhanh bữa ăn hoặc tải ảnh có sẵn trên điện thoại." },
    { img: IMG_STEP2, num: "02", title: "AI phân tích", desc: "Nhận diện món ăn, ước tính khẩu phần và các dưỡng chất chính." },
    { img: IMG_STEP3, num: "03", title: "Nhận gợi ý", desc: "Xem kế hoạch AI đề xuất hằng tuần để điều chỉnh bữa ăn hợp lý." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
            <Salad size={24} /> NutritionAI
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-green-600">Tính năng</a>
            <a href="#how" className="hover:text-green-600">Cách hoạt động</a>
            <a href="#agent" className="hover:text-green-600">AI Agent</a>
          </nav>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-full transition"
          >
            Bắt đầu miễn phí
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 px-4 pt-16 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm mb-4">
              <Sparkles size={14} /> Dinh dưỡng cá nhân hóa bằng AI
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Hiểu rõ bữa ăn.<br />Sống khỏe hơn mỗi ngày.
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md">
              Chụp hoặc tải ảnh bữa ăn để hệ thống nhận diện món ăn, phân tích dinh dưỡng
              và đưa ra gợi ý cá nhân hóa phù hợp với mục tiêu của bạn.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md"
              >
                <Camera size={18} /> Bắt đầu phân tích
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-white transition"
              >
                Đăng nhập
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <SafeImage src={IMG_HERO} alt="Bữa ăn lành mạnh" className="w-full h-80 sm:h-96 object-cover" />
            </div>
            <div className="absolute -top-4 left-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-1.5 text-sm font-semibold text-green-700">
              <Sparkles size={14} /> AI nhận diện món ăn
            </div>
            <div className="absolute -bottom-5 left-4 right-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center justify-between gap-2">
              <span className="text-sm text-gray-700 font-medium">Một bữa ăn cân bằng, nhìn rõ trong vài giây</span>
            </div>
            <div className="absolute bottom-16 -right-3 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              Phân tích trong vài giây
            </div>
          </div>
        </div>
      </section>

      {/* Dải tính năng */}
      <section className="bg-green-800">
        <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-white text-sm font-medium">
          <div className="flex items-center justify-center gap-2"><Target size={18} /> Theo dõi mục tiêu cá nhân</div>
          <div className="flex items-center justify-center gap-2"><PieChart size={18} /> Hiểu rõ calo và dưỡng chất</div>
          <div className="flex items-center justify-center gap-2"><MessageCircle size={18} /> Hỏi AI Agent bất cứ lúc nào</div>
        </div>
      </section>

      {/* 3 bước */}
      <section id="how" className="max-w-6xl mx-auto px-4 py-20">
        <p className="text-green-600 text-xs font-bold tracking-wide mb-2">ĐƠN GIẢN, TRỰC QUAN, HỮU ÍCH</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">Ba bước để hiểu bữa ăn của bạn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              <SafeImage src={s.img} alt={s.title} className="w-full h-44 object-cover" />
              <div className="p-5">
                <span className="text-orange-500 font-bold text-sm">{s.num}</span>
                <h3 className="font-bold text-gray-900 mt-1 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <SafeImage src={IMG_SHOWCASE} alt="Nhật ký bữa ăn" className="w-full h-72 object-cover" />
        </div>
        <div>
          <p className="text-green-600 text-xs font-bold tracking-wide mb-2">TỪ MỘT BỨC ẢNH ĐẾN GÓC NHÌN RÕ RÀNG</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Biến nhật ký bữa ăn thành thói quen sống khỏe
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Hệ thống giúp bạn theo dõi năng lượng, đạm, béo và tinh bột trong cùng một không gian trực quan.
            Mỗi bữa ăn được lưu lại để bạn nhìn thấy xu hướng của mình rõ ràng hơn theo thời gian.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md"
          >
            Mở bảng điều khiển
          </button>
        </div>
      </section>

      {/* AI Agent callout */}
      <section id="agent" className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-blue-50 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-green-700 flex items-center justify-center flex-shrink-0">
            <Bot className="text-white" size={30} />
          </div>
          <div className="flex-1">
            <p className="text-green-700 text-xs font-bold tracking-wide mb-1">NGƯỜI BẠN ĐỒNG HÀNH DINH DƯỠNG</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không chỉ đếm calo. Hãy hiểu cơ thể mình.</h3>
            <p className="text-gray-600 text-sm">
              Trợ lý AI giúp bạn trả lời những câu hỏi hằng ngày như nên ăn gì, còn thiếu gì
              và làm sao để cân bằng bữa ăn tiếp theo.
            </p>
          </div>
          <button
            onClick={() => navigate("/register")}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition whitespace-nowrap"
          >
            Hỏi AI Agent
          </button>
        </div>
      </section>

      {/* CTA cuối */}
      <section className="px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Sẵn sàng bắt đầu?</h2>
        <p className="text-gray-500 mb-6">Miễn phí, chỉ mất 1 phút để tạo tài khoản.</p>
        <button
          onClick={() => navigate("/register")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-md"
        >
          Đăng ký ngay
        </button>
      </section>

      <footer className="border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
        Đồ án chuyên ngành — Hệ thống quản lý dinh dưỡng thông minh
      </footer>
    </div>
  );
}

export default Landing;