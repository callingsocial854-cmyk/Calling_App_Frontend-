import React, { useState, useEffect, useRef } from "react";
import {
  FaFilter,
  FaUserPlus,
  FaSearch,
  FaPhone,
  FaVideo,
  FaCheck,
  FaCheckDouble,
  FaPaperPlane,
  FaTimes,
  FaBars,
  FaArrowLeft,
  FaEllipsisV,
  FaTrash,
  FaBan,
  FaMobile,
  FaStar,
  FaVolumeMute,
  FaImage,
  FaFileAlt,
  FaLink,
  FaImages,
  FaDownload,
  FaEllipsisH,
} from "react-icons/fa";
import "./Messages.css";
import { FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";
import QRCodeModal from "./QRCodeModal";

const Messages = () => {
  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const userDetailsRef = useRef(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [callType, setCallType] = useState("");

  // Sample chat data with online status
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Amit Sharma",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      avatar: "media/figure/chat_5.jpg",
      online: true,
      lastSeen: "2 min ago",
      unread: 3,
      phone: "+91 98765 43210",
      isFavorite: true,
      isMuted: false,
    },
    {
      id: 2,
      name: "Priya Verma",
      message: "Hey there! How are you doing?",
      avatar: "media/figure/chat_5.jpg",
      online: false,
      lastSeen: "1 hour ago",
      unread: 0,
      phone: "+91 87654 32109",
      isFavorite: false,
      isMuted: true,
    },
    {
      id: 3,
      name: "Rohit Singh",
      message: "Let's meet tomorrow for coffee",
      avatar: "media/figure/chat_5.jpg",
      online: true,
      lastSeen: "just now",
      unread: 1,
      phone: "+91 76543 21098",
      isFavorite: false,
      isMuted: false,
    },
  ]);

  const [currentChat, setCurrentChat] = useState({
    id: 1,
    name: "Amit Sharma",
    avatar: "media/figure/chat_5.jpg",
    online: true,
    lastSeen: "2 min ago",
    phone: "+91 98765 43210",
    isFavorite: true,
    isMuted: false,
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "me",
      content: "Hello!",
      time: "3:21 PM",
      date: "yesterday",
      read: true,
    },
    {
      id: 2,
      type: "you",
      content: "I'm Fine!",
      time: "3:30 PM",
      date: "yesterday",
      read: true,
    },
    {
      id: 3,
      type: "you",
      content: "Here are Pics!",
      time: "8:09 AM",
      date: "today",
      read: true,
    },
    {
      id: 4,
      type: "me",
      content: "Check this video!",
      time: "9:15 AM",
      date: "today",
      read: false,
    },
  ]);

  // Sample media files
  const [mediaFiles, setMediaFiles] = useState([
    {
      id: 1,
      type: "image",
      name: "beach.jpg",
      date: "2023-10-15",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      preview:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      type: "image",
      name: "mountain.png",
      date: "2023-10-14",
      url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=300&fit=crop",
      preview:
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      type: "file",
      name: "document.pdf",
      date: "2023-10-13",
      url: "#",
      preview: null,
    },
    {
      id: 4,
      type: "link",
      name: "project-link",
      date: "2023-10-12",
      url: "#",
      preview: null,
    },
    {
      id: 5,
      type: "image",
      name: "forest.jpg",
      date: "2023-10-11",
      url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop",
      preview:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop",
    },
    {
      id: 6,
      type: "image",
      name: "city.jpg",
      date: "2023-10-10",
      url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop",
      preview:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop",
    },
  ]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu when clicking on overlay or selecting a chat
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    scrollToTop();
    setHasScrolled(false);
  }, [currentChat]);

  useEffect(() => {
    if (hasScrolled) {
      scrollToBottom();
    }
  }, [messages, hasScrolled]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = 0;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: "me",
        content: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: "today",
        read: false,
      };

      setMessages([...messages, newMessage]);
      setMessage("");
      setHasScrolled(true);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    if (isMobile) {
      closeMobileMenu();
    }

    // Mark messages as read when opening chat
    const updatedMessages = messages.map((msg) => ({
      ...msg,
      read: true,
    }));
    setMessages(updatedMessages);

    // Update unread count in chats
    const updatedChats = chats.map((c) =>
      c.id === chat.id ? { ...c, unread: 0 } : c
    );
    setChats(updatedChats);

    scrollToTop();
    setHasScrolled(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showChatOptions && !event.target.closest(".chatOptions")) {
        setShowChatOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatOptions]);

  // New Feature Handlers
  const clearChat = () => {
    setMessages([]);
    setShowChatOptions(false);
    setHasScrolled(false);
  };

  const toggleBlock = () => {
    setIsBlocked(!isBlocked);
    setShowChatOptions(false);
  };

  const toggleFavorite = () => {
    const updatedChats = chats.map((chat) =>
      chat.id === currentChat.id
        ? { ...chat, isFavorite: !chat.isFavorite }
        : chat
    );
    setChats(updatedChats);
    setCurrentChat({ ...currentChat, isFavorite: !currentChat.isFavorite });
  };

  const toggleMute = () => {
    const updatedChats = chats.map((chat) =>
      chat.id === currentChat.id ? { ...chat, isMuted: !chat.isMuted } : chat
    );
    setChats(updatedChats);
    setCurrentChat({ ...currentChat, isMuted: !currentChat.isMuted });
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(messageSearchQuery.toLowerCase())
  );

  const openMediaGallery = () => {
    setShowMediaGallery(true);
  };

  const closeMediaGallery = () => {
    setShowMediaGallery(false);
    setSelectedMedia(null);
    setCurrentMediaIndex(0);
  };

  const openMediaPreview = (media, index) => {
    setSelectedMedia(media);
    setCurrentMediaIndex(index);
  };

  const closeMediaPreview = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (direction) => {
    const imagesOnly = mediaFiles.filter((file) => file.type === "image");
    let newIndex;

    if (direction === "next") {
      newIndex = (currentMediaIndex + 1) % imagesOnly.length;
    } else {
      newIndex =
        (currentMediaIndex - 1 + imagesOnly.length) % imagesOnly.length;
    }

    setCurrentMediaIndex(newIndex);
    setSelectedMedia(imagesOnly[newIndex]);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedMedia) {
        if (e.key === "Escape") {
          closeMediaPreview();
        } else if (e.key === "ArrowRight") {
          navigateMedia("next");
        } else if (e.key === "ArrowLeft") {
          navigateMedia("prev");
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [selectedMedia, currentMediaIndex]);

  // Handle initial scroll position - stay at top
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = 0;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleVoiceCall = () => {
    setCallType("voice");
    setShowQRModal(true);
  };

  const handleVideoCall = () => {
    setCallType("video");
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setCallType("");
  };

  return (
    <div className="messagesContainer">
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button className="mobileMenuToggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaArrowLeft /> : <FaBars />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className={`mobileOverlay ${isMobileMenuOpen ? "active" : ""}`}
          onClick={closeMobileMenu}
        />
      )}

      <main className="MessagesMain">
        {/* LEFT SIDE NAV */}
        <div className={`sideNav2 ${isMobileMenuOpen ? "mobileOpen" : ""}`}>
          <div className="SideNavhead">
            <h2>Chats</h2>
            
          </div>

          <div className="SearchInputHolder">
            <FaSearch className="icon" />
            <input
              className="searchInput"
              placeholder="Search For Chat.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="chatList">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`group ${
                  currentChat.id === chat.id ? "active" : ""
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="avatarContainer">
                  <div className="avatar">
                    <img src={chat.avatar} alt={chat.name} />
                  </div>
                  <div
                    className={`statusDot ${
                      chat.online ? "online" : "offline"
                    }`}
                  ></div>
                </div>
                <div className="chatInfo">
                  <div className="chatHeader">
                    <p className="GroupName">{chat.name}</p>
                    {chat.unread > 0 && (
                      <span className="unreadBadge">{chat.unread}</span>
                    )}
                  </div>
                  <p className="GroupDescrp">{chat.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT SECTION */}
        <section className={`Chat ${isMobileMenuOpen ? "menuOpen" : ""}`}>
          <div className="ChatHead">
            <div className="chatUser" onClick={() => setShowUserDetails(true)}>
              <div className="avatarContainer">
                <div className="avatar">
                  <img src={currentChat.avatar} alt={currentChat.name} />
                </div>
                <div
                  className={`statusDot ${
                    currentChat.online ? "online" : "offline"
                  }`}
                ></div>
              </div>
              <div className="userInfo">
                <p className="GroupName">{currentChat.name}</p>
                <span className="userStatus">
                  {currentChat.online
                    ? "Online"
                    : `Last seen ${currentChat.lastSeen}`}
                </span>
              </div>
            </div>
            <div className="callGroup">
              <button
                className="iconBtn"
                onClick={handleVoiceCall}
                title="Voice Call"
              >
                <FaPhone />
              </button>
              <button
                className="iconBtn"
                onClick={handleVideoCall}
                title="Video Call"
              >
                <FaVideo />
              </button>
              <div className="chatOptions">
                <button
                  className="iconBtn"
                  onClick={() => setShowChatOptions(!showChatOptions)}
                  style={{ width: "23px", height: "0px" }}
                >
                  <FaEllipsisV />
                </button>
                {showChatOptions && (
                  <div className="chatOptionsMenu">
                    <button onClick={() => setShowMessageSearch(true)}>
                      <FaSearch /> Search Messages
                    </button>
                    <button onClick={clearChat}>
                      <FaTrash /> Clear Chat
                    </button>
                    <button onClick={toggleBlock}>
                      <FaBan /> {isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Search Bar */}
          {showMessageSearch && (
            <div className="messageSearchBar">
              <FaSearch className="icon" />
              <input
                type="text"
                placeholder="Search in conversation..."
                value={messageSearchQuery}
                onChange={(e) => setMessageSearchQuery(e.target.value)}
                className="messageSearchInput"
              />
              <button
                className="closeSearch"
                onClick={() => {
                  setShowMessageSearch(false);
                  setMessageSearchQuery("");
                }}
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* MESSAGES */}
          <div className="MessageContainer" ref={messageContainerRef}>
            {filteredMessages.map((msg, index) => {
              const showDateSeparator =
                index === 0 || msg.date !== filteredMessages[index - 1].date;
              return (
                <React.Fragment key={msg.id}>
                  {showDateSeparator && (
                    <div className="messageSeperator">{msg.date}</div>
                  )}
                  <div className={`message ${msg.type}`}>
                    {/* Message Content */}
                    {msg.content && (
                      <p className="messageContent">{msg.content}</p>
                    )}

                    <div className="messageDetails">
                      <div className="messageTime">{msg.time}</div>
                      {msg.type === "me" &&
                        (msg.read ? (
                          <FaCheckDouble className="readReceipt read" />
                        ) : (
                          <FaCheck className="readReceipt" />
                        ))}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Blocked Warning */}
          {isBlocked && (
            <div className="blockedWarning">
              You have blocked this user. Unblock to send messages.
            </div>
          )}

          {/* MESSAGE FORM */}
          {!isBlocked && (
            <form id="MessageForm" onSubmit={handleSubmit}>
              <input
                type="text"
                id="MessageInput"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={isBlocked}
              />

              <button className="Send" type="submit" disabled={isBlocked}>
                <FaPaperPlane />
              </button>
            </form>
          )}
        </section>

        <QRCodeModal
        isOpen={showQRModal}
        onClose={closeQRModal}
        type={callType}
        userName={currentChat.name}
      />
      </main>

      {/* User Details Panel */}
      <div
        className={`userDetailsPanel ${showUserDetails ? "show" : ""}`}
        ref={userDetailsRef}
      >
        <div className="userDetailsHeader">
          <button
            className="backButton"
            onClick={() => setShowUserDetails(false)}
          >
            <FaArrowLeft />
          </button>
          <h3>Contact Info</h3>
        </div>

        <div className="userDetailsContent">
          <div className="userProfileSection">
            <div className="userAvatarLarge">
              <img src={currentChat.avatar} alt={currentChat.name} />
            </div>
            <div className="userNameLarge">{currentChat.name}</div>
            <div className="userStatusText">
              {currentChat.online
                ? "Online"
                : `Last seen ${currentChat.lastSeen}`}
            </div>
          </div>

          <div className="userDetailsSection">
            <div className="detailItem">
              <FaMobile className="detailIcon" />
              <div className="detailInfo">
                <div className="detailLabel">Phone</div>
                <div className="detailValue">{currentChat.phone}</div>
              </div>
            </div>
          </div>

          <div className="sharedMediaSection">
            <div className="sectionHeader">
              <h4>Shared Media, Links and Docs</h4>
              <button className="viewAllBtn" onClick={openMediaGallery}>
                View All
              </button>
            </div>

            <div className="mediaGrid">
              {mediaFiles.slice(0, 2).map((file, index) => (
                <div key={file.id} className="mediaItem">
                  {file.type === "image" && (
                    <>
                      <FaImage className="mediaIcon" />
                      <img
                        src={file.url}
                        style={{ height: "100%", width: "100%" }}
                        alt=""
                        onClick={() => openMediaPreview(file, index)}
                      />
                    </>
                  )}
                </div>
              ))}
              {mediaFiles.length > 4 && (
                <div className="mediaItem moreItems" onClick={openMediaGallery}>
                  <span>+{mediaFiles.length - 4}</span>
                </div>
              )}
            </div>
          </div>

          <div className="dangerZone">
            <button className="dangerBtn" onClick={clearChat}>
              <FaTrash />
              <span>Clear Chat</span>
            </button>
            <button className="dangerBtn" onClick={toggleBlock}>
              <FaBan />
              <span>{isBlocked ? "Unblock User" : "Block User"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Details Overlay */}
      {showUserDetails && (
        <div
          className="userDetailsOverlay"
          onClick={() => setShowUserDetails(false)}
        ></div>
      )}

      {/* Media Gallery */}
      {showMediaGallery && (
        <div className="mediaGallery">
          <div className="galleryHeader">
            <button className="backButton" onClick={closeMediaGallery}>
              <FaArrowLeft />
            </button>
            <h3>Shared Media</h3>
            <div className="galleryStats">
              {mediaFiles.filter((file) => file.type === "image").length} photos
            </div>
          </div>

          <div className="galleryContent">
            <div className="mediaCategories">
              <button className="categoryBtn active">All</button>
              <button className="categoryBtn">Photos</button>
              <button className="categoryBtn">Documents</button>
              <button className="categoryBtn">Links</button>
            </div>

            <div className="galleryGrid">
              {mediaFiles.map((file, index) => (
                <div
                  key={file.id}
                  className={`galleryItem ${file.type}`}
                  onClick={() =>
                    file.type === "image" && openMediaPreview(file, index)
                  }
                >
                  {file.type === "image" ? (
                    <img src={file.url} alt={file.name} />
                  ) : file.type === "file" ? (
                    <div className="filePreview">
                      <FaFileAlt className="fileIcon" />
                      <span className="fileName">{file.name}</span>
                    </div>
                  ) : (
                    <div className="linkPreview">
                      <FaLink className="linkIcon" />
                      <span className="linkName">{file.name}</span>
                    </div>
                  )}
                  <div className="mediaOverlay">
                    {file.type === "image" && (
                      <FaImages className="overlayIcon" />
                    )}
                    {file.type === "file" && (
                      <FaDownload className="overlayIcon" />
                    )}
                    {file.type === "link" && (
                      <FaExternalLinkAlt className="overlayIcon" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Media Gallery Overlay */}
      {showMediaGallery && (
        <div className="galleryOverlay" onClick={closeMediaGallery} />
      )}

      {/* Single Media Preview */}
      {selectedMedia && (
        <div className="mediaPreview">
          <div className="previewHeader">
            <button className="closeButton" onClick={closeMediaPreview}>
              <FaTimes />
            </button>
            <div className="previewTitle">{selectedMedia.name}</div>
            <div className="previewActions">
              <button className="actionBtn">
                <FaDownload />
              </button>
              <button className="actionBtn">
                <FaEllipsisH />
              </button>
            </div>
          </div>

          <div className="previewContent">
            <img src={selectedMedia.preview} alt={selectedMedia.name} />

            <button
              className="navButton prev"
              onClick={() => navigateMedia("prev")}
            >
              <FaArrowLeft />
            </button>
            <button
              className="navButton next"
              onClick={() => navigateMedia("next")}
            >
              <FaArrowRight />
            </button>
          </div>

          <div className="previewFooter">
            <div className="mediaInfo">
              <div className="mediaName">{selectedMedia.name}</div>
              <div className="mediaDate">Shared on {selectedMedia.date}</div>
            </div>
          </div>
        </div>
      )}

      {/* Media Preview Overlay */}
      {selectedMedia && (
        <div className="previewOverlay" onClick={closeMediaPreview} />
      )}
    </div>
  );
};

export default Messages;
