import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./AgentChat.css";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzI4MDdjY2YxZThhMWFmZjViYTMzZSIsInBob25lIjoiOTg3NjU0MzIxMCIsInJvbGUiOiJBZ2VudCIsImlhdCI6MTc3Mjc3NzQyMiwiZXhwIjoxNzczMzgyMjIyfQ.EZeitYeQ8znXr_6D2PW0yIEKUJ4HifHpM_7PtGFXK48";

const AgentChat = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io("ws://157.66.191.24:4446", {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 10,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      socketInstance.emit("agentOnline");
    });

    socketInstance.on("receiveMessage", (message) => {
      if (selectedQuery?.roomId === message.roomId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socketInstance.on("messagesByRoomId", (data) => {
      console.log("test",data);
      const { roomId, messages, status } = data;
      if (status && selectedQuery?.roomId === roomId) {
        console.log(messages);
        setMessages(messages || []);
      }
    });

    socketInstance.on("updateRoom", (data) => {
      console.log("updateRoomAgent", data);
    })

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
    console.log(messages);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://157.66.191.24:4446/api/agent/getAgentAcceptedQueries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const queriesData = res.data.data;
      console.log(res.data.data)
      setQueries(queriesData);

      // Initialize unread counts
      const initialUnreadCounts = {};
      queriesData.forEach((query) => {
        initialUnreadCounts[query.roomId] = query.unreadCount;
      });
      setUnreadCounts(initialUnreadCounts);
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // const selectQuery = (query) => {
  //   if (!socket) return;

  //   setSelectedQuery(query);
  //   setMessages([]);

  //   socket.emit("joinRoom", query.roomId);
  //   socket.emit("getMessagesByRoomId", { roomId: query.roomId });
  // };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedQuery || !socket) return;

    socket.emit("sendMessage", {
      roomId: selectedQuery.roomId,
      senderType: "agent",
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const renderMessages = () => {
    console.log(messages);
    if (!Array.isArray(messages) || messages.length === 0) {
      return (
        <div className="no-messages">
          <p>No messages yet. Start the conversation!</p>
        </div>
      );
    }

    const groupedMessages = groupMessagesByDate(messages);

    return Object.entries(groupedMessages).map(([date, dateMessages]) => (
      <div key={date}>
        <div className="date-divider">
          <span>{date}</span>
        </div>
        {dateMessages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`message-container ${
              msg.senderType === "agent" ? "agent" : "user"
            }`}
          >
            <div className="message-bubble">
              <div className="message-text">{msg.message}</div>
              <div className="message-time">{formatTime(msg.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="agent-chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <span className="total-chats">{queries.length} conversations</span>
        </div>

        <div className="queries-list">
          {loading ? (
            <div className="loading">Loading chats...</div>
          ) : queries.length === 0 ? (
            <div className="no-chats">No active chats</div>
          ) : (
            queries.map((query) => (
              <div
                key={query.roomId}
                className={`query-item ${
                  selectedQuery?.roomId === query.roomId ? "active" : ""
                }`}
                // onClick={() => selectQuery(query)}
              >
                <div className="query-avatar">
                  <img
                    src={query.query.userId.profileImage}
                    alt={query.query.userId.fullName}
                    onError={(e) => {
                      e.target.src =
                        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
                    }}
                  />
                  {unreadCounts[query.roomId] > 0 && (
                    <span className="unread-badge">
                      {unreadCounts[query.roomId]}
                    </span>
                  )}
                </div>
                <div className="query-info">
                  <div className="query-header">
                    <h4>{query.query.userId.fullName}</h4>
                    <span className="query-time">
                      {formatTime(query.query.createdAt)}
                    </span>
                  </div>
                  
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {selectedQuery ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user-info">
                <img
                  src={selectedQuery.query.userId.profileImage}
                  alt={selectedQuery.query.userId.fullName}
                  className="user-avatar"
                />
                <div>
                  <h3>{selectedQuery.query.userId.fullName}</h3>
                  <div className="user-details">
                    <span className="user-phone">
                      📱 {selectedQuery.query.userId.phone}
                    </span>
                    <span className="user-gender">
                      {selectedQuery.query.userId.gender}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="messages-container">
              {renderMessages()}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <div className="input-wrapper">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="message-input"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="send-button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-message">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99477 18.5291 5.47087C20.0052 6.94696 20.885 8.91565 21 11V11.5Z"
                  stroke="#4a5568"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2>Welcome to Agent Chat</h2>
              <p>Select a conversation from the sidebar to start chatting</p>
              <p className="hint">
                You have {queries.length} active conversations
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentChat;
