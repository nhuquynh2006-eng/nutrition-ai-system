import { AppleIcon, RiceBowlIcon, FishIcon, LeafIcon } from "./FoodIcons";

function NutritionSection() {
  const points = [
    {
      icon: LeafIcon,
      title: "Ăn sạch là gì?",
      desc: "Ưu tiên thực phẩm tươi, ít qua chế biến, hạn chế đường và chất béo xấu — giúp cơ thể hấp thu dinh dưỡng trọn vẹn hơn.",
    },
    {
      icon: AppleIcon,
      title: "Tăng cường sức khỏe lâu dài",
      desc: "Chế độ ăn cân bằng giúp giảm nguy cơ béo phì, tiểu đường, tim mạch — những vấn đề ngày càng phổ biến do lối sống hiện đại.",
    },
    {
      icon: RiceBowlIcon,
      title: "Cân bằng năng lượng mỗi ngày",
      desc: "Nạp đủ calo, đạm, béo, tinh bột theo nhu cầu cơ thể giúp duy trì năng lượng ổn định suốt ngày dài làm việc.",
    },
    {
      icon: FishIcon,
      title: "Nhưng không cần phức tạp",
      desc: "Bạn không cần tính toán thủ công — chỉ cần chụp ảnh bữa ăn, phần còn lại để AI lo, từ tính dinh dưỡng đến gợi ý cải thiện.",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
        Vì sao nên quan tâm đến bữa ăn của mình?
      </h2>
      <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
        Ăn uống lành mạnh không phải là kiêng khem khắt khe — mà là hiểu rõ cơ thể mình đang nạp gì mỗi ngày.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {points.map((p) => (
          <div key={p.title} className="flex gap-4 bg-green-50 rounded-2xl p-5">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 text-green-600">
              <p.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">{p.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NutritionSection;