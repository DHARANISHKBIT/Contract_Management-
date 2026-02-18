import React, { useState } from 'react';
import { 
  FiSearch, 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiVideo,
  FiCircle
} from 'react-icons/fi';

const UserMeetings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const meetings = [
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
      title: 'Technical Architecture Review',
      description: 'Deep dive into system architecture and scalability',
      status: 'ongoing',
      date: '2026-02-16',
      time: '11:00',
      duration: 120,
      participants: { current: 4, total: 8 },
      host: 'Alex Thompson'
    }
  ];

  const filteredMeetings = meetings.filter(meeting => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'upcoming' && meeting.status === 'scheduled') ||
      (activeTab === 'live' && meeting.status === 'ongoing');
    const matchesSearch = 
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    upcoming: meetings.filter(m => m.status === 'scheduled').length,
    live: meetings.filter(m => m.status === 'ongoing').length,
    all: meetings.length
  };

  const handleJoinMeeting = (meetingId, status) => {
    alert(`Joining meeting ${meetingId}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Meetings</h1>
          <p className="text-gray-600 text-lg">Browse and join upcoming meetings</p>
        </div>

        {/* Search */}
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

        {/* Stats Cards */}
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{counts.live}</div>
                <div className="text-gray-600 font-medium">Live Now</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 bg-white p-2 rounded-xl border border-gray-200">
          {[
            { key: 'all', label: `All Meetings (${counts.all})` },
            { key: 'upcoming', label: `Upcoming (${counts.upcoming})` },
            { key: 'live', label: `Live Now (${counts.live})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
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
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              {/* Title and Status */}
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
                  {meeting.description}
                </p>
              </div>

              {/* Meeting Details */}
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
                {/* <div className="flex items-center gap-3 text-sm">
                  <FiUsers size={16} className="text-gray-400" />
                  <span className="text-gray-700">
                    {meeting.participants.current}/{meeting.participants.total} participants
                  </span>
                </div> */}
                <div className="flex items-center gap-3 text-sm">
                  <FiVideo size={16} className="text-gray-400" />
                  <span className="text-gray-700">Host: {meeting.host}</span>
                </div>
              </div>

              {/* Join Button */}
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
};

export default UserMeetings;