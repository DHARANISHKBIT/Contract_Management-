import React, { useState } from 'react';
import { FiSearch, FiPlus, FiCalendar, FiClock, FiUsers, FiVideo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MdOutlineCancel } from "react-icons/md";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: 'Product Strategy Meeting',
      description: 'Discuss Q2 product roadmap and upcoming features',
      status: 'scheduled',
      date: '2026-02-20',
      time: '10:00',
      duration: 60,
      participants: { current: 5, total: 15 },
      host: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Design Review Session',
      description: 'Review latest UI/UX designs for the mobile app',
      status: 'ongoing',
      date: '2026-02-16',
      time: '14:30',
      duration: 45,
      participants: { current: 8, total: 10 },
      host: 'Michael Chen'
    },
    {
      id: 3,
      title: 'Sprint Planning',
      description: 'Plan the tasks and stories for the upcoming sprint',
      status: 'scheduled',
      date: '2026-02-18',
      time: '09:00',
      duration: 90,
      participants: { current: 12, total: 20 },
      host: 'Emily Rodriguez'
    },
    {
      id: 4,
      title: 'Client Presentation',
      description: 'Present progress to the client and gather feedback',
      status: 'scheduled',
      date: '2026-02-22',
      time: '15:00',
      duration: 60,
      participants: { current: 6, total: 12 },
      host: 'David Kim'
    },
    {
      id: 5,
      title: 'Team Retrospective',
      description: 'Reflect on the last sprint and identify improvements',
      status: 'completed',
      date: '2026-02-10',
      time: '16:00',
      duration: 45,
      participants: { current: 10, total: 10 },
      host: 'Sarah Johnson'
    },
    {
      id: 6,
      title: 'Technical Architecture Review',
      description: 'Deep dive into system architecture and scalability',
      status: 'ongoing',
      date: '2026-02-16',
      time: '11:00',
      duration: 120,
      participants: { current: 5, total: 8 },
      host: 'Alex Thompson'
    }
  ]);

  const handleEditClick = (meeting) => {
    setEditingMeeting({ ...meeting });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingMeeting(null);
  };

  const handleUpdateMeeting = () => {
    setMeetings(meetings.map(m => 
      m.id === editingMeeting.id ? editingMeeting : m
    ));
    handleCloseModal();
  };

  const handleInputChange = (field, value) => {
    setEditingMeeting({ ...editingMeeting, [field]: value });
  };

  const handleDeleteMeeting = (id) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(meetings.filter(m => m.id !== id));
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

  const filteredMeetings = meetings.filter(meeting => {
    const matchesTab = activeTab === 'all' || meeting.status === activeTab;
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    scheduled: meetings.filter(m => m.status === 'scheduled').length,
    ongoing: meetings.filter(m => m.status === 'ongoing').length,
    completed: meetings.filter(m => m.status === 'completed').length,
    all: meetings.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 mb-2 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 text-lg">Manage all meetings and participants</p>  
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 font-medium shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5">
            <FiPlus size={20} />
            Create Meeting
          </button>
        </div>

        {/* Search */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm">
            <div className="text-4xl font-bold text-blue-900 mb-1">{counts.scheduled}</div>
            <div className="text-blue-700 font-medium">Scheduled Meetings</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-6 shadow-sm">
            <div className="text-4xl font-bold text-emerald-900 mb-1">{counts.ongoing}</div>
            <div className="text-emerald-700 font-medium">Ongoing Meetings</div>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-4xl font-bold text-slate-900 mb-1">{counts.completed}</div>
            <div className="text-slate-700 font-medium">Completed Meetings</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          {[
            { key: 'all', label: `All (${counts.all})` },
            { key: 'scheduled', label: `Scheduled (${counts.scheduled})` },
            { key: 'ongoing', label: `Ongoing (${counts.ongoing})` },
            { key: 'completed', label: `Completed (${counts.completed})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map(meeting => (
            <div
              key={meeting.id}
              className={`bg-white border-2 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 ${getStatusBg(meeting.status)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight">
                    {meeting.title}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </div>
                <div className="flex gap-2 ml-3">
                  <button 
                    onClick={() => handleEditClick(meeting)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <FiEdit2 size={16} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteMeeting(meeting.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {meeting.description}
              </p>

              {/* Meeting Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <FiCalendar size={16} className="text-slate-400" />
                  <span className="text-slate-700 font-medium">{meeting.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiClock size={16} className="text-slate-400" />
                  <span className="text-slate-700">
                    {meeting.time} ({meeting.duration} min)
                  </span>
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

      {/* Edit Modal */}
      {isEditModalOpen && editingMeeting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Edit Meeting</h2>
                <p className="text-slate-600 text-sm mt-1">Update the meeting details below.</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <MdOutlineCancel className="text-slate-600 text-3xl" />
               
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Meeting Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={editingMeeting.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description
                </label>
                <textarea
                  value={editingMeeting.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 resize-none"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={editingMeeting.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={editingMeeting.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Duration and Max Participants */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={editingMeeting.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 appearance-none bg-white"
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                    <option value={120}>120 min</option>
                  </select>
                </div>
                {/* <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    value={editingMeeting.participants.total}
                    onChange={(e) => handleInputChange('participants', {
                      ...editingMeeting.participants,
                      total: parseInt(e.target.value)
                    })}
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  />
                </div> */}
              </div>

              {/* Host Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Host Name
                </label>
                <input
                  type="text"
                  value={editingMeeting.host}
                  onChange={(e) => handleInputChange('host', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Status
                </label>
                <select
                  value={editingMeeting.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 appearance-none bg-white"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 text-slate-700 font-medium hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMeeting}
                className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
              >
                Update Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;