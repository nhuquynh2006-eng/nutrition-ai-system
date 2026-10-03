function PageBackground({ color = "green" }) {
  const colors = {
    green: ["#bbf7d0", "#a7f3d0"],
    blue: ["#bfdbfe", "#a5f3fc"],
    purple: ["#e9d5ff", "#ddd6fe"],
    amber: ["#fde68a", "#fed7aa"],
  };
  const [c1, c2] = colors[color] || colors.green;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-40 blur-3xl"
        style={{ backgroundColor: c1 }}
      />
      <div
        className="absolute top-1/2 -left-24 w-72 h-72 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: c2 }}
      />
    </div>
  );
}

export default PageBackground;