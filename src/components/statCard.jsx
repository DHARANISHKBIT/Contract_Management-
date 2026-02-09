export default function StatCard({
  title,
  value,
  icon,
  color,
  bgColor,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-8 flex items-center justify-between">
      <div>
        <div className="text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>

      <div
        className={`p-3 rounded-lg ${bgColor} ${color}`}
      >
        <div className={`text-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
