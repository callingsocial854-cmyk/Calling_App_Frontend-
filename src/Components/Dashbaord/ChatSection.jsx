import React, { useEffect, useRef, useState } from "react";
import {
  FaPhone,
  FaVideo,
  FaEllipsisV,
  FaSearch,
  FaTrash,
  FaBan,
  FaTimes,
  FaCheck,
  FaCheckDouble,
  FaPaperPlane,
  FaChevronLeft,
  FaChevronRight,
  FaSmile,
  FaReply,
  FaFile,
  FaImage,
  FaPaperclip,
  FaCopy,
  FaFileAlt,
} from "react-icons/fa";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FaStar } from "react-icons/fa";
import { RxHeart } from "react-icons/rx";
import { RxHeartFilled } from "react-icons/rx";
import Tooltip from "@mui/material/Tooltip";
import { FaEye } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ImageList from "@mui/material/ImageList";
import { Alert, ImageListItemBar, Snackbar, useTheme } from "@mui/material";
import ImageListItem from "@mui/material/ImageListItem";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FaImages } from "react-icons/fa";
import socket from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgentsForUserQuery,
  fetchQueryById,
  fetchAgentByIdThunk,
  toggleFavoriteStatusThunk,
} from "../../features/queryThunks";
import {
  blockedAgent,
  getAgentByIdInWeb,
  toggleCallStatus,
} from "../../api/queryApi";
import moment from "moment/moment";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import Picker from "emoji-picker-react";

const ChatSection = ({
  currentChat,
  messages,
  showMessageSearch,
  messageSearchQuery,
  showChatOptions,
  messageContainerRef,
  messagesEndRef,
  onMessageSubmit,
  onMessageSearchChange,
  onShowMessageSearch,
  onShowChatOptions,
  onShowUserDetails,
  onVoiceCall,
  onVideoCall,
  onClearChat,
  onToggleBlock,
  onToggleCalls,
  callsEnabled = true,
  handleReplyMessage,
  replyToMessage,
  handleCancelReply,
}) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const handleOptionClick = (action) => {
    action();
    onShowChatOptions(false);
  };

  const matches = useMediaQuery("(max-width:600px)");
  const { query } = useSelector((state) => state.query);

  return (
    <section className="Chat" style={{ width: matches ? "100%" : "67%" }}>
      <ChatHeader
        currentChat={currentChat}
        showChatOptions={showChatOptions}
        isBlocked={isBlocked}
        onBlockChange={setIsBlocked}
        callsEnabled={callsEnabled}
        onShowUserDetails={onShowUserDetails}
        onVoiceCall={onVoiceCall}
        onVideoCall={onVideoCall}
        onShowChatOptions={onShowChatOptions}
        onShowMessageSearch={onShowMessageSearch}
        onClearChat={onClearChat}
        onToggleBlock={onToggleBlock}
        onToggleCalls={onToggleCalls}
        onOptionClick={handleOptionClick}
        query={query}
        matches={matches}
        agentId={currentChat?.agent?._id}
        messages={messages}
      />

      {showMessageSearch && (
        <MessageSearchBar
          messageSearchQuery={messageSearchQuery}
          onMessageSearchChange={onMessageSearchChange}
          onClose={() => {
            onShowMessageSearch(false);
            onMessageSearchChange("");
          }}
        />
      )}

      <MessageContainer
        messages={messages}
        messageContainerRef={messageContainerRef}
        messagesEndRef={messagesEndRef}
        onReplyMessage={handleReplyMessage}
      />

      {isBlocked && (
        <div className="blockedWarning">
          You have blocked this agent. Unblock to send messages.
        </div>
      )}

      {query?.status === "Inactive" && !isBlocked && (
        <div className="blockedWarning">
          This conversation is inactive. You can’t send messages right now.
        </div>
      )}

      {!isBlocked && query?.status === "Active" && (
        <MessageForm
          onSubmit={onMessageSubmit}
          replyToMessage={replyToMessage}
          onCancelReply={handleCancelReply}
        />
      )}
    </section>
  );
};

const getCurrentChatProfileId = (currentChat) =>
  currentChat?.profile?._id ||
  currentChat?.profileId ||
  currentChat?.agent?.profileId ||
  currentChat?.data?.profile?._id ||
  null;

const ChatHeader = ({
  currentChat,
  showChatOptions,
  onBlockChange,
  callsEnabled,
  onShowUserDetails,
  onVoiceCall,
  onShowChatOptions,
  onShowMessageSearch,
  onClearChat,
  onOptionClick,
  matches,
  agentId,
  messages,
}) => {
  const optionsRef = useRef(null);
  const [queryView, setQueryView] = useState(false);
  const [agentImagesModel, setAgentImagesModel] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { queryId } = useParams();
  const file_url = import.meta.env.VITE_FILE_URL;
  const dispatch = useDispatch();
  const [agentData, setAgentData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openPreview, setOpenPreview] = useState(false);
  const currentProfileId = getCurrentChatProfileId(currentChat);
  const fetchAgentDetails = async (agentId, currentChat, queryId) => {
    try {
      const profileId = getCurrentChatProfileId(currentChat);
      const res = await getAgentByIdInWeb(agentId, profileId, queryId);
      const profile = res?.data?.profile || {};
      const agent = res?.data?.agent || {};
      console.log(messages)

      setAgentData((prev) => ({
        ...prev,
        ...agent,
        ...profile,
        isOnline: profile?.isOnline,
        lastSeen: profile?.lastSeen,
      }));



      onBlockChange(agent?.isBlocked);
    } catch (error) {
      setAgentData(null);
      console.log(error);
    }
  };

  const handleToggleCalls = async () => {
    try {
      await toggleCallStatus(
        agentId,
        currentProfileId,
        currentChat?.roomId,
      );

      fetchAgentDetails(agentId, currentChat, queryId);
      onOptionClick(() => {});
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockAgent = async () => {
    try {
      const res = await blockedAgent(
        agentId,
        currentProfileId,
        currentChat?.roomId,
      );
      const blocked = res?.data?.blocked;
      onBlockChange(blocked);
      fetchAgentDetails(agentId, currentChat, queryId);
      onOptionClick(() => {});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket || !agentId) return;

    socket.emit("getAgentById", { agentId, profileId: currentProfileId });

    const handleAgentById = (res) => {
      const data = res?.data?.profile;
      setAgentData((prev) => ({
        ...(prev || {}),
        isOnline: data?.isOnline,
        lastSeen: data?.lastSeen,
      }));
    };

    socket.on("agentById", handleAgentById);

    fetchAgentDetails(agentId, currentChat, queryId);

    return () => {
      socket.off("agentById", handleAgentById);
    };
  }, [currentChat, agentId, queryId, currentProfileId]);

  useEffect(() => {
    dispatch(fetchQueryById(queryId));
    if (agentId) {
      dispatch(fetchAgentByIdThunk({ agentId, profileId: currentProfileId }));
    }
  }, [dispatch, currentChat, agentId, queryId, currentProfileId]);

  const agentDetails = useSelector((state) => state.agentData);

  useEffect(() => {
    console.log("Agent Details Updated:", agentDetails);
  }, []);


  const { query } = useSelector((state) => state.query);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        onShowChatOptions(false);
      }
    };

    if (showChatOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatOptions, onShowChatOptions]);

  const handleVoiceCall = () => {
    if (callsEnabled) {
      onVoiceCall();
    }
  };

  const toggleFavorite = async (agentId) => {
    await dispatch(
      toggleFavoriteStatusThunk({ agentId, profileId: currentProfileId }),
    );
    await dispatch(
      fetchAgentsForUserQuery({ queryId: query?._id, type: "all" }),
    );
    await fetchAgentDetails(agentId, currentChat, queryId);
    dispatch(fetchAgentByIdThunk({ agentId, profileId: currentProfileId }));
  };

  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = ({ agentId, status, lastSeen }) => {
      if (agentId === agentData?._id) {
        setAgentData((prev) => ({
          ...prev,
          isOnline: status === "online",
          lastSeen,
        }));
      }
    };

    socket.on("agentStatusUpdate", handleStatusUpdate);

    return () => {
      socket.off("agentStatusUpdate", handleStatusUpdate);
    };
  }, [agentData?._id]);

  const itemData = messages
    .filter(
      (message) =>
        Array.isArray(message.mediaControls) &&
        message.mediaControls.length > 0,
    )
    .flatMap((message) => message.mediaControls)
    .flatMap((mediaControl) =>
      (mediaControl.mediaFiles || []).map((mediaFile) => ({
        img: `${file_url}${mediaFile.file}`,
        title: `Media File ${mediaFile.position}`,
        position: mediaFile.position,
        id: mediaFile._id,
        controlId: mediaControl._id,
        controlTitle: mediaControl.title,
        controlLocation: mediaControl.location,
        createdAt: mediaControl.createdAt,
      })),
    );

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setOpenPreview(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === itemData.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? itemData.length - 1 : prev - 1));
  };

  const getAllMediaFiles = () => {
    return messages
      .filter(
        (m) => Array.isArray(m.mediaControls) && m.mediaControls.length > 0,
      )
      .flatMap((m) => m.mediaControls)
      .flatMap((mc) =>
        (mc.mediaFiles || []).map((mediaFile) => ({
          img: `${file_url}${mediaFile.file}`,
          title: `Media File ${mediaFile.position}`,
          position: mediaFile.position,
          id: mediaFile._id,
          controlTitle: mc.title,
          controlLocation: mc.location,
        })),
      );
  };

  const getGlobalIndex = (mediaControl, mediaFile) => {
    const allFiles = getAllMediaFiles();
    const fileIndex = allFiles.findIndex((file) => file.id === mediaFile._id);
    return fileIndex;
  };

  const getFileType = (file) => {
    const ext = file.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
    if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    if (["pdf"].includes(ext)) return "pdf";

    return "file";
  };

  return (
    <div
      className="ChatHead"
      style={{
        display: !agentData ? "none" : "flex",
      }}
    >
      {!agentData ? null : (
        <>
          <div className="chatUser">
            <div
              className="avatarContainer"
              onClick={() => onShowUserDetails(true)}
              style={{ cursor: "pointer" }}
            >
              <div className="avatar">
                <img
                  src={`${file_url}${agentData?.profileImage}`}
                  alt={agentData?.fullName || "Agent"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
                  }}
                />
              </div>

              <div
                className={`statusDot ${agentData?.isOnline ? "online" : "offline"}`}
              ></div>
            </div>
            <div className="userInfo">
              <p
                className="GroupName"
                style={{ cursor: "pointer" }}
                onClick={() => onShowUserDetails(true)}
              >
                {agentData?.profileName}{" "}
                <FaStar style={{ color: "#f4b400", fontSize: "15px" }} />
                <span
                  style={{
                    marginLeft: "4px",
                    color: "#333",
                    fontSize: "10px",
                  }}
                >
                  {agentData?.avgRating}
                </span>{" "}
              </p>

              <span
                className={`userStatus ${agentData?.isOnline ? "online" : "offline"}`}
              >
                {agentData?.isOnline && "Online"}

                {!agentData?.isOnline && agentData?.lastSeen && (
                  <>Last seen {moment(agentData.lastSeen).fromNow()}</>
                )}
              </span>
            </div>
            <Tooltip
              title={
                agentData?.isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              placement="top"
              arrow
            >
              <span
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                onClick={() => {
                  toggleFavorite(agentDetails?.data?.agent?._id, queryId);
                }}
              >
                {agentData?.isFavorite ? (
                  <RxHeartFilled
                    style={{ color: "#ff4d4f", fontSize: "32px" }}
                  />
                ) : (
                  <RxHeart style={{ color: "#ff4d4f", fontSize: "32px" }} />
                )}
              </span>
            </Tooltip>
          </div>

          <div className="callGroup" ref={optionsRef}>
            {matches && (
              <button
                className={`iconBtn`}
                onClick={() => {
                  setQueryView(true);
                }}
                title={"query view"}
              >
                <FaEye />
              </button>
            )}

            <button
              className={`iconBtn`}
              onClick={handleVoiceCall}
              title={"Voice Call"}
            >
              <FaPhone />
            </button>

            <div className="chatOptions">
              <button
                className="iconBtn"
                onClick={() => onShowChatOptions(!showChatOptions)}
              >
                <FaEllipsisV />
              </button>

              {showChatOptions && (
                <div className="chatOptionsMenu">
                  <button
                    onClick={() =>
                      onOptionClick(() => onShowMessageSearch(true))
                    }
                  >
                    <FaSearch /> Search Messages
                  </button>
                  <button onClick={() => handleToggleCalls()}>
                    <FaPhone />{" "}
                    {agentData?.isCallDisabled
                      ? "Enable Calls"
                      : "Disable Calls"}
                  </button>
                  <button onClick={() => onOptionClick(onClearChat)}>
                    <FaTrash /> Clear Chat
                  </button>
                  <button onClick={() => handleBlockAgent()}>
                    <FaBan /> {agentData?.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button onClick={() => setAgentImagesModel(true)}>
                    <FaImages /> Chat Photos
                  </button>
                </div>
              )}
            </div>
          </div>

          <Dialog
            open={queryView}
            onClose={() => setQueryView(false)}
            className="beautiful-dialog"
            scroll="paper"
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle sx={{ fontSize: "16px" }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>Your Query</Grid>
                <Grid size={3} sx={{ width: "fit-content" }}>
                  Active {query?.startTime} to {query?.endTime}
                </Grid>
              </Grid>
            </DialogTitle>

            <IconButton
              aria-label="close"
              onClick={() => setQueryView(false)}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 12,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>

            <DialogContent
              dividers
              sx={{
                maxHeight: { xs: "70vh", sm: "75vh" },
                overflowY: "auto",
                paddingBottom: "20px",
              }}
            >
              {/* ===== Main Query Info ===== */}
              <div style={{ marginBottom: "10px" }}>
                <p style={{ margin: 0, fontWeight: "500" }}>
                  {query?.description}
                </p>
                <small style={{ color: "gray" }}>10/14/2025, 10:59:01 AM</small>
              </div>

              <hr style={{ margin: "15px 0", borderColor: "#eee" }} />

              {/* ===== Comments Section ===== */}
              <div>
                {query?.comments.length === 0 ? (
                  <p style={{ color: "gray" }}>No comments yet.</p>
                ) : (
                  query?.comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        borderRadius: "8px",
                        marginBottom: "10px",
                        background: "#f9f9f9",
                        padding: "8px",
                      }}
                    >
                      <p style={{ margin: "0 0 4px 0" }}>{comment.text}</p>
                      <small style={{ color: "gray" }}>{comment.date}</small>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={agentImagesModel}
            onClose={() => setAgentImagesModel(false)}
            className="beautiful-dialog"
            fullWidth
            maxWidth="md"
          >
            <DialogTitle sx={{ fontSize: "16px" }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>All Agent Images</Grid>
              </Grid>
            </DialogTitle>

            <IconButton
              aria-label="close"
              onClick={() => setAgentImagesModel(false)}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>

            <DialogContent>
              {messages.filter(
                (message) =>
                  message.mediaControls && message.mediaControls.length > 0,
              ).length > 0 ? (
                <Box sx={{ width: "100%" }}>
                  {messages
                    .filter(
                      (message) =>
                        message.mediaControls &&
                        message.mediaControls.length > 0,
                    )
                    .flatMap((message) => message.mediaControls)
                    .map((mediaControl) => (
                      <Box key={mediaControl._id} sx={{ mb: 4 }}>
                        {/* Media Control Header */}
                        <Box
                          sx={{
                            mb: 2,
                            borderBottom: "1px solid #e0e0e0",
                            pb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{ fontSize: "18px", fontWeight: "bold" }}
                          >
                            {mediaControl.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Location: {mediaControl.location}
                          </Typography>
                        </Box>

                        {/* Images Grid */}
                        {mediaControl.mediaFiles &&
                        mediaControl.mediaFiles.length > 0 ? (
                          <ImageList
                            sx={{
                              width: "100%",
                              height: "auto",
                            }}
                            cols={fullScreen ? 2 : isMd ? 3 : 4}
                            rowHeight={fullScreen ? 120 : isMd ? 150 : 164}
                          >
                            {mediaControl.mediaFiles.map((mediaFile) => {
                              const globalIndex = getGlobalIndex(
                                mediaControl,
                                mediaFile,
                              );

                              const type = getFileType(mediaFile.file);

                              return (
                                <ImageListItem
                                  key={mediaFile._id}
                                  sx={{ cursor: "pointer" }}
                                >
                                  {type === "image" && (
                                    <img
                                      src={`${file_url}${mediaFile.file}`}
                                      alt="media"
                                      loading="lazy"
                                      style={{
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                      }}
                                      onClick={() =>
                                        handleImageClick(globalIndex)
                                      }
                                    />
                                  )}

                                  {type === "video" && (
                                    <video
                                      src={`${file_url}${mediaFile.file}`}
                                      controls
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                      onClick={() =>
                                        handleImageClick(globalIndex)
                                      }
                                    />
                                  )}

                                  {type === "pdf" && (
                                    <Box
                                      sx={{
                                        height: 160,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        border: "1px solid #ddd",
                                        borderRadius: 2,
                                        background: "#f9f9f9",
                                      }}
                                      onClick={() =>
                                        window.open(
                                          `${file_url}${mediaFile.file}`,
                                          "_blank",
                                        )
                                      }
                                    >
                                      <FaFileAlt size={40} />
                                      <Typography variant="body2" mt={1}>
                                        View PDF
                                      </Typography>
                                    </Box>
                                  )}

                                  {type === "file" && (
                                    <Box
                                      sx={{
                                        height: 160,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        border: "1px solid #ddd",
                                        borderRadius: 2,
                                      }}
                                    >
                                      <FaDownload size={32} />
                                    </Box>
                                  )}

                                  <ImageListItemBar position="bottom" />
                                </ImageListItem>
                              );
                            })}
                          </ImageList>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: "center", py: 4 }}
                          >
                            No media files found
                          </Typography>
                        )}
                      </Box>
                    ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 200,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No media files found
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openPreview}
            onClose={() => setOpenPreview(false)}
            fullScreen
            PaperProps={{
              sx: {
                backgroundColor: "rgba(0,0,0,0.9)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          >
            {/* Close Button */}
            <IconButton
              aria-label="close"
              onClick={() => setOpenPreview(false)}
              sx={{
                position: "absolute",
                right: 25,
                top: 25,
                color: "#fff",
                zIndex: 2,
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Prev Button */}
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 25,
                color: "#fff",
                zIndex: 2,
                backgroundColor: "rgba(0,0,0,0.4)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
              }}
            >
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>

            {/* Next Button */}
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 80,
                color: "#fff",
                zIndex: 2,
                backgroundColor: "rgba(0,0,0,0.4)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>

            {/* Image Info Bar */}
            {itemData.length > 0 && currentIndex < itemData.length && (
              <Box
                sx={{
                  position: "absolute",
                  top: 25,
                  left: 25,
                  color: "#fff",
                  zIndex: 2,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  maxWidth: "300px",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {itemData[currentIndex].controlTitle}
                </Typography>
                <Typography variant="body2">
                  Location: {itemData[currentIndex].controlLocation}
                </Typography>
                <Typography variant="caption">
                  Position: {itemData[currentIndex].position}
                </Typography>
              </Box>
            )}

            <DialogContent
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
                overflow: "hidden",
              }}
            >
              {itemData.length > 0 &&
                currentIndex < itemData.length &&
                (() => {
                  const currentItem = itemData[currentIndex];
                  const type = getFileType(currentItem.img);

                  if (type === "image") {
                    return (
                      <img
                        src={currentItem.img}
                        alt={currentItem.title}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "85vh",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://png.pngtree.com/element_our/20190528/ourmid/pngtree-no-photo-icon-image_1128432.jpg";
                        }}
                      />
                    );
                  }

                  if (type === "video") {
                    return (
                      <video
                        src={currentItem.img}
                        controls
                        autoPlay
                        style={{
                          maxWidth: "100%",
                          maxHeight: "85vh",
                        }}
                      />
                    );
                  }

                  if (type === "pdf") {
                    return (
                      <iframe
                        src={currentItem.img}
                        title="PDF Preview"
                        style={{
                          width: "90vw",
                          height: "85vh",
                          border: "none",
                          background: "#fff",
                        }}
                      />
                    );
                  }

                  return (
                    <Box sx={{ color: "#fff", textAlign: "center" }}>
                      <FaFileAlt size={60} />
                      <Typography mt={2}>Preview not available</Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => window.open(currentItem.img, "_blank")}
                      >
                        Download File
                      </Button>
                    </Box>
                  );
                })()}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

const MessageSearchBar = ({
  messageSearchQuery,
  onMessageSearchChange,
  onClose,
}) => (
  <div className="messageSearchBar">
    <FaSearch className="icon" />
    <input
      type="text"
      placeholder="Search in conversation..."
      value={messageSearchQuery}
      onChange={(e) => onMessageSearchChange(e.target.value)}
      className="messageSearchInput"
    />
    <button className="closeSearch" onClick={onClose}>
      <FaTimes />
    </button>
  </div>
);

const MessageContainer = ({
  messages,
  messageContainerRef,
  messagesEndRef,
  onReplyMessage,
}) => {
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    message: null,
    senderType: null,
  });
  const [openFilesModal, setOpenFilesModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const firstLoadRef = useRef(true);
  const lastMessageCountRef = useRef(0);
  const file_url = import.meta.env.VITE_FILE_URL;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const visibleMessages = Array.from(
    new Map(
      messages
        .filter((m) => {
          if (m.isDeletedByUser) return false;
          if (m.systemMsgForAgent && !m.message && !m.systemMsgForUser) {
            return false;
          }
          return true;
        })
        .map((m) => [m._id, m]),
    ).values(),
  );

  useEffect(() => {
    if (loading) return;
    const currentCount = visibleMessages.length;
    if (firstLoadRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      firstLoadRef.current = false;
      lastMessageCountRef.current = currentCount;
      return;
    }
    if (currentCount > lastMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    lastMessageCountRef.current = currentCount;
  }, [visibleMessages, loading]);

  const handleContextMenu = (e, msg) => {
    e.preventDefault();
    e.stopPropagation();

    const scrollTop = messageContainerRef.current?.scrollTop;

    if (msg.senderType === "system") return;

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      message: msg,
      senderType: msg?.senderType,
    });

    requestAnimationFrame(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = scrollTop;
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, message: null });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleReply = () => {
    if (contextMenu.message && onReplyMessage) {
      onReplyMessage(contextMenu.message);
    }
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

  const handleCopyMessage = async () => {
    if (contextMenu.message) {
      const textToCopy =
        contextMenu.message.message ||
        contextMenu.message.systemMsgForUser ||
        "";
      try {
        await navigator.clipboard.writeText(textToCopy);
        setShowCopyFeedback(true);
        setTimeout(() => setShowCopyFeedback(false), 1500);
        console.log("Message copied to clipboard:", textToCopy);
      } catch (err) {
        console.error("Failed to copy message:", err);
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setShowCopyFeedback(true);
        setTimeout(() => setShowCopyFeedback(false), 1500);
      }
    }
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

  const openImageModal = (mediaFiles, startIndex = 0) => {
    setSelectedImages(mediaFiles);
    setCurrentImageIndex(startIndex);
    setOpenModal(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : selectedImages.length - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < selectedImages.length - 1 ? prev + 1 : 0,
    );
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);

    if (messageContainerRef.current) {
      const container = messageContainerRef.current;
      const currentScrollTop = container.scrollTop;
      setTimeout(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = currentScrollTop;
        }
      }, 10);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!openModal) return;
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "Escape") handleCloseModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openModal]);

  if (loading) {
    return (
      <div className="MessageContainer loaderContainer">
        <div className="chatLoader">Loading messages...</div>
      </div>
    );
  }

  if (!loading && visibleMessages.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "#f8f9fa",
          color: "#666",
          fontSize: "18px",
          fontWeight: "500",
        }}
      >
        <p>No messages yet</p>
      </div>
    );
  }

  const openFilesDialog = (files, index = 0) => {
    setSelectedFiles(files);
    setActiveFileIndex(index);
    setOpenFilesModal(true);
  };

  const closeFilesDialog = () => {
    setOpenFilesModal(false);
    setSelectedFiles([]);
  };

  const scrollToMessage = (messageId) => {
    if (!messageContainerRef?.current) return;
    const container = messageContainerRef.current;
    const messageElement = container.querySelector(
      `[data-message-id="${messageId}"]`,
    );
    if (messageElement) {
      const prevHighlighted = container.querySelector(
        ".highlight-replied-message",
      );
      if (prevHighlighted) {
        prevHighlighted.classList.remove("highlight-replied-message");
      }
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      messageElement.classList.add("highlight-replied-message");
      setTimeout(() => {
        messageElement.classList.remove("highlight-replied-message");
      }, 3000);
      messageElement.classList.add("pulse");
      setTimeout(() => {
        messageElement.classList.remove("pulse");
      }, 3000);
    }
  };

  const openDeleteOptions = (message) => {
    setMessageToDelete(message);
    setDeleteMessageId(message._id);
    setShowDeleteOptions(true);
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      message: null,
      senderType: null,
    });
  };

  const handleDeleteMessage = (messageId, deleteType) => {
    console.log(messageId, deleteType);
    if (!socket) {
      console.log("Socket not connected");
      return;
    }
    socket.emit("deleteMessage", {
      messageId,
      deleteType,
    });
    setShowDeleteOptions(false);
    setDeleteMessageId(null);
  };

  return (
    <>
      <div className="MessageContainer" ref={messageContainerRef}>
        {visibleMessages.map((msg, index) => {
          const showDateSeparator =
            index === 0 ||
            new Date(msg.createdAt).toDateString() !==
              new Date(visibleMessages[index - 1].createdAt).toDateString();

          const hasMedia = msg.mediaControls && msg.mediaControls.length > 0;
          const hasFiles = msg.files?.length > 0;

          const allMediaFiles = hasMedia
            ? msg.mediaControls.flatMap((mc) => mc.mediaFiles)
            : [];

          return (
            <React.Fragment key={msg._id}>
              {showDateSeparator && (
                <div className="messageSeperator">
                  {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              )}

              <div
                className={`message ${msg.senderType} ${hasMedia ? "has-media" : ""}`}
                onContextMenu={(e) => handleContextMenu(e, msg)}
                style={{ cursor: "context-menu" }}
                data-message-id={msg._id}
              >
                {/* Show reply preview if message is a reply */}
                {msg.replyTo &&
                  (() => {
                    const reply = msg.replyTo;
                    const replyId = reply._id;

                    const replyFile = reply.files?.length
                      ? `${import.meta.env.VITE_FILE_URL}${reply.files[0]}`
                      : null;

                    const mediaControlFile = reply.mediaControls?.[0]
                      ?.mediaFiles?.[0]?.file
                      ? `${import.meta.env.VITE_FILE_URL}${reply.mediaControls[0].mediaFiles[0].file}`
                      : null;

                    const previewFile = replyFile || mediaControlFile;

                    const isImage = previewFile?.match(
                      /\.(jpg|jpeg|png|gif|webp|svg)$/i,
                    );
                    const isVideo = previewFile?.match(
                      /\.(mp4|mov|avi|mkv|webm)$/i,
                    );

                    return (
                      <div
                        className="reply-preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (replyId) {
                            scrollToMessage(replyId);
                          }
                        }}
                        style={{
                          cursor: "pointer",
                          position: "relative",
                        }}
                        title="Click to view original message"
                      >
                        <div className="reply-preview-content">
                          <div className="reply-preview-sender">
                            {reply.senderType === "user" ? "You" : "Them"}
                          </div>

                          {previewFile ? (
                            <div className="reply-preview-media">
                              {isImage ? (
                                <img
                                  src={previewFile}
                                  alt="reply media"
                                  className="reply-preview-thumb"
                                />
                              ) : isVideo ? (
                                <div className="reply-preview-video">
                                  🎥 Video
                                </div>
                              ) : (
                                <div className="reply-preview-file">
                                  📄 File
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="reply-preview-text">
                              {reply.message?.substring(0, 50)}
                              {reply.message?.length > 50 && "..."}
                            </div>
                          )}
                        </div>

                        <div className="reply-indicator">
                          <FaReply size={12} />
                        </div>
                      </div>
                    );
                  })()}

                {msg.senderType === "system" && (
                  <div style={{ display: "flex", }}>
                    {msg.systemMsgForUser === "App not download" ? (
                      <div
                        style={{
                          background: "#ffffff",
                          border: "0.5px solid #e5e7eb",
                          borderRadius: "12px",
                          padding: "16px 20px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        {/* Header */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: "#fef3c7",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              fontSize: "15px",
                            }}
                          >
                            📞
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                margin: 0,
                                color: "#111827",
                              }}
                            >
                              Incoming Call
                            </p>
                            <p
                              style={{
                                fontSize: "11px",
                                color: "#6b7280",
                                margin: 0,
                              }}
                            >
                              An agent is trying to reach you
                            </p>
                          </div>
                        </div>

                        {/* Info Banner */}
                        <div
                          style={{
                            background: "#fffbeb",
                            border: "0.5px solid #fcd34d",
                            borderRadius: "8px",
                            padding: "9px 12px",
                            marginBottom: "12px",
                            fontSize: "12px",
                            color: "#92400e",
                            lineHeight: "1.6",
                          }}
                        >
                          To answer this call, please install the app on your
                          device.
                        </div>

                        {/* Buttons */}
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "12px",
                          }}
                        >
                          {[
                            {
                              href: "https://play.google.com/store/apps/details?id=YOUR_APP_ID",
                              label: "Play Store",
                              icon: "▶",
                            },
                            {
                              href: "https://apps.apple.com/app/idYOUR_APP_ID",
                              label: "App Store",
                              icon: "",
                            },
                          ].map(({ href, label, icon }) => (
                            <a
                              key={label}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                padding: "9px 12px",
                                background: "#f9fafb",
                                border: "0.5px solid #d1d5db",
                                borderRadius: "8px",
                                textDecoration: "none",
                                color: "#111827",
                                fontSize: "12px",
                                fontWeight: "500",
                              }}
                            >
                              <span style={{ fontSize: "13px" }}>{icon}</span>{" "}
                              {label}
                            </a>
                          ))}
                        </div>

                        {/* QR Code */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "12px",
                            background: "#f9fafb",
                            borderRadius: "8px",
                            border: "0.5px solid #e5e7eb",
                          }}
                        >
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://yourapp.com/download&margin=4"
                            alt="Download QR"
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "6px",
                              display: "block",
                            }}
                          />
                          <p
                            style={{
                              fontSize: "11px",
                              color: "#6b7280",
                              margin: "6px 0 0",
                            }}
                          >
                            Scan to download
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="messageContent system-message">
                        {msg.systemMsgForUser || msg.message}
                      </div>
                    )}
                  </div>
                )}

                {msg.senderType !== "system" && (
                  <p className="messageContent">
                    {msg.message || msg.systemMsgForUser}
                  </p>
                )}

                {hasMedia && (
                  <div className="media-container">
                    {msg.mediaControls.map((mediaControl, mediaIndex) => {
                      const totalFiles = mediaControl?.mediaFiles?.length;
                      const displayFiles = mediaControl?.mediaFiles?.slice(
                        0,
                        4,
                      );
                      const hasMoreFiles = totalFiles > 4;
                      const globalStartIndex = msg?.mediaControls
                        .slice(0, mediaIndex)
                        .reduce((acc, mc) => acc + mc.mediaFiles.length, 0);

                      return (
                        <div key={mediaControl?._id} className="media-control">
                          {mediaControl?.title && (
                            <div className="media-title">
                              {mediaControl?.title}
                            </div>
                          )}

                          {mediaControl?.location && (
                            <div className="media-location">
                              📍 {mediaControl?.location}
                            </div>
                          )}

                          <div className="media-files-grid">
                            {displayFiles?.map((mediaFile, fileIndex) => {
                              const isImage = mediaFile?.file?.match(
                                /\.(jpg|jpeg|png|gif|webp)$/i,
                              );
                              const isVideo =
                                mediaFile?.file.match(/\.(mp4|avi|mov|mkv)$/i);

                              const globalIndex = globalStartIndex + fileIndex;

                              return (
                                <div
                                  key={mediaFile?._id}
                                  className="media-file-item"
                                  onClick={() => {
                                    if (isImage) {
                                      openImageModal(
                                        allMediaFiles,
                                        globalIndex,
                                      );
                                    } else if (isVideo) {
                                      window.open(
                                        `${file_url}${mediaFile?.file}`,
                                        "_blank",
                                      );
                                    }
                                  }}
                                  style={{ position: "relative" }}
                                >
                                  {isImage ? (
                                    <>
                                      <img
                                        src={`${file_url}${mediaFile.file}`}
                                        alt={`Image ${fileIndex + 1}`}
                                        className="media-preview"
                                        loading="lazy"
                                        style={{
                                          background: "#f1f1f1",
                                          cursor: "pointer",
                                        }}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src =
                                            "https://dummyimage.com/400x300/eeeeee/999999&text=No+Image";
                                        }}
                                      />
                                      <div className="image-overlay">
                                        <span className="zoom-icon">🔍</span>
                                      </div>

                                      {hasMoreFiles && fileIndex === 3 && (
                                        <div
                                          className="more-files-overlay"
                                          style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.7)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: "24px",
                                            fontWeight: "bold",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openImageModal(
                                              allMediaFiles,
                                              globalStartIndex + 4,
                                            );
                                          }}
                                        >
                                          +{totalFiles - 4}
                                        </div>
                                      )}
                                    </>
                                  ) : isVideo ? (
                                    <div className="video-preview">
                                      <video className="media-preview">
                                        <source
                                          src={`${file_url}${mediaFile.file}`}
                                          type="video/mp4"
                                        />
                                      </video>
                                      <div className="video-overlay">
                                        <div className="play-icon">▶</div>
                                        <div className="video-label">Video</div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="file-preview">
                                      📄 {mediaFile.file.split("-").pop()}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {/* Alternative: Show count badge at the end */}
                            {hasMoreFiles && displayFiles.length < 4 && (
                              <div
                                className="more-files-badge"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  color: "white",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  padding: "10px",
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                }}
                                onClick={() =>
                                  openImageModal(
                                    allMediaFiles,
                                    globalStartIndex + displayFiles.length,
                                  )
                                }
                              >
                                +{totalFiles - displayFiles.length} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {hasFiles && (
                  <div className="files-preview">
                    <div className="files-grid">
                      {msg.files.slice(0, 4).map((file, idx) => {
                        const isImage = file.match(
                          /\.(jpg|jpeg|png|gif|webp)$/i,
                        );
                        const isVideo = file.match(/\.(mp4|avi|mov|mkv)$/i);
                        const extension = file.split(".").pop().toLowerCase();

                        return (
                          <div
                            key={idx}
                            className="file-item"
                            onClick={() => openFilesDialog(msg.files, idx)}
                            style={{ cursor: "pointer" }}
                          >
                            {isImage ? (
                              <img
                                src={`${file_url}${file}`}
                                alt=""
                                className="grid-img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML = `
                    <div class="file-placeholder">
                      <div class="placeholder-icon">📷</div>
                      <div class="placeholder-ext">${extension}</div>
                    </div>
                  `;
                                }}
                              />
                            ) : isVideo ? (
                              <div className="video-thumb">
                                <div className="video-play-icon">▶</div>
                                <div className="video-type">MP4</div>
                              </div>
                            ) : (
                              <div className="doc-thumb">
                                <div className="doc-icon">📄</div>
                                <div className="doc-type">${extension}</div>
                              </div>
                            )}

                            {/* More overlay for last item when more than 4 files */}
                            {msg.files.length > 4 && idx === 3 && (
                              <div className="more-overlay">
                                <div className="more-count">
                                  +{msg.files.length - 4}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="messageDetails">
                  <span className="messageTime">
                    {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>

                  {msg.senderType === "user" && msg.seenAt && (
                    <span
                      className="seen-time"
                      style={{
                        fontSize: "11px",
                        color: "#34b7f1",
                        marginLeft: "4px",
                        fontStyle: "italic",
                      }}
                      title={`Seen at ${new Date(msg.seenAt).toLocaleString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )}`}
                    >
                      • Seen
                    </span>
                  )}

                  {msg.senderType === "user" &&
                    msg.message !== "This message was deleted" && (
                      <>
                        {msg.status === "sent" && (
                          <FaCheck
                            className="readReceipt"
                            style={{ color: "#8696a0" }}
                          />
                        )}

                        {msg.status === "delivered" && (
                          <FaCheckDouble
                            className="readReceipt"
                            style={{ color: "#8696a0" }}
                          />
                        )}

                        {msg.status === "seen" && (
                          <FaCheckDouble
                            className="readReceipt"
                            style={{ color: "#34b7f1" }}
                          />
                        )}
                      </>
                    )}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {showCopyFeedback && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#615dfa",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500",
            animation: "fadeInOut 1.5s ease-in-out",
          }}
        >
          <FaCheck style={{ fontSize: "16px" }} />
          Message copied to clipboard
        </div>
      )}

      {contextMenu.visible &&
        contextMenu.message?.message !== "This message was deleted" && (
          <div
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              zIndex: 10000,
              minWidth: "120px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#06CF9C",
                fontSize: "14px",
              }}
              onClick={handleReply}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FaReply size={14} />
              Reply
            </div>

            <div
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#666",
                fontSize: "14px",
                transition: "background-color 0.2s",
              }}
              onClick={handleCopyMessage}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f8f9fa")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FaCopy size={14} style={{ color: "#666" }} />
              <span>Copy Message</span>
            </div>

            <div
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ff4444",
                fontSize: "14px",
                transition: "background-color 0.2s",
                borderTop: "1px solid #eee",
              }}
              onClick={() => {
                if (contextMenu.message) {
                  openDeleteOptions(contextMenu.message);
                }
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FaTrash size={14} />
              Delete
            </div>
          </div>
        )}

      {showDeleteOptions && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
          }}
          onClick={() => setShowDeleteOptions(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "320px",
              maxWidth: "90%",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
              Delete Message
            </h3>
            <p
              style={{ margin: "0 0 24px 0", color: "#666", fontSize: "14px" }}
            >
              How would you like to delete this message?
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* Delete for Me */}
              <button
                onClick={() => handleDeleteMessage(deleteMessageId, "me")}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  color: "#333",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.backgroundColor = "#e9ecef";
                  e.currentTarget.borderColor = "#ccc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.backgroundColor = "#f8f9fa";
                  e.currentTarget.borderColor = "#ddd";
                }}
              >
                <div style={{ fontWeight: "500" }}>Delete for Me</div>
              </button>

              {messageToDelete?.senderType === "user" && (
                <button
                  onClick={() =>
                    handleDeleteMessage(deleteMessageId, "everyone")
                  }
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#fff5f5",
                    border: "1px solid #ffb3b3",
                    borderRadius: "8px",
                    color: "#d32f2f",
                    fontSize: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.backgroundColor = "#ffeaea";
                    e.currentTarget.borderColor = "#ff9999";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.backgroundColor = "#fff5f5";
                    e.currentTarget.borderColor = "#ffb3b3";
                  }}
                >
                  <div style={{ fontWeight: "500" }}>Delete for Everyone</div>
                </button>
              )}

              {/* Cancel Button */}
              <button
                onClick={() => setShowDeleteOptions(false)}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "transparent",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  color: "#666",
                  fontSize: "14px",
                  cursor: "pointer",
                  marginTop: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.backgroundColor = "#f8f9fa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.backgroundColor = "transparent";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullScreen
        PaperProps={{
          style: {
            background: "#fff",
            overflow: "hidden",
          },
        }}
      >
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              height: "64px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              borderBottom: "1px solid #ddd",
              background: "#fff",
            }}
          >
            <div>Media Control Images</div>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* MEDIA VIEW */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f5f6fa",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {selectedImages.length > 0 &&
              (() => {
                const current = selectedImages[currentImageIndex];
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                  current.file,
                );
                const isVideo = /\.(mp4|avi|mov|mkv|webm)$/i.test(current.file);
                const isPDF = /\.pdf$/i.test(current.file);

                if (isImage)
                  return (
                    <img
                      src={`${file_url}${current.file}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  );

                if (isVideo)
                  return (
                    <video
                      controls
                      autoPlay
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    >
                      <source src={`${file_url}${current.file}`} />
                    </video>
                  );

                if (isPDF)
                  return (
                    <a
                      href={`${file_url}${current.file}`}
                      target="_blank"
                      style={{
                        padding: "16px 26px",
                        background: "#615dfa",
                        color: "#fff",
                        borderRadius: "8px",
                        textDecoration: "none",
                      }}
                    >
                      Open PDF
                    </a>
                  );

                return (
                  <a
                    href={`${file_url}${current.file}`}
                    target="_blank"
                    style={{
                      padding: "16px 26px",
                      background: "#615dfa",
                      color: "#fff",
                      borderRadius: "8px",
                      textDecoration: "none",
                    }}
                  >
                    Download File
                  </a>
                );
              })()}

            {/* NAV */}
            <IconButton
              onClick={handlePrevImage}
              style={{ position: "absolute", left: 20 }}
            >
              <ArrowBackIosIcon />
            </IconButton>

            <IconButton
              onClick={handleNextImage}
              style={{ position: "absolute", right: 20 }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>

          {/* THUMBNAILS */}
          {selectedImages.length > 1 && (
            <div
              style={{
                height: "110px",
                flexShrink: 0,
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
                overflowX: "auto",
                borderTop: "1px solid #ddd",
                background: "#fff",
                padding: "10px",
              }}
            >
              {selectedImages.map((m, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  style={{
                    width: 80,
                    height: 80,
                    border:
                      i === currentImageIndex
                        ? "3px solid #615dfa"
                        : "2px solid #ccc",
                    borderRadius: 6,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  {/\.(jpg|jpeg|png|gif|webp)$/i.test(m.file) ? (
                    <img
                      src={`${file_url}${m.file}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "#615dfa",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                      }}
                    >
                      FILE
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Dialog>

      <Dialog
        open={openFilesModal}
        onClose={closeFilesDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "#fff",
            borderRadius: "12px",
            maxHeight: "90vh",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            style={{ fontWeight: "bold", color: "white" }}
          >
            Files
          </Typography>
          <IconButton onClick={closeFilesDialog} style={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          {selectedFiles.length > 0 &&
            (() => {
              const currentFile = selectedFiles[activeFileIndex];
              const isImage = currentFile?.match?.(
                /\.(jpg|jpeg|png|gif|webp)$/i,
              );
              const isVideo = currentFile?.match?.(/\.(mp4|avi|mov|mkv)$/i);
              const isPDF = currentFile?.match?.(/\.pdf$/i);
              const fileName = currentFile?.split("/").pop() || "";

              return (
                <div style={{ width: "100%", textAlign: "center" }}>
                  {/* File Preview */}
                  <div style={{ marginBottom: "24px" }}>
                    {isImage ? (
                      <img
                        src={`${file_url}${currentFile}`}
                        alt={fileName}
                        style={{
                          maxHeight: "400px",
                          maxWidth: "100%",
                          objectFit: "contain",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                    ) : isVideo ? (
                      <video
                        controls
                        style={{
                          height: "500px",
                          Width: "100%",
                          borderRadius: "8px",
                        }}
                      >
                        <source src={`${file_url}${currentFile}`} />
                        Your browser does not support the video tag.
                      </video>
                    ) : isPDF ? (
                      <div
                        style={{
                          padding: "40px",
                          background: "#f5f5f5",
                          borderRadius: "8px",
                          margin: "0 auto",
                          maxWidth: "400px",
                        }}
                      >
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                          📄
                        </div>
                        <p style={{ marginBottom: "16px" }}>{fileName}</p>
                        <a
                          href={`${file_url}${currentFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            padding: "10px 20px",
                            background: "#06CF9C",
                            color: "white",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontWeight: "500",
                          }}
                        >
                          View PDF
                        </a>
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: "40px",
                          background: "#f5f5f5",
                          borderRadius: "8px",
                          margin: "0 auto",
                          maxWidth: "400px",
                        }}
                      >
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                          📄
                        </div>
                        <p style={{ marginBottom: "8px", fontWeight: "500" }}>
                          {fileName}
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginBottom: "16px",
                          }}
                        >
                          This file type cannot be previewed
                        </p>
                        <a
                          href={`${file_url}${currentFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            padding: "8px 16px",
                            background: "#06CF9C",
                            color: "white",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "14px",
                          }}
                        >
                          Download File
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
        </DialogContent>

        {selectedFiles.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px 24px",
              borderTop: "1px solid #eee",
            }}
          >
            <button
              onClick={() => setActiveFileIndex((i) => Math.max(0, i - 1))}
              disabled={activeFileIndex === 0}
              style={{
                padding: "10px 20px",
                background:
                  activeFileIndex === 0
                    ? "#f5f5f5"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: activeFileIndex === 0 ? "#999" : "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: activeFileIndex === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ← Previous
            </button>

            <button
              onClick={() =>
                setActiveFileIndex((i) =>
                  Math.min(selectedFiles.length - 1, i + 1),
                )
              }
              disabled={activeFileIndex === selectedFiles.length - 1}
              style={{
                padding: "10px 20px",
                background:
                  activeFileIndex === selectedFiles.length - 1
                    ? "#f5f5f5"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color:
                  activeFileIndex === selectedFiles.length - 1
                    ? "#999"
                    : "#fff",
                border: "none",
                borderRadius: "6px",
                cursor:
                  activeFileIndex === selectedFiles.length - 1
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </Dialog>

      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          15% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          85% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
        }

        .reply-preview {
          display: flex;
          align-items: flex-start;
          background: #c2bdb826;
          border-left: 4px solid #06cf9c;
          border-radius: 4px;
          padding: 6px 10px;
          margin-bottom: 8px;
          font-size: 12px;
          color: #666;
          cursor: pointer;
        }

        .reply-preview-content {
          flex: 1;
          min-width: 0;
        }

        .reply-preview-sender {
          font-weight: 600;
          color: #06cf9c;
          margin-bottom: 2px;
        }

        .reply-preview-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #00000099;
        }

        .reply-indicator {
          color: #007aff;
          margin-left: 8px;
          flex-shrink: 0;
        }

        .reply-preview {
          display: flex;
          align-items: flex-start;
          background: #c2bdb826;
          border-left: 4px solid #06cf9c;
          border-radius: 4px;
          padding: 6px 10px;
          margin-bottom: 8px;
          font-size: 12px;
          color: #666;
          cursor: pointer;
        }

        .reply-preview-content {
          flex: 1;
          min-width: 0;
        }

        .reply-preview-sender {
          font-weight: 600;
          color: #06cf9c;
          margin-bottom: 2px;
        }

        .reply-preview-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #00000099;
        }

        .reply-indicator {
          color: #007aff;
          margin-left: 8px;
          flex-shrink: 0;
        }

        .files-only {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 12px;
          margin-top: 8px;
          background: #f9f9f9;
          transition: background 0.2s;
        }

        .files-only:hover {
          background: #f0f0f0;
        }

        /* Files grid के लिए अलग स्टाइल */
        .files-only .media-files-grid {
          gap: 10px;
        }

        .files-only .media-file-item {
          width: 80px;
          height: 80px;
          overflow: hidden;
          border-radius: 6px;
          border: 1px solid #ddd;
          background: white;
        }

        .files-only .media-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .files-only .file-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 24px;
          background: #f5f5f5;
        }

        /* WhatsApp style files preview */
        .files-preview {
          margin-top: 8px;
          background: #f0f0f0;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: background 0.2s;
          border: 1px solid #e0e0e0;
        }

        .files-preview:hover {
          background: #e8e8e8;
        }

        .files-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 60px;
        }

        .files-icon-count {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .files-icon {
          font-size: 24px;
        }

        .files-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #06cf9c;
          color: white;
          font-size: 12px;
          font-weight: bold;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .files-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .files-thumbnails {
          flex: 1;
          display: flex;
          gap: 8px;
        }

        .file-thumb {
          position: relative;
          width: 170px;
          height: 170px;
          border-radius: 6px;
          overflow: hidden;
          background: white;
          flex-shrink: 0;
        }

        .thumbnail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-thumb,
        .doc-thumb {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .video-play-icon {
          font-size: 16px;
          color: white;
          margin-bottom: 4px;
        }

        .video-type,
        .doc-type {
          font-size: 10px;
          color: white;
          font-weight: 500;
          background: rgba(0, 0, 0, 0.3);
          padding: 1px 4px;
          border-radius: 2px;
        }

        .doc-thumb {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .doc-icon {
          font-size: 20px;
          color: white;
          margin-bottom: 2px;
        }

        .file-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .placeholder-icon {
          font-size: 18px;
          color: white;
        }

        .placeholder-ext {
          font-size: 10px;
          color: white;
          background: rgba(0, 0, 0, 0.3);
          padding: 1px 4px;
          border-radius: 2px;
          margin-top: 2px;
          text-transform: uppercase;
        }

        /* More overlay */
        .more-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .more-count {
          color: white;
          font-size: 18px;
          font-weight: bold;
        }

        .files-arrow {
          color: #06cf9c;
          font-size: 20px;
          padding: 0 8px;
        }

        .arrow-icon {
          display: block;
          transition: transform 0.2s;
        }

        .files-preview:hover .arrow-icon {
          transform: translateX(4px);
        }

        /* Media queries for responsive design */
        @media (max-width: 480px) {
          .file-thumb {
            width: 50px;
            height: 50px;
          }

          .files-preview {
            padding: 10px;
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
};

const MessageForm = ({ onSubmit, replyToMessage = null, onCancelReply }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const pickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileOptionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showEmojiPicker &&
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }

      if (
        showFileOptions &&
        fileOptionsRef.current &&
        !fileOptionsRef.current.contains(event.target) &&
        !event.target.closest(".file-attach-btn")
      ) {
        setShowFileOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, showFileOptions]);

  useEffect(() => {
    if (replyToMessage && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyToMessage]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const onEmojiClick = (emojiData) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const textBefore = message.substring(0, cursorPosition);
    const textAfter = message.substring(cursorPosition);

    setMessage(textBefore + emojiData.emoji + textAfter);

    setTimeout(() => {
      textareaRef.current.focus();
      const newPosition = cursorPosition + emojiData.emoji.length;
      textareaRef.current.setSelectionRange(newPosition, newPosition);
      adjustTextareaHeight();
    }, 0);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
    setShowFileOptions(false);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    const mediaFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );

    if (mediaFiles.length > 0) {
      addFiles(mediaFiles);
    }

    setShowFileOptions(false);
  };

  const addFiles = (files) => {
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      uploadProgress: 0,
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) =>
      prev.filter((file) => {
        if (file.id === id && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
        return file.id !== id;
      }),
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return <FaImage />;
    if (fileType.includes("pdf"))
      return <FaFile style={{ color: "#FF6B6B" }} />;
    if (fileType.includes("word"))
      return <FaFile style={{ color: "#2B579A" }} />;
    if (fileType.includes("excel"))
      return <FaFile style={{ color: "#217346" }} />;
    if (fileType.includes("zip") || fileType.includes("compressed"))
      return <FaFile style={{ color: "#FFA726" }} />;
    return <FaFile />;
  };

  const simulateUpload = async (file) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, uploadProgress: Math.min(progress, 100) }
              : f,
          ),
        );

        if (progress >= 100) {
          clearInterval(interval);
          resolve(file);
        }
      }, 100);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && selectedFiles.length === 0) return;
    setIsUploading(true);
    try {
      const uploadedFiles = [];
      for (const fileData of selectedFiles) {
        const uploadedFile = await simulateUpload(fileData);
        uploadedFiles.push(uploadedFile.file);
      }
      const messageData = {
        msg: message,
        replyToMessageId: replyToMessage?._id,
        files: uploadedFiles,
      };
      onSubmit(messageData);
      setMessage("");
      setSelectedFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowFileOptions(false);
  };

  const toggleFileOptions = () => {
    setShowFileOptions(!showFileOptions);
    setShowEmojiPicker(false);
  };

  const handleCancelReply = () => {
    if (onCancelReply) {
      onCancelReply();
    }
  };

  return (
    <form id="MessageForm" onSubmit={handleSubmit}>
      {replyToMessage && (
        <div className="reply-preview-container">
          <div className="reply-preview-content">
            <div className="reply-preview-header">
              <FaReply size={12} />
              <span>
                Replying to{" "}
                {replyToMessage.senderType === "user" ? "yourself" : "them"}
              </span>
            </div>
            <div className="reply-preview-text">
              {replyToMessage.message?.substring(0, 80)}
              {replyToMessage.message && replyToMessage.message.length > 80
                ? "..."
                : ""}
            </div>
          </div>
          <button
            type="button"
            className="cancel-reply"
            onClick={handleCancelReply}
          >
            ×
          </button>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="files-preview-container">
          <div className="files-preview-header">
            <span>Attachments ({selectedFiles.length})</span>
            <button
              type="button"
              className="clear-all-files"
              onClick={() => setSelectedFiles([])}
            >
              Clear all
            </button>
          </div>
          <div className="files-preview-grid">
            {selectedFiles.map((file) => (
              <div key={file.id} className="file-preview-item">
                {file.preview ? (
                  <div className="image-preview">
                    <img src={file.preview} alt={file.name} />
                    <div className="image-overlay">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="file-info">
                    <div className="file-icon">{getFileIcon(file.type)}</div>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  className="remove-file"
                  onClick={() => removeFile(file.id)}
                >
                  <FaTimes />
                </button>
                {isUploading && (
                  <div className="upload-progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${file.uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
        }}
      >
        <button
          type="button"
          className="file-attach-btn"
          onClick={toggleFileOptions}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: "#888",
            padding: "8px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaPaperclip />
        </button>

        {showFileOptions && (
          <div ref={fileOptionsRef} className="file-options-popup">
            <div
              className="file-option"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaFile />
              <span>Document</span>
            </div>
            <div
              className="file-option"
              onClick={() => imageInputRef.current?.click()}
            >
              <FaImage />
              <span>Photo & Video</span>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
          multiple
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
        />
        <input
          type="file"
          ref={imageInputRef}
          style={{ display: "none" }}
          onChange={handleImageSelect}
          multiple
          accept="image/*,video/*"
        />
        <div style={{ position: "relative", flexGrow: 1 }}>
          <button
            type="button"
            ref={emojiButtonRef}
            onClick={toggleEmojiPicker}
            style={{
              position: "absolute",
              left: "10px",
              top: "40%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              color: "#888",
              zIndex: 2,
            }}
          >
            <FaSmile />
          </button>

          <textarea
            ref={textareaRef}
            id="MessageInput"
            value={message}
            onChange={handleChange}
            placeholder={
              replyToMessage ? "Type your reply..." : "Type a message..."
            }
            rows={1}
            style={{
              flexGrow: 1,
              resize: "none",
              border: "none",
              outline: "none",
              fontSize: "18px",
              padding: "8px 40px 8px 40px",
              borderRadius: "18px",
              background: "#f5f5f5",
              maxHeight: "120px",
              overflowY: "auto",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        {showEmojiPicker && (
          <div
            ref={pickerRef}
            style={{
              position: "absolute",
              bottom: "60px",
              left: "10px",
              zIndex: 1000,
            }}
          >
            <Picker
              onEmojiClick={onEmojiClick}
              pickerStyle={{
                width: "300px",
                height: "400px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                borderRadius: "10px",
              }}
            />
          </div>
        )}

        <button className="Send" type="submit">
          <FaPaperPlane style={{ zIndex: 1 }} />
        </button>
      </div>

      <style jsx>{`
        #MessageForm {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: white;
          border-top: 1px solid #eee;
          position: relative;
        }

        .reply-preview-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #c2bdb826;
          border-left: 4px solid #06cf9c;
          border-radius: 4px;
          padding: 6px 12px;
          width: 100%;
          font-size: 12px;
        }

        .files-preview-container {
          width: 100%;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 8px;
          border: 1px solid #e9ecef;
        }

        .files-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 12px;
          color: #666;
        }

        .clear-all-files {
          background: none;
          border: none;
          color: #007aff;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .clear-all-files:hover {
          background: #e9ecef;
        }

        .files-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 8px;
        }

        .file-preview-item {
          position: relative;
          background: white;
          border-radius: 6px;
          padding: 8px;
          border: 1px solid #dee2e6;
          overflow: hidden;
        }

        .image-preview {
          position: relative;
          height: 100px;
          border-radius: 4px;
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          padding: 8px;
          color: white;
          font-size: 11px;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .file-icon {
          font-size: 24px;
        }

        .file-details {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          display: block;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          display: block;
          font-size: 10px;
          color: #666;
        }

        .remove-file {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          font-size: 10px;
        }

        .remove-file:hover {
          background: rgba(0, 0, 0, 0.7);
        }

        .upload-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #e9ecef;
        }

        .progress-bar {
          height: 100%;
          background: #06cf9c;
          transition: width 0.3s;
        }

        .file-options-popup {
          position: absolute;
          bottom: 50px;
          left: 10px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          padding: 8px;
          z-index: 1000;
          min-width: 150px;
        }

        .file-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          cursor: pointer;
          border-radius: 6px;
          font-size: 14px;
        }

        .file-option:hover {
          background: #f5f5f5;
        }

        .file-option svg {
          font-size: 18px;
          color: #666;
        }

        .reply-preview-content {
          flex: 1;
          min-width: 0;
        }

        .reply-preview-header {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #06cf9c;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .reply-preview-text {
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cancel-reply {
          background: none;
          border: none;
          color: #999;
          font-size: 20px;
          cursor: pointer;
          padding: 0 4px;
          margin-left: 8px;
        }

        .cancel-reply:hover {
          color: #666;
        }

        .Send {
          background: #007aff;
          color: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .Send:hover:not(:disabled) {
          background: #0056cc;
        }

        .Send:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .file-attach-btn:hover {
          background: #f5f5f5;
        }
      `}</style>
    </form>
  );
};

export default ChatSection;
