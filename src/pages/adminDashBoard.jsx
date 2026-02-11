import React, { useState, useEffect } from "react";
import StatCard from "../components/statCard";
import RecentContracts from "../components/RecentContracts";
import StatusBox from "../components/statusBox";
import { MdOutlineDescription } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { BiError } from "react-icons/bi";
import { GiConfirmed } from "react-icons/gi";
import { LuClock } from "react-icons/lu";
import { MdOutlineAttachMoney } from "react-icons/md";
import StatusDistribution from "../components/StatusDistribution";

const TYPE_COLORS = [
  { barColor: "#2563eb", trackColor: "#eff6ff" },
  { barColor: "#16a34a", trackColor: "#dcfce7" },
  { barColor: "#dc2626", trackColor: "#fee2e2" },
  { barColor: "#ca8a04", trackColor: "#fef9c3" },
  { barColor: "#9333ea", trackColor: "#f3e8ff" },
];

const STATUS_COLORS = {
  Active: "bg-green-500",
  Pending: "bg-yellow-500",
  Expired: "bg-red-500",
};

function formatAmount(num) {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${Number(num).toFixed(0)}`;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view the dashboard.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/contracts/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else setError(json.message || "Failed to load dashboard");
      })
      .catch((err) => setError(err.message || "Network error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const { stats, contractTypes, statusDistribution, recentContracts } = data;
  const total = stats?.total ?? 0;

  const contractTypesForBox = (contractTypes || []).map((item, i) => ({
    ...item,
    barColor: TYPE_COLORS[i % TYPE_COLORS.length].barColor,
    trackColor: TYPE_COLORS[i % TYPE_COLORS.length].trackColor,
  }));

  const statusItems = (statusDistribution || []).map((item) => ({
    label: item.label,
    value: item.value,
    color: STATUS_COLORS[item.label] || "bg-gray-500",
  }));

  const recentForList = (recentContracts || []).map((c) => ({
    title: c.contract_name,
    company: c.client_name,
    amount: formatAmount(c.amount),
    type: c.contract_type,
    status: c.status,
  }));

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="mb-4">
          Welcome back! Here&apos;s your contract summary
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Contracts"
            value={String(total)}
            icon={<MdOutlineDescription />}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Active Contracts"
            value={String(stats?.activeCount ?? 0)}
            icon={<GiConfirmed />}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            title="Expired Contracts"
            value={String(stats?.expiredCount ?? 0)}
            icon={<VscError />}
            color="text-red-600"
            bgColor="bg-red-50"
          />
          <StatCard
            title="Pending Contracts"
            value={String(stats?.pendingCount ?? 0)}
            icon={<LuClock />}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatCard
            title="Active Value"
            value={formatAmount(stats?.activeValue ?? 0)}
            icon={<MdOutlineAttachMoney />}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Expiring Soon"
            value={String(stats?.expiringSoonCount ?? 0)}
            icon={<BiError />}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
        </div>

        <RecentContracts contracts={recentForList} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <StatusBox title="Contract Types" items={contractTypesForBox} />
          <StatusDistribution title="Status Distribution" items={statusItems} />
        </div>
      </div>
    </div>
  );
}
