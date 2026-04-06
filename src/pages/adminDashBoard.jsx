import React, { useState, useEffect } from "react";
import StatCard from "../components/statCard";
import RecentContracts from "../components/recentContracts";
import { MdOutlineDescription } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { BiError } from "react-icons/bi";
import { GiConfirmed } from "react-icons/gi";
import { LuClock } from "react-icons/lu";
import { MdOutlineAttachMoney } from "react-icons/md";
import DashboardCharts from "../components/dashboardCharts";
import { API_BASE } from "../config/api";

function formatAmount(num) {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${Number(num).toFixed(0)}`;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setRole(localStorage.getItem("role"));
    if (!token) {
      setError("Please log in to view the dashboard.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/contracts/dashboard`, {
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

  const recentForList = (recentContracts || []).map((c) => ({
    title: c.contract_name,
    company: c.client_name,
    amount: formatAmount(c.amount),
    type: c.contract_type,
    status: c.status,
  }));

  const isUser = role === "user";
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold">
          {isUser ? "Assigned to you" : "Dashboard Overview"}
        </h2>
        <div className="mb-4">
          {isUser
            ? "Contracts assigned to you"
            : "Welcome back! Here's your contract summary"}
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

        <div className="mt-10">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Charts overview
          </h3>
          <DashboardCharts
            contractTypes={contractTypes}
            statusDistribution={statusDistribution}
          />
        </div>

        <RecentContracts contracts={recentForList} />
      </div>
    </div>
  );
}
