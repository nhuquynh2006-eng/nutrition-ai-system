function PlateIllustration() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
      <circle cx="100" cy="100" r="90" fill="#d1fae5" />
      <circle cx="100" cy="100" r="65" fill="#ffffff" stroke="#a7f3d0" strokeWidth="4" />
      <circle cx="100" cy="100" r="46" fill="#f0fdf4" />
      {/* rau */}
      <ellipse cx="80" cy="85" rx="16" ry="11" fill="#4ade80" />
      <ellipse cx="70" cy="105" rx="12" ry="9" fill="#22c55e" />
      {/* cà chua */}
      <circle cx="118" cy="90" r="12" fill="#f87171" />
      <path d="M118 80 q4 -6 8 0" stroke="#16a34a" strokeWidth="2" fill="none" />
      {/* trứng ốp la */}
      <ellipse cx="105" cy="118" rx="20" ry="14" fill="#fff7ed" stroke="#fde68a" strokeWidth="2" />
      <circle cx="108" cy="118" r="8" fill="#fbbf24" />
      {/* đũa */}
      <rect x="145" y="40" width="5" height="70" rx="2.5" fill="#a16207" transform="rotate(20 147 75)" />
      <rect x="155" y="40" width="5" height="70" rx="2.5" fill="#a16207" transform="rotate(20 157 75)" />
    </svg>
  );
}

export default PlateIllustration;