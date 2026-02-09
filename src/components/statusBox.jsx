import LinearProgressBar from "../mui/LinearProgress";

export default function StatusBox({ title, items }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4">{title}</h3>

      {items.map((item, index) => (
        <div key={index} className="mb-4">
          {/* Label + Value */}
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>

          {/* Progress */}
          <LinearProgressBar
            value={item.percentage}
            barColor={item.barColor}
            trackColor={item.trackColor}
            height={6}
          />
        </div>
      ))}
    </div>
  );
}
