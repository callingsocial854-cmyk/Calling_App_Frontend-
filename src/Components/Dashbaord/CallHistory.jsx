import React, { useState } from 'react'
import { 
  FaSearch, 
  FaPhone, 
  FaVideo, 
  FaPhoneSlash, 
  FaArrowDown,
  FaArrowUp,
  FaFilter,
  FaHistory,
  FaEllipsisV
} from 'react-icons/fa'
import { IoVideocam, IoCall } from 'react-icons/io5'
import { MdMissedVideoCall, MdCallMissed } from 'react-icons/md'
import './CallHistory.css'

const CallHistory = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Sample call history data
  const callHistory = [
  {
    id: 1,
    name: 'Arjun Mehta',
    time: '10:30 AM',
    date: 'Today',
    type: 'video',
    duration: '15:23',
    status: 'outgoing',
    avatar: 'AM',
    missed: false,
    avatarColor: '#4f46e5'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    time: 'Yesterday',
    date: '09:15 PM',
    type: 'audio',
    duration: '08:45',
    status: 'incoming',
    avatar: 'PS',
    missed: false,
    avatarColor: '#dc2626'
  },
  {
    id: 3,
    name: 'Rohit Verma',
    time: 'Yesterday',
    date: '02:45 PM',
    type: 'video',
    duration: '--:--',
    status: 'incoming',
    avatar: 'RV',
    missed: true,
    avatarColor: '#059669'
  },
  {
    id: 4,
    name: 'Neha Gupta',
    time: 'Dec 12',
    date: '11:20 AM',
    type: 'audio',
    duration: '23:12',
    status: 'outgoing',
    avatar: 'NG',
    missed: false,
    avatarColor: '#7c3aed'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    time: 'Dec 11',
    date: '04:30 PM',
    type: 'video',
    duration: '05:34',
    status: 'incoming',
    avatar: 'VS',
    missed: false,
    avatarColor: '#ea580c'
  },
  {
    id: 6,
    name: 'Anita Iyer',
    time: 'Dec 10',
    date: '03:20 PM',
    type: 'audio',
    duration: '--:--',
    status: 'incoming',
    avatar: 'AI',
    missed: true,
    avatarColor: '#db2777'
  }
];


  const filters = [
    { key: 'all', label: 'All Calls', icon: <FaFilter /> },
    { key: 'missed', label: 'Missed', icon: <MdCallMissed /> },
    { key: 'video', label: 'Video', icon: <IoVideocam /> },
    { key: 'audio', label: 'Audio', icon: <FaPhone /> }
  ]

  const filteredCalls = callHistory.filter(call => {
    const matchesSearch = call.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = 
      activeFilter === 'all' ||
      (activeFilter === 'missed' && call.missed) ||
      (activeFilter === 'video' && call.type === 'video') ||
      (activeFilter === 'audio' && call.type === 'audio')
    
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (call) => {
    if (call.missed) {
      return call.type === 'video' ? 
        <MdMissedVideoCall className="icon missed" /> : 
        <MdCallMissed className="icon missed" />
    }
    return call.status === 'incoming' ? 
      <FaArrowDown className="icon incoming" /> : 
      <FaArrowUp className="icon outgoing" />
  }

  const getTypeIcon = (call) => {
    return call.type === 'video' ? 
      <IoVideocam className="icon video" /> : 
      <FaPhone className="icon audio" />
  }

  return (
    <div className="call-history">
      {/* Header Section */}
      <div className="call-history-heading">
        <div className="heading-left">
          
          <div className="heading-content">
            <h1>Call History</h1>
            
          </div>
        </div>
        
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaHistory />
          </div>
          <div className="stat-info">
            <span className="stat-number">{callHistory.length}</span>
            <span className="stat-label">Total Calls</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon missed">
            <MdCallMissed />
          </div>
          <div className="stat-info">
            <span className="stat-number">{callHistory.filter(call => call.missed).length}</span>
            <span className="stat-label">Missed Calls</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon video">
            <IoVideocam />
          </div>
          <div className="stat-info">
            <span className="stat-number">{callHistory.filter(call => call.type === 'video').length}</span>
            <span className="stat-label">Video Calls</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon audio">
            <FaPhone />
          </div>
          <div className="stat-info">
            <span className="stat-number">{callHistory.filter(call => call.type === 'audio').length}</span>
            <span className="stat-label">Audio Calls</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search calls by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          {filters.map(filter => (
            <button
              key={filter.key}
              className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              <span className="filter-icon">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Call List */}
      <div className="call-list">
        {filteredCalls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaPhoneSlash />
            </div>
            <p>No calls found</p>
            <span>Try adjusting your search or filter</span>
          </div>
        ) : (
          filteredCalls.map(call => (
            <div key={call.id} className={`call-item ${call.missed ? 'missed' : ''}`}>
              <div 
                className="call-avatar"
                style={{ backgroundColor: call.avatarColor }}
              >
                {call.avatar}
              </div>
              
              <div className="call-info">
                <div className="call-main-info">
                  <h3 className="call-name">
                    {call.name}
                  </h3>
                  <div className="call-meta">
                    <span className="call-type">{getTypeIcon(call)}</span>
                    <span className="call-status">{getStatusIcon(call)}</span>
                    <span className="call-duration">{call.duration}</span>
                  </div>
                </div>
                
                <div className="call-time">
                  <span className="time">{call.time}</span>
                  <span className="date">{call.date}</span>
                </div>
              </div>

              <div className="call-actions">
                <button className="action-btn video-call" title="Video Call">
                  <IoVideocam />
                </button>
                <button className="action-btn audio-call" title="Audio Call">
                  <FaPhone />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CallHistory