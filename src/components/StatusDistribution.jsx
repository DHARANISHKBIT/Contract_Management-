export default function StatusDistribution({ title, items }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${item.color}`}
              ></span>
              <span className="text-gray-700">
                {item.label}
              </span>
            </div>

            {/* Right */}
            <span className="font-semibold">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
