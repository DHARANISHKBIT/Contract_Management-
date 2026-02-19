import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiVideo,
  FiCircle,
} from 'react-icons/fi';
import axios from "axios";

const API_BASE = "http://localhost:5000/api/meetings";

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
  };
}

export default function UserMeetingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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
        const res = await axios.get(API_BASE, {
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

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'upcoming' && meeting.status === 'scheduled') ||
      (activeTab === 'live' && meeting.status === 'ongoing');
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (meeting.title || "").toLowerCase().includes(q) ||
      (meeting.description || "").toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const counts = {
    upcoming: meetings.filter((m) => m.status === 'scheduled').length,
    live: meetings.filter((m) => m.status === 'ongoing').length,
    all: meetings.length,
  };

  const handleJoinMeeting = (meetingId, status) => {
    alert(`Joining meeting ${meetingId}... (integrate with your video provider)`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading meetings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Meetings</h1>
          <p className="text-gray-600 text-lg">Browse and join upcoming meetings</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiCalendar size={28} className="text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{counts.upcoming}</div>
                <div className="text-gray-600 font-medium">Upcoming Meetings</div>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg relative">
                <FiCircle size={28} className="text-emerald-600 fill-emerald-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{counts.live}</div>
                <div className="text-gray-600 font-medium">Live Now</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-8 bg-white p-2 rounded-xl border border-gray-200">
          {[
            { key: 'all', label: `All Meetings (${counts.all})` },
            { key: 'upcoming', label: `Upcoming (${counts.upcoming})` },
            { key: 'live', label: `Live Now (${counts.live})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === tab.key ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1">
                    {meeting.title}
                  </h3>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold text-white flex-shrink-0 ${
                      meeting.status === 'scheduled' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}
                  >
                    {meeting.status === 'scheduled' ? 'scheduled' : 'ongoing'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {meeting.description || "—"}
                </p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <FiCalendar size={16} className="text-gray-400" />
                  <span className="text-gray-700">{meeting.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiClock size={16} className="text-gray-400" />
                  <span className="text-gray-700">
                    {meeting.time} ({meeting.duration} min)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiVideo size={16} className="text-gray-400" />
                  <span className="text-gray-700">Host: {meeting.host}</span>
                </div>
              </div>
              <button
                onClick={() => handleJoinMeeting(meeting.id, meeting.status)}
                className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                {meeting.status === 'ongoing' ? 'Join Now' : 'Join Meeting'}
              </button>
            </div>
          ))}
        </div>

        {filteredMeetings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg">No meetings found</div>
          </div>
        )}
      </div>
    </div>
  );
}
