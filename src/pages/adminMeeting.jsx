import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiCalendar, FiClock, FiVideo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";
import { API_BASE } from "../config/api";

const MEETINGS_API = `${API_BASE}/meetings`;

function mapMeetingToUI(m) {
  const dateStr = m.meeting_date ? new Date(m.meeting_date).toISOString().slice(0, 10) : "";
  const host = m.created_by?.username || m.created_by?.email || "—";
  return {
    id: m._id,
    title: m.title || "",
    description: m.description || "",
    status: m.status || "scheduled",
    date: dateStr,
    time: m.meeting_time || "",
    duration: m.duration ?? 30,
    host,
    contract_name: m.contract_id?.contract_name,
    meeting_link: m.meeting_link || "",
  };
}

export default function AdminMeetingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    const fetchMeetings = async () => {
      try {
        const res = await axios.get(MEETINGS_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && Array.isArray(res.data.data)) {
          setMeetings(res.data.data.map(mapMeetingToUI));
        }
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setError(err.response?.data?.message || "Failed to load meetings");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, [navigate]);

  const handleEditClick = (meeting) => {
    setEditingMeeting({ ...meeting });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingMeeting(null);
  };

  const handleInputChange = (field, value) => {
    setEditingMeeting((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleUpdateMeeting = async () => {
    if (!editingMeeting?.id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const payload = {
        title: editingMeeting.title,
        description: editingMeeting.description,
        status: editingMeeting.status,
        meeting_date: editingMeeting.date,
        meeting_time: editingMeeting.time,
        duration: Number(editingMeeting.duration),
        meeting_link: editingMeeting.meeting_link?.trim() || "",
      };
      const res = await axios.put(`${MEETINGS_API}/${editingMeeting.id}`, payload, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setMeetings((prev) =>
          prev.map((m) => (m.id === editingMeeting.id ? mapMeetingToUI(res.data.data) : m))
        );
        handleCloseModal();
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      alert(err.response?.data?.message || "Failed to update meeting");
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.delete(`${MEETINGS_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setMeetings((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(res.data.message || "Delete failed");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      alert(err.response?.data?.message || "Failed to delete meeting");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'ongoing': return 'bg-emerald-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 border-blue-100';
      case 'ongoing': return 'bg-emerald-50 border-emerald-100';
      case 'completed': return 'bg-gray-50 border-gray-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesTab = activeTab === 'all' || meeting.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (meeting.title || "").toLowerCase().includes(q) ||
      (meeting.description || "").toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const counts = {
    scheduled: meetings.filter((m) => m.status === 'scheduled').length,
    ongoing: meetings.filter((m) => m.status === 'ongoing').length,
    completed: meetings.filter((m) => m.status === 'completed').length,
    all: meetings.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <p className="text-slate-600">Loading meetings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full min-w-0">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 tracking-tight">
              Admin Meetings
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">Manage all meetings and participants</p>
          </div>
          <button
            style={{ backgroundColor: "#6a6cfc" }}
            onClick={() => navigate("/add-meeting")}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:opacity-95 transition-all"
          >
            <FiPlus size={20} />
            Create Meeting
          </button>
        </div>

        <div className="mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="text-4xl font-bold text-blue-900 mb-1">{counts.scheduled}</div>
            <div className="text-blue-700 font-medium">Scheduled Meetings</div>
          </div>
          <div className="bg-linear-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="text-4xl font-bold text-emerald-900 mb-1">{counts.ongoing}</div>
            <div className="text-emerald-700 font-medium">Ongoing Meetings</div>
          </div>
          <div className="bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="text-4xl font-bold text-slate-900 mb-1">{counts.completed}</div>
            <div className="text-slate-700 font-medium">Completed Meetings</div>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto scrollbar-thin [-webkit-overflow-scrolling:touch]">
          {[
            { key: 'all', label: `All (${counts.all})` },
            { key: 'scheduled', label: `Scheduled (${counts.scheduled})` },
            { key: 'ongoing', label: `Ongoing (${counts.ongoing})` },
            { key: 'completed', label: `Completed (${counts.completed})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 min-w-[4.75rem] sm:flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key ? "bg-slate-900 text-black shadow-lg" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className={`bg-white border-2 rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all sm:hover:-translate-y-1 ${getStatusBg(meeting.status)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight">{meeting.title}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </div>
                <div className="flex gap-2 ml-3">
                  <button onClick={() => handleEditClick(meeting)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <FiEdit2 size={16} className="text-slate-600" />
                  </button>
                  <button onClick={() => handleDeleteMeeting(meeting.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">{meeting.description || "—"}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <FiCalendar size={16} className="text-slate-400" />
                  <span className="text-slate-700 font-medium">{meeting.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiClock size={16} className="text-slate-400" />
                  <span className="text-slate-700">{meeting.time} ({meeting.duration} min)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiVideo size={16} className="text-slate-400" />
                  <span className="text-slate-700">Host: {meeting.host}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMeetings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-slate-400 text-lg">No meetings found</div>
          </div>
        )}
      </div>

      {isEditModalOpen && editingMeeting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl gap-2">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">Edit Meeting</h2>
                <p className="text-slate-600 text-sm mt-1">Update the meeting details below.</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <MdOutlineCancel className="text-slate-600 text-3xl" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Meeting Title</label>
                <input
                  type="text"
                  value={editingMeeting.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
                <textarea
                  value={editingMeeting.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Date</label>
                  <input
                    type="date"
                    value={editingMeeting.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Time</label>
                  <input
                    type="time"
                    value={editingMeeting.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Duration (minutes)</label>
                <select
                  value={editingMeeting.duration}
                  onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 appearance-none bg-white"
                >
                  {[15, 30, 45, 60, 90, 120].map((d) => (
                    <option key={d} value={d}>{d} min</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Google Meet link (optional)</label>
                <input
                  type="url"
                  value={editingMeeting.meeting_link || ""}
                  onChange={(e) => handleInputChange('meeting_link', e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 rounded-b-2xl">
              <button onClick={handleCloseModal} className="w-full sm:w-auto px-6 py-3 text-slate-700 font-medium hover:bg-slate-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleUpdateMeeting} style={{ backgroundColor: "#6a6cfc" }} className="w-full sm:w-auto px-6 py-3 text-white font-medium rounded-xl hover:opacity-95 transition-all shadow-lg">
                Update Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
