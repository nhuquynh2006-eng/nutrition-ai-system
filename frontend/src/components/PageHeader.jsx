function PageHeader({ icon: Icon, title, subtitle, color = "green" }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color] || colors.green}`}>
        <Icon size={22} />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}

export default PageHeader;