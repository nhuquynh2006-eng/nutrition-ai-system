function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
      {/* Nền tròn phía sau */}
      <circle cx="200" cy="160" r="150" fill="#d1fae5" />

      {/* Điện thoại */}
      <rect x="130" y="60" width="140" height="220" rx="18" fill="#ffffff" stroke="#10b981" strokeWidth="4" />
      <rect x="145" y="80" width="110" height="130" rx="8" fill="#f0fdf4" />

      {/* Ảnh món ăn trong khung điện thoại - đĩa thức ăn đơn giản */}
      <circle cx="200" cy="140" r="42" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" />
      <ellipse cx="185" cy="130" rx="14" ry="10" fill="#fb923c" />
      <ellipse cx="212" cy="135" rx="12" ry="9" fill="#4ade80" />
      <ellipse cx="198" cy="152" rx="16" ry="8" fill="#f87171" />
      <circle cx="220" cy="118" r="6" fill="#facc15" />

      {/* Khung quét nhận diện (góc) */}
      <path d="M155 100 L155 90 L165 90" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M245 100 L245 90 L235 90" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M155 180 L155 190 L165 190" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M245 180 L245 190 L235 190" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Nút chụp */}
      <circle cx="200" cy="255" r="14" fill="#10b981" />
      <circle cx="200" cy="255" r="8" fill="#ffffff" />

      {/* Thẻ kết quả nổi bên phải */}
      <rect x="255" y="70" width="90" height="56" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />
      <text x="265" y="90" fontSize="11" fontWeight="bold" fill="#374151">Phở bò</text>
      <text x="265" y="106" fontSize="9" fill="#10b981">96% chắc chắn</text>
      <rect x="265" y="112" width="70" height="6" rx="3" fill="#d1fae5" />
      <rect x="265" y="112" width="65" height="6" rx="3" fill="#10b981" />

      {/* Sao lấp lánh trang trí */}
      <path d="M75 90 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="#fbbf24" />
      <path d="M320 200 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#34d399" />
      <path d="M95 230 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#60a5fa" />
    </svg>
  );
}

export default HeroIllustration;