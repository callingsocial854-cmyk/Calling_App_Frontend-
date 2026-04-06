import React, { useEffect, useState } from 'react';
import { 
  FaBell, 
  FaCheck, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimes, 
  FaEnvelope,
  FaUser,
  FaComment,
  FaSearch,
  FaCog,
  FaTrash,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $49.99 has been processed successfully',
      time: '2 minutes ago',
      read: false,
      icon: <FaCheck />,
      category: 'system'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Subscription Expiring',
      message: 'Your premium subscription expires in 3 days',
      time: '1 hour ago',
      read: false,
      icon: <FaExclamationTriangle />,
      category: 'system'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Feature Available',
      message: 'Check out the new dashboard analytics feature',
      time: '5 hours ago',
      read: true,
      icon: <FaInfoCircle />,
      category: 'system'
    },
    {
      id: 4,
      type: 'error',
      title: 'Login Alert',
      message: 'New login from Chrome on Windows',
      time: '1 day ago',
      read: true,
      icon: <FaUser />,
      category: 'security'
    },
    {
      id: 5,
      type: 'message',
      title: 'New Message from Sarah',
      message: 'Hey! I wanted to follow up on our project discussion...',
      time: '30 minutes ago',
      read: false,
      icon: <FaEnvelope />,
      category: 'message',
      sender: 'Sarah Johnson',
      senderAvatar: 'SJ'
    },
    {
      id: 6,
      type: 'message',
      title: 'Group Chat Update',
      message: 'Mike: "The design files are ready for review"',
      time: '2 hours ago',
      read: false,
      icon: <FaComment />,
      category: 'message',
      sender: 'Design Team',
      senderAvatar: 'DT'
    },
    {
      id: 7,
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile information has been updated successfully',
      time: '2 days ago',
      read: true,
      icon: <FaUser />,
      category: 'system'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAsUnread = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: false } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    // Filter by type/category
    if (filter === 'unread') return !notification.read;
    if (filter === 'messages') return notification.category === 'message';
    if (filter !== 'all') return notification.type === filter;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(term) ||
        notification.message.toLowerCase().includes(term) ||
        (notification.sender && notification.sender.toLowerCase().includes(term))
      );
    }
    
    return true;
  });

  const unreadCount = notifications.filter(notification => !notification.read).length;
  const messageCount = notifications.filter(notification => 
    notification.category === 'message' && !notification.read
  ).length;

  const getTypeColor = (type) => {
    const colors = {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      message: '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeGradient = (type) => {
    const gradients = {
      success: 'linear-gradient(135deg, #10b981, #059669)',
      warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
      error: 'linear-gradient(135deg, #ef4444, #dc2626)',
      info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      message: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    };
    return gradients[type] || 'linear-gradient(135deg, #6b7280, #4b5563)';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  

  return (
    <div className="notifications-container">
      {/* Header */}
      <div className="notifications-header">
        <div className="header-left">
          <div className="title-section">
            <div className="title-icon">
              <FaBell />
            </div>
            <div>
              <h1 className="notifications-title">Notifications</h1>
              
            </div>
          </div>
          
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <FaCheck />
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="notifications-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread
        </button>
        <button 
          className={`filter-btn ${filter === 'messages' ? 'active' : ''}`}
          onClick={() => setFilter('messages')}
        >
          <FaEnvelope />
          Messages
        </button>
        <button 
          className={`filter-btn ${filter === 'success' ? 'active' : ''}`}
          onClick={() => setFilter('success')}
        >
          <FaCheck />
          Success
        </button>
        <button 
          className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
          onClick={() => setFilter('warning')}
        >
          <FaExclamationTriangle />
          Warning
        </button>
        <button 
          className={`filter-btn ${filter === 'error' ? 'active' : ''}`}
          onClick={() => setFilter('error')}
        >
          <FaTimes />
          Error
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaBell />
            </div>
            <h3>No notifications found</h3>
            <p>
              {searchTerm 
                ? `No notifications matching "${searchTerm}"`
                : "You're all caught up! New notifications will appear here."
              }
            </p>
            {searchTerm && (
              <button 
                className="btn btn-secondary"
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              style={{
                borderLeftColor: getTypeColor(notification.type)
              }}
            >
              <div 
                className="notification-icon"
                style={{ 
                  background: getTypeGradient(notification.type),
                  color: 'white'
                }}
              >
                {notification.icon}
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <div className="notification-title-section">
                    <h4 className="notification-title">{notification.title}</h4>
                    {!notification.read && (
                      <span className="new-badge">New</span>
                    )}
                  </div>
                  <span className="notification-time">{notification.time}</span>
                </div>
                
                <p className="notification-message">{notification.message}</p>
                
                {notification.sender && (
                  <div className="sender-info">
                    <div className="sender-avatar">
                      {notification.senderAvatar}
                    </div>
                    <span className="sender-name">{notification.sender}</span>
                  </div>
                )}
              </div>

              <div className="notification-actions">
                {!notification.read ? (
                  <button 
                    className="action-btn read-btn"
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <FaEyeSlash />
                  </button>
                ) : (
                  <button 
                    className="action-btn unread-btn"
                    onClick={() => markAsUnread(notification.id)}
                    title="Mark as unread"
                  >
                    <FaEye />
                  </button>
                )}
                <button 
                  className="action-btn delete-btn"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>

              {!notification.read && (
                <div 
                  className="unread-indicator"
                  style={{ backgroundColor: getTypeColor(notification.type) }}
                ></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;