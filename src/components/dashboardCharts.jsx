import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const TYPE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#9333ea",
  "#0891b2",
  "#64748b",
  "#c026d3",
];

const statusColor = (label) => {
  const map = {
    Active: "#16a34a",
    Pending: "#ca8a04",
    Expired: "#dc2626",
  };
  return map[label] || "#64748b";
};

function pieDataFromTypes(contractTypes) {
  if (!Array.isArray(contractTypes)) return [];
  return contractTypes
    .map((t) => ({
      name: t.label || "Unknown",
      value: Number(t.value) || 0,
    }))
    .filter((d) => d.value > 0);
}

function barDataFromStatus(statusDistribution) {
  if (!Array.isArray(statusDistribution)) return [];
  return statusDistribution.map((s) => {
    const count =
      typeof s.count === "number"
        ? s.count
        : Number(String(s.value).replace(/\D/g, "")) || 0;
    return {
      name: s.label || "Unknown",
      count,
      fill: statusColor(s.label),
    };
  });
}

function EmptyChart({ message }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
      {message}
    </div>
  );
}

export default function DashboardCharts({ contractTypes, statusDistribution }) {
  const pieData = pieDataFromTypes(contractTypes);
  const barData = barDataFromStatus(statusDistribution);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
        <h3 className="mb-1 text-lg font-semibold text-slate-900">
          Contracts by type
        </h3>
        <p className="mb-4 text-sm text-slate-500">Share of each contract type</p>
        {pieData.length === 0 ? (
          <EmptyChart message="No contracts yet — types will appear here." />
        ) : (
          <div className="h-[300px] w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={48}
                  paddingAngle={2}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={TYPE_COLORS[i % TYPE_COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} contracts`, "Count"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-slate-700">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
        <h3 className="mb-1 text-lg font-semibold text-slate-900">
          Contracts by status
        </h3>
        <p className="mb-4 text-sm text-slate-500">Active, pending, and expired counts</p>
        {barData.length === 0 ? (
          <EmptyChart message="No status data yet." />
        ) : (
          <div className="h-[300px] w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#475569" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#475569" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, "Contracts"]}
                  labelFormatter={(label) => `Status: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  {barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
