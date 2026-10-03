import SafeImage from "./SafeImage";

const SLOGANS = [
  "Ăn sạch mỗi ngày — sống khỏe mỗi ngày.",
  "Một tấm ảnh, biết ngay dinh dưỡng.",
  "Không cần đếm calo, để AI lo giúp bạn.",
  "Bữa ăn cân bằng, cơ thể khỏe mạnh.",
];

const BANNER_IMG = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&q=70&auto=format&fit=crop";

function SloganBanner() {
  const slogan = SLOGANS[new Date().getDate() % SLOGANS.length];

  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 h-32">
      <SafeImage src={BANNER_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/85 via-green-800/70 to-green-700/40" />
      <div className="relative h-full flex items-center px-6">
        <p className="text-lg font-semibold text-white max-w-xs drop-shadow">{slogan}</p>
      </div>
    </div>
  );
}

export default SloganBanner;