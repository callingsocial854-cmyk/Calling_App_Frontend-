import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./Messages.css";
import ChatList from "./ChatList";
import ChatSection from "./ChatSection";
import UserDetailsPanel from "./UserDetailsPanel";
import MediaGallery from "./MediaGallery";
import MediaPreview from "./MediaPreview";
import QRCodeModal from "./QRCodeModal";
import socket from "../../socket";
import { fetchAgentsForUserQuery } from "../../features/queryThunks";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessages,
  getMessagesByRoomId,
  sendMessageApi,
  toggleCallStatus,
} from "../../api/queryApi";
import { FaArrowLeft, FaFacebook, FaGoogle } from "react-icons/fa";


const getCurrentChatProfileId = (currentChat) =>
  currentChat?.profile?._id ||
  currentChat?.profileId ||
  currentChat?.agent?.profileId ||
  currentChat?.data?.profile?._id ||
  null;

const Messages = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [, setCurrentMediaIndex] = useState(0);
  const [showQRModal, setShowQRModal] = useState(false);
  const [callType, setCallType] = useState("");
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const { queryId } = useParams();
  const dispatch = useDispatch();
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const currentChatRef = useRef(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [callsEnabled, setCallsEnabled] = useState();
  const [mediaControlsFiles, setMediaControlsFiles] = useState([]);
  const currentProfileId = getCurrentChatProfileId(currentChat);

  const { agents } = useSelector((state) => state.agents);

  const fetchMessages = async (roomId, queryId, search = "") => {
    try {
      if (!roomId) return;

      const response = await getMessagesByRoomId(roomId, queryId, search);
      const freshMessages = response.data || [];

      setMessages(freshMessages);

      const allMediaControlsFiles = freshMessages.flatMap((msg) =>
        (msg.mediaControls || []).flatMap((mc) => mc.mediaFiles || []),
      );

      setMediaControlsFiles(allMediaControlsFiles);


    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!Array.isArray(agents) || agents.length === 0) {
      setCurrentChat(null);
      return;
    }

  }, [agents, queryId]);

  useEffect(() => {
    if (!currentChat?.roomId) return;

    fetchMessages(currentChat.roomId, queryId, messageSearchQuery);
  }, [currentChat?.roomId, messageSearchQuery, queryId]);

  useEffect(() => {

    dispatch(fetchAgentsForUserQuery({ queryId }));
  }, [dispatch, queryId]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", currentChat?.roomId);

    socket.on("messagesByRoomId", (data) => {
      console.log("messages", data);
      setMessages(data.messages);
    });

    socket.on("receiveMessage", (data) => {
      console.log("receiveMessage", data);
      const activeChat = currentChatRef.current;

      if (data?.roomId === activeChat?.roomId) {
        setMessages((prev) => [...prev, data]);

        socket.emit("markAsRead", {
          roomId: activeChat.roomId,
          readerType: "user",
        });
      }
    });

    socket.on("messagesDelivered", ({ roomId, deliveredAt }) => {
      const activeChat = currentChatRef.current;

      if (roomId === activeChat?.roomId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.status === "seen"
              ? msg
              : { ...msg, status: "delivered", deliveredAt },
          ),
        );
      }
    });

    socket.on("messageSeen", ({ roomId, seenAt, seenBy }) => {
      console.log(roomId, seenAt, seenBy);
      const activeChat = currentChatRef.current;

      if (roomId === activeChat?.roomId) {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.senderType !== seenBy && msg.status !== "seen") {
              return { ...msg, status: "seen", seenAt };
            }
            return msg;
          }),
        );
      }
    });

    socket.on("messageDeletedForEveryone", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                message: "This message was deleted",
                mediaControls: [],
                files: [],
                replyTo: null,
              }
            : msg,
        ),
      );
    });
    const handleMessageDeletedForMe = ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    socket.on("messageDeletedForMe", handleMessageDeletedForMe);

    return () => {
      socket.off("messagesByRoomId");
      socket.off("receiveMessage");
      socket.off("messagesDelivered");
      socket.off("messageSeen");
      socket.off("messageDeletedForEveryone");
      socket.off("messageDeletedForMe", handleMessageDeletedForMe);
    };
  }, [currentChat?.roomId]);

  const handleSubmit = async (formData) => {
    try {
      if (!currentChat?.roomId) return;
      if (
        !formData.msg?.trim() &&
        (!formData.files || !formData.files.length)
      ) {
        return;
      }

      const payload = {
        roomId: currentChat.roomId,
        senderType: "user",
        message: formData.msg || "",
        replyTo: formData.replyToMessageId || null,
        files: formData.files || [],
      };

      await sendMessageApi(payload);

      setReplyToMessage(null);
    } catch (error) {
      console.error("Send failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // if (isMobileMenuOpen) {
    //   setIsMobileMenuOpen(isMobileMenuOpen);
    // }
    // navigate("/dashboard");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleChatSelect = (chat) => {
    if (!chat?.roomId) return;

    if (currentChat?.roomId) {
      socket.emit("leaveRoom", currentChat.roomId);
    }

    socket.emit("joinRoom", chat.roomId);

    socket.emit("getMessagesByRoomId", {
      roomId: chat.roomId,
    });

    socket.emit("markAsRead", {
      roomId: chat.roomId,
      readerType: "user",
    });

    setMessages([]);
    setCurrentChat(chat);

    if (isMobile) closeMobileMenu();
  };

  const clearChat = async () => {
    try {
      const res = await clearMessages(currentChat?.roomId);
      console.log(res);
      setMessages([]);
      setShowChatOptions(false);
      fetchMessages(currentChat?.roomId, queryId);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleBlock = async () => {
    setIsBlocked(!isBlocked);
    setShowChatOptions(false);
  };

  const openMediaGallery = () => {
    setShowMediaGallery(true);
  };

  const closeMediaGallery = () => {
    setShowMediaGallery(false);

    setCurrentMediaIndex(0);
  };

  const openMediaPreview = (_, index) => {
    setCurrentMediaIndex(index);
  };

  

  

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

  const handleToggleCalls = async () => {
    try {
      const res = await toggleCallStatus(
        currentChat?.agent?._id,
        currentProfileId,
        currentChat?.roomId,
      );
      console.log(res);
      if (res?.data?.callStatus) {
        setCallsEnabled(res?.data?.callEnabled);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const firstLoadRef = useRef(true);

  useEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({
      behavior: firstLoadRef.current ? "auto" : "smooth",
    });
  }, [messages]);

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  const handleReplyMessage = (message) => {
    setReplyToMessage(message);
  };

  const handleCancelReply = () => {
    setReplyToMessage(null);
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
        <>
          <ChatList
            currentChat={currentChat}
            searchQuery={searchQuery}
            isMobileMenuOpen={isMobileMenuOpen}
            onSearchChange={setSearchQuery}
            onChatSelect={handleChatSelect}
          />

          <ChatSection
            currentChat={currentChat}
            messages={messages}

            isBlocked={isBlocked}
            showMessageSearch={showMessageSearch}
            messageSearchQuery={messageSearchQuery}
            showChatOptions={showChatOptions}
            messageContainerRef={messageContainerRef}
            messagesEndRef={messagesEndRef}
            onMessageSubmit={handleSubmit}
            onMessageSearchChange={setMessageSearchQuery}
            onShowMessageSearch={setShowMessageSearch}
            onShowChatOptions={setShowChatOptions}
            onShowUserDetails={setShowUserDetails}
            onVoiceCall={handleVoiceCall}
            onVideoCall={handleVideoCall}
            onClearChat={clearChat}
            onToggleBlock={toggleBlock}
            callsEnabled={callsEnabled}
            onToggleCalls={handleToggleCalls}
            handleReplyMessage={handleReplyMessage}
            replyToMessage={replyToMessage}
            handleCancelReply={handleCancelReply}
          />
        </>
      </main>

      <UserDetailsPanel
        currentChat={currentChat}
        mediaControlsFiles={mediaControlsFiles}
        showUserDetails={showUserDetails}
        isBlocked={isBlocked}
        onClose={() => setShowUserDetails(false)}
        onOpenMediaGallery={openMediaGallery}
        onClearChat={clearChat}
        onToggleBlock={toggleBlock}
        onMediaPreview={openMediaPreview}
      />

      <MediaGallery
        mediaControlsFiles={mediaControlsFiles}
        showMediaGallery={showMediaGallery}
        onClose={closeMediaGallery}
        onMediaPreview={openMediaPreview}
      />


      <QRCodeModal
        isOpen={showQRModal}
        onClose={closeQRModal}
        type={callType}
        userName={"User"}
      />
    </div>
  );
};

export default Messages;
