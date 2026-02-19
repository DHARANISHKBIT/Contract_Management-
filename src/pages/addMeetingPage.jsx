import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiCloseLine,
  RiCalendarLine,
  RiTimeLine,
  RiTimerLine,
  RiUserLine,
  RiVideoAddLine,
  RiFileTextLine,
} from "react-icons/ri";
import axios from "axios";

const MEETINGS_API = "http://localhost:5000/api/meetings";
const CONTRACTS_API = "http://localhost:5000/api/contracts/allcontract";

export default function AddMeetingPage() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    contract_id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "30",
    status: "scheduled",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    const fetchContracts = async () => {
      try {
        const res = await axios.get(CONTRACTS_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && Array.isArray(res.data.contracts)) {
          setContracts(res.data.contracts);
          if (res.data.contracts.length > 0 && !form.contract_id) {
            setForm((f) => ({ ...f, contract_id: res.data.contracts[0]._id }));
          }
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        console.error(err);
      } finally {
        setLoadingContracts(false);
      }
    };
    fetchContracts();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!form.contract_id) {
      alert("Please select a contract.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        contract_id: form.contract_id,
        title: form.title,
        description: form.description || "",
        meeting_date: form.date,
        meeting_time: form.time,
        duration: Number(form.duration),
        status: form.status,
      };
      const res = await axios.post(MEETINGS_API + "/create", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        navigate("/admin-meeting");
      } else {
        alert(res.data.message || "Failed to create meeting");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      alert(err.response?.data?.message || "Failed to create meeting");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingContracts) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading contracts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <RiVideoAddLine size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg tracking-tight">Create New Meeting</h2>
                <p className="text-white/60 text-xs mt-0.5">Fill in the details to schedule your meeting</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin-meeting")}
              className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <RiCloseLine size={18} />
            </button>
          </div>

          <form id="add-meeting-form" onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Contract
              </label>
              <select
                name="contract_id"
                value={form.contract_id}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
              >
                <option value="">Select a contract</option>
                {contracts.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.contract_name} – {c.client_name}
                  </option>
                ))}
              </select>
              {contracts.length === 0 && (
                <p className="text-amber-600 text-xs">Create a contract first to schedule meetings.</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <RiFileTextLine size={13} /> Meeting Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Weekly Team Sync"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <RiFileTextLine size={13} /> Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Discuss project progress and upcoming tasks"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <RiCalendarLine size={13} /> Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <RiTimeLine size={13} /> Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <RiTimerLine size={13} /> Duration (minutes)
              </label>
              <select
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all appearance-none cursor-pointer"
              >
                {["15", "30", "45", "60", "90", "120"].map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
              >
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </form>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin-meeting")}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-meeting-form"
              disabled={submitting || contracts.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RiVideoAddLine size={16} />
              {submitting ? "Creating…" : "Create Meeting"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
