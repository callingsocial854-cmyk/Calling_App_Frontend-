import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaSearch, FaStar } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import "./MyQueryDetail.css";
import { FaEyeSlash } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { RxHeart } from "react-icons/rx";
import { RxHeartFilled } from "react-icons/rx";
import { FaStarHalfAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { FaCheck } from "react-icons/fa6";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { MdOutlineMarkUnreadChatAlt, MdFavorite } from "react-icons/md";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { BiSolidCommentAdd } from "react-icons/bi";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentInQueryThunk,
  fetchAgentsForUserQuery,
  fetchQueryById,
  updateQueryStatusThunk,
  toggleFavoriteStatusThunk,
  fetchAgentByIdThunk,
} from "../../features/queryThunks";
import socket from "../../socket";
import moment from "moment";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { getUserMediaControls } from "../../api/queryApi";
import VideocamIcon from "@mui/icons-material/Videocam";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import db from "../../app/db";

const getCurrentChatProfileId = (currentChat) =>
  currentChat?.profile?._id ||
  currentChat?.profileId ||
  currentChat?.agent?.profileId ||
  currentChat?.data?.profile?._id ||
  null;

const getChatPresence = (chat) => ({
  isOnline: chat?.profile?.isOnline ?? chat?.isOnline ?? false,
  lastSeen: chat?.profile?.lastSeen ?? chat?.lastSeen ?? null,
});

const ChatList = ({
  currentChat,
  isMobileMenuOpen,
  onChatSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [statusQueryModelOpen, setStatusQueryModelOpen] = useState(false);
  const [isExpanded] = useState(false);
  const [queryView, setQueryView] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editTime, setEditTime] = useState(false);
  const [chatFilter, setChatFilter] = useState("all");
  const [snackbarBar, setSnackbarBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [agentImagesModel, setAgentImagesModel] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const matches = useMediaQuery("(max-width:600px)");
  const [isMobile, setIsMobile] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const { queryId } = useParams();
  const dispatch = useDispatch();
  const [agentsData, setAgentsData] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mediaList, setMediaList] = useState([]);
  const [query, setQuery] = useState({});
  const file_url = import.meta.env.VITE_FILE_URL;
  const isOnline = useSelector((state) => state.network.isOnline);
  const currentProfileId = getCurrentChatProfileId(currentChat);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(fetchQueryById(queryId));
    dispatch(
      fetchAgentsForUserQuery({
        queryId,
        type: chatFilter,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, queryId, chatFilter, debouncedSearch]);
  const queryData = useSelector((state) => state.query);

  const {
    agents,
    loading: agentsLoading,
    error: agentsError,
  } = useSelector((state) => state.agents);

  const navigate = useNavigate();

  const getMediaList = async () => {
    try {
      const res = await getUserMediaControls(queryId);
      setMediaList(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const syncAgents = async () => {
      if (!agents || !Array.isArray(agents)) return;
      if (isOnline) {
        setAgentsData(agents);
        getMediaList();
        const normalizedAgents = agents
          .filter((a) => a?.agent?._id)
          .map((a) => ({
            _id: a.agent._id,
            ...a,
          }));

        await db.agents.clear();
        await db.agents.bulkPut(normalizedAgents);
      } else {
        const localAgents = await db.agents.toArray();
        setAgentsData(localAgents);
      }
    };

    const syncQuery = async () => {
      const query = queryData?.query;
      if (isOnline) {
        if (!query?._id) return;
        await db.query.put(query);
        setQuery(query);
      } else {
        const localQuery = await db.query.get(queryId);
        setQuery(localQuery);
      }
    };

    syncAgents();
    syncQuery();
  }, [agents, isOnline, queryData?.query, queryId]);

  useEffect(() => {
    if (!socket) return;

    const handleAgentStatusUpdate = ({ agentId, profileId, status, lastSeen }) => {
      setAgentsData((prevAgents) =>
        prevAgents.map((item) => {
          const itemProfileId = getCurrentChatProfileId(item);
          const isMatchingProfile = profileId && itemProfileId && profileId === itemProfileId;
          const isFallbackAgentMatch = !profileId && item.agent._id === agentId;

          if (!isMatchingProfile && !isFallbackAgentMatch) {
            return item;
          }

          return {
            ...item,
            profile: {
              ...(item.profile || {}),
              isOnline: status === "online",
              lastSeen,
            },
            isOnline: status === "online",
            lastSeen,
          };
        }),
      );
    };

    const handleUpdateRoom = (data) => {
      setAgentsData((prev) =>
        prev.map((room) => {
          const isCurrentChat = currentChat?.roomId === room.roomId;

          if (room?.roomId === data?._id) {
            return {
              ...room,
              lastMessage: data?.lastMessage,
              lastMessageTime: data?.lastMessageTime,
              unreadCount: isCurrentChat ? 0 : data.unreadCountUser,
              lastMessageId: data?.lastMessageId,
              mediaControls: data?.lastMessageId?.mediaControls || [],
              replyTo: data?.lastMessageId?.replyTo || null,
            };
          }
          return room;
        }),
      );
    };

    const handleUpdateRead = (data) => {
      console.log("updateUnreadCount", data);
    };

    socket.on("agentStatusUpdate", handleAgentStatusUpdate);
    socket.on("updateRoom", handleUpdateRoom);
    socket.on("updateUnreadCount", handleUpdateRead);

    return () => {
      socket.off("agentStatusUpdate", handleAgentStatusUpdate);
      socket.off("updateRoom", handleUpdateRoom);
      socket.off("updateUnreadCount", handleUpdateRead);
    };
  }, [currentChat]);

  const handleChange = (event, newValue) => {
    setChatFilter(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenStatusQuery = () => {
    setStatusQueryModelOpen(true);
  };
  const closeStatusQueryModel = () => {
    setStatusQueryModelOpen(false);
  };
  const confirmStatusQuery = async () => {
    await dispatch(
      updateQueryStatusThunk({
        queryId: query?._id,
        status: query.status === "Active" ? "Inactive" : "Active",
      }),
    );
    dispatch(fetchQueryById(queryId));
    setStatusQueryModelOpen(false);
  };

  const handleSubmit = async () => {
    const commentData = {
      queryId: query?._id,
      comment: newComment,
    };
    await dispatch(addCommentInQueryThunk(commentData));
    dispatch(fetchQueryById(queryId));
    setNewComment("");
    setTimeout(() => {
      const box = document.getElementById("commentsBox");
      box.scrollTop = box.scrollHeight;
    }, 200);
  };

  const toggleFavorite = async (agentId) => {
    const res = await dispatch(
      toggleFavoriteStatusThunk({ agentId, profileId: currentProfileId }),
    );
    await dispatch(fetchAgentsForUserQuery({ queryId, type: chatFilter }));
    dispatch(fetchAgentByIdThunk({ agentId, profileId: currentProfileId }));
    setSnackbarMessage(res?.payload?.message);
    setSnackbarBar(true);
  };

  const handleEditTimeSubmit = async () => {
    const editTimeData = {
      queryId: query?._id,
      startTime: startTime ? startTime.format("hh:mm A") : "",
      endTime: endTime ? endTime.format("hh:mm A") : "",
    };
    await dispatch(updateQueryStatusThunk(editTimeData));
    dispatch(fetchQueryById(queryId));
    setEditTime(false);
  };

  const renderChatItem = (chat) => {
    const allImages =
      chat?.mediaControls?.flatMap((control) => control.mediaFiles || []) || [];
    const presence = getChatPresence(chat);

    return (
      <div
        key={chat?.agent?._id}
        className={`group ${currentChat?.agent?._id === chat?.agent?._id ? "active" : ""}`}
        onClick={() => onChatSelect(chat)}
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        <div className="avatarContainer">
          <div className="avatar">
            <img
              src={`${file_url}${chat?.agent?.profileImage}`}
              alt={chat?.agent?.fullName || "Agent"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
              }}
              loading="lazy"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            className={`statusDot ${presence.isOnline ? "online" : "offline"}`}
            style={{ right: "15px" }}
          ></div>
        </div>
        <div className="chatInfo">
          <div className="chatHeader">
            <p className="GroupName">
              {chat?.agent.fullName}

              {chat?.agent.avgRating > 0 && (
                <>
                  <FaStar
                    style={{
                      color: "#f4b400",
                      marginLeft: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <span
                    style={{
                      marginLeft: "4px",
                      color: "#333",
                      fontSize: "10px",
                    }}
                  >
                    {chat.agent.avgRating}
                  </span>
                </>
              )}
            </p>

            {chat?.unreadCount > 0 && (
              <span className="unreadBadge">{chat?.unreadCount}</span>
            )}
          </div>
          <p
            className="GroupDescrp"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ flex: 1, textAlign: "left" }}>
              {chat?.lastMessage}
            </span>

            <span
              className="timeStamp"
              style={{
                whiteSpace: "nowrap",
                textAlign: "right",
                fontSize: "12px",
                color: "#888",
              }}
            >
              {chat?.lastMessageTime && moment(chat?.lastMessageTime).fromNow()}
            </span>
          </p>

          {chat?.mediaControls?.length > 0 && (
            <div className="comment-images">
              {chat.mediaControls
                .flatMap((control) => control.mediaFiles || [])
                .filter((media) => /\.(jpg|jpeg|png|webp)$/i.test(media.file))
                .slice(0, 3)
                .map((media, idx) => {
                  const filePath = `${file_url}${media.file}`;

                  return (
                    <div
                      key={media._id || idx}
                      className="comment-image-container"
                      onClick={() => openImageModal(allImages, idx)}
                    >
                      <img
                        src={filePath}
                        alt={`media-${idx}`}
                        className="comment-image"
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* ❤️ Favorite Button */}
        <Tooltip
          title={
            chat?.isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          placement="top"
          arrow
        >
          <div
            style={{
              marginLeft: "10px",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onClick={() => toggleFavorite(chat?.agent._id)}
          >
            {chat?.isFavorite ? (
              <RxHeartFilled style={{ color: "#ff4d4f", fontSize: "20px" }} />
            ) : (
              <RxHeart style={{ color: "#aaa", fontSize: "20px" }} />
            )}
          </div>
        </Tooltip>
      </div>
    );
  };

  const flatMedia = useMemo(() => {
    if (!mediaList?.length) return [];

    return mediaList.flatMap((item) =>
      item.mediaControls.flatMap((control) =>
        control.mediaFiles.map((file) => ({
          url: `${import.meta.env.VITE_FILE_URL}${file.file}`,
          type: file.file.split(".").pop().toLowerCase(),
        })),
      ),
    );
  }, [mediaList]);

  const groupedByAgent = useMemo(() => {
    if (!mediaList?.length) return {};

    return mediaList.reduce((acc, item) => {
      const agentId = item.senderId?._id || "unknown";

      if (!acc[agentId]) {
        acc[agentId] = {
          agent: item.senderId,
          items: [],
        };
      }

      acc[agentId].items.push(item);
      return acc;
    }, {});
  }, [mediaList]);

  const handleImageClick = (imgUrl) => {
    const index = flatMedia.findIndex((m) => m.url === imgUrl);
    setSelectedImage(imgUrl);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (!flatMedia.length) return;

    const nextIndex = (currentIndex + 1) % flatMedia.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(flatMedia[nextIndex].url);
  };

  const handlePrev = () => {
    if (!flatMedia.length) return;

    const prevIndex = (currentIndex - 1 + flatMedia.length) % flatMedia.length;

    setCurrentIndex(prevIndex);
    setSelectedImage(flatMedia[prevIndex].url);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleDashbaord = () => {
    navigate("/dashboard");
  };

  const ChatLoader = () => (
    <Box
      sx={{
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
      }}
    >
      <CircularProgress size={28} sx={{ color: "#0a8d48" }} />
    </Box>
  );

  const openImageModal = (mediaFiles, startIndex = 0) => {
    setSelectedImages(mediaFiles);
    setCurrentImageIndex(startIndex);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);
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

  return (
    <div className={`sideNav2 ${isMobileMenuOpen ? "mobileOpen" : ""}`}>
      <div className="SideNavhead">
        {isMobile && (
          <span>
            <button className="mobileToggle" onClick={toggleDashbaord}>
              {" "}
              <FaArrowLeft />
            </button>
          </span>
        )}

        <h2>Your Query</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "11px",
          }}
        >
          <div className="status-controls">
            <ToggleButtonGroup
              value={query?.status}
              exclusive
              onChange={handleOpenStatusQuery}
              aria-label="Query Status"
              sx={{
                "& .MuiToggleButton-root": {
                  fontSize: "10px",
                  padding: "4px 12px 2px 12px",
                  border: "none",
                  borderRadius: "20px",
                  color: "#fff",

                  transition: "all 0.3s ease",
                  textTransform: "none",
                  width: "69px",
                },
              }}
            >
              <ToggleButton
                value="active"
                sx={{
                  backgroundColor:
                    query?.status === "Active"
                      ? "#4caf50 !important"
                      : "#e0e0e0 !important",
                  color:
                    query?.status === "Active"
                      ? "#fff !important"
                      : "#333 !important",
                  marginRight: "8px",
                  fontWeight: query?.status === "Active" ? "600" : "400",
                  "&:hover": {
                    backgroundColor:
                      query?.status === "Active"
                        ? "green !important"
                        : "#d5d5d5 !important",
                  },
                  outline:
                    query?.status === "Active"
                      ? "2px solid #fff !important"
                      : "#667eea !important",
                  outlineOffset: "2px !important",
                }}
                disabled={query?.status === "Active"}
              >
                Active
              </ToggleButton>
              {query?.status === "Active" && (
                <FaCheck
                  style={{
                    position: "absolute",
                    marginLeft: "54px",
                    color: "white",
                    fontSize: "10px",
                    marginTop: "8px",
                  }}
                />
              )}

              <ToggleButton
                value="Inactive"
                sx={{
                  backgroundColor:
                    query?.status === "Inactive"
                      ? "#f44336 !important"
                      : "#e0e0e0 !important",
                  color:
                    query?.status === "Inactive"
                      ? "#fff !important"
                      : "#333 !important",
                  fontWeight: query?.status === "Inactive" ? "600" : "400",
                  "&:hover": {
                    backgroundColor:
                      query?.status === "Inactive"
                        ? "green !important"
                        : "#d5d5d5 !important",
                  },
                  outline:
                    query?.status === "Inactive"
                      ? "2px solid #fff !important"
                      : "#667eea !important",
                  outlineOffset: "2px !important",
                }}
                disabled={query?.status === "Inactive"}
              >
                Inactive
              </ToggleButton>

              {query?.status === "Inactive" && (
                <FaCheck
                  style={{
                    position: "absolute",
                    marginLeft: "132px",
                    color: "white",
                    fontSize: "10px",
                    marginTop: "8px",
                  }}
                />
              )}
            </ToggleButtonGroup>
          </div>
          <div>
            <button
              onClick={() => setAgentImagesModel(true)}
              title="All Agent Images"
              style={{
                fontSize: "10px",
                fontWeight: "600",
                padding: "3px 8px",
                border: "none",
                borderRadius: "25px",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #5a67d8 0%, #6b46c1 100%)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #667eea 0%, #764ba2 100%)")
              }
            >
              All Images
            </button>
          </div>
        </div>
      </div>

      <div className="query-detail-card">
        <div className="query-header p-0"></div>

        <div
          className="query-content"
          style={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          <p
            style={{
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              color: "black",
              margin: 0,
              ...(isExpanded
                ? {}
                : {
                    maxHeight: "3.5em",
                    overflow: "hidden",
                  }),
            }}
          >
            {isExpanded
              ? query?.description
              : `${query?.description?.slice(0, 100)}${
                  query?.description?.length > 100 ? "..." : ""
                }`}
          </p>

          {/* Gradient overlay instead of ::after */}
          {!isExpanded && <div className="fade-overlay" />}
        </div>

        <div className="read-more-container">
          <div>
            {" "}
            <Button
              variant="contained"
              sx={{
                padding: "10px !important",
                fontSize: "10px !important",
                alignItems: "self-start",
              }}
              onClick={() => setEditTime(true)}
            >
              Active {query?.startTime} to {query?.endTime}
              <MdModeEdit style={{ marginLeft: "4px", fontSize: "12px" }} />
            </Button>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Tooltip title="Add Comment" placement="top" arrow>
              <button
                className={`read-more-btn`}
                onClick={handleClickOpen}
                data-tooltip={"Add comment"}
              >
                <BiSolidCommentAdd />
              </button>
            </Tooltip>
            {query?.description?.length > 50 && (
              <Tooltip title="Show more" placement="top" arrow>
                <button
                  className={`read-more-btn`}
                  onClick={() => {
                    setQueryView(true);
                  }}
                  data-tooltip={queryView ? "Show less" : "Show more"}
                  aria-label={queryView ? "Collapse text" : "Expand text"}
                >
                  {queryView ? <FaEyeSlash /> : <FaEye />}
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      <div className="SearchInputHolder">
        <FaSearch className="icon" />
        <input
          className="searchInput"
          placeholder="Search For Chat.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={chatFilter}>
          <Box
            sx={{
              borderBottom: "1px solid #e0e0e0",
              backgroundColor: "#fff",
              px: 2,
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="Chat Tabs"
              variant="fullWidth"
              sx={{
                "& .MuiTabs-flexContainer": {
                  justifyContent: "space-around",
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#555",
                  transition: "all 0.3s ease",
                  minHeight: "42px",
                  border: "none",
                  outline: "none",
                  mx: 0.5,
                  "&:hover": {
                    backgroundColor: "#f0f2f5",
                    color: "#000",
                    border: "none",
                  },
                },
                "& .Mui-selected": {
                  color: "#0a8d48 !important", // WhatsApp green
                  backgroundColor: "#e9f7ef",
                  border: "none",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#0a8d48",
                  height: "3px",
                  border: "none",
                },
              }}
            >
              <Tab label="All" value="all" />
              <Tab label="Unread" value="unread" />
              <Tab label="Favorites" value="favorite" />
            </TabList>
          </Box>

          {/* ✅ All Chats */}
          <TabPanel
            value="all"
            sx={{ padding: "5px", height: "42vh", overflowY: "auto" }}
          >
            {agentsLoading ? (
              <ChatLoader />
            ) : agentsError ? (
              <p style={{ textAlign: "center", color: "red" }}>{agentsError}</p>
            ) : agentsData?.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#888",
                  fontSize: "14px",
                  padding: "20px 0",
                }}
              >
                No agents available
              </p>
            ) : (
              <div className="chatList">{agentsData.map(renderChatItem)}</div>
            )}
          </TabPanel>

          {/* ✅ Unread Chats */}
          <TabPanel value="unread" sx={{ padding: "5px", height: "100%" }}>
            {agentsLoading ? (
              <ChatLoader />
            ) : agentsData?.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  color: "#888",
                }}
              >
                <p style={{ fontSize: "14px", margin: 0 }}>
                  No unread messages <MdOutlineMarkUnreadChatAlt size={18} />
                </p>
              </Box>
            ) : (
              <div className="chatList">{agentsData.map(renderChatItem)}</div>
            )}
          </TabPanel>

          {/* ✅ Favorite Chats - CORRECTED: Now properly filters only favorited chats */}
          <TabPanel value="favorite" sx={{ padding: "5px", height: "100%" }}>
            {agentsLoading ? (
              <ChatLoader />
            ) : agentsData?.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  color: "#888",
                }}
              >
                <p style={{ fontSize: "14px", margin: 0 }}>
                  No favorite agents <MdFavorite color="red" />
                </p>
              </Box>
            ) : (
              <div className="chatList">{agentsData.map(renderChatItem)}</div>
            )}
          </TabPanel>
        </TabContext>
      </Box>

      {matches && (
        <Box sx={{ m: 3 }}>
          <Button onClick={() => navigate("/dashboard")} variant="contained">
            Dashboard
          </Button>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} className="beautiful-dialog">
        <DialogTitle sx={{ fontSize: "16px" }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>Your Query</Grid>
            <Grid size={3} sx={{ width: "fit-content" }}>
              Active {query?.startTime} to {query?.endTime}
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent>
          {/* ===== Main Query Info ===== */}
          <div style={{ marginBottom: "10px" }}>
            <p style={{ margin: 0, fontWeight: "500" }}>{query?.description}</p>
            <small style={{ color: "gray" }}>
              {new Date(query?.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>

          <hr style={{ margin: "15px 0", borderColor: "#eee" }} />

          {/* ===== Comments Section ===== */}
          <div
            id="commentsBox"
            style={{ maxHeight: "250px", overflowY: "auto" }}
          >
            {query?.comments?.length === 0
              ? null
              : query?.comments?.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <p style={{ margin: "0 0 4px 0" }}>{comment.text}</p>
                    <small style={{ color: "gray" }}>
                      {new Date(comment.date).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                ))}
          </div>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Your note here"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="Type your note..."
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={query?.status === "Inactive"}
            onClick={handleSubmit}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={statusQueryModelOpen}
        onClose={closeStatusQueryModel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {" Are you sure you want to active this query?"}
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            maxHeight: { xs: "70vh", sm: "75vh" }, // ✅ Responsive max height
            overflowY: "auto",
            paddingBottom: "20px",
          }}
        >
          {/* ===== Main Query Info ===== */}
          <div style={{ marginBottom: "10px" }}>
            <p style={{ margin: 0, fontWeight: "500" }}>{query?.description}</p>

            <small style={{ color: "gray" }}>
              {new Date(query?.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>

          <hr style={{ margin: "15px 0", borderColor: "#eee" }} />

          {/* ===== Comments Section ===== */}
          <div>
            {query?.comments?.length === 0 ? (
              null
            ) : (
              query?.comments?.map((comment) => (
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

        <DialogActions>
          <Button onClick={closeStatusQueryModel}>Cancel</Button>
          <Button onClick={confirmStatusQuery} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={queryView}
        onClose={() => setQueryView(false)}
        className="beautiful-dialog"
        scroll="paper"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontSize: "16px" }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>Your Query</Grid>
            <Grid item sx={{ marginRight: "30px", width: "fit-content" }}>
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
            <p style={{ margin: 0, fontWeight: "500" }}>{query?.description}</p>

            <small style={{ color: "gray" }}>
              {new Date(query?.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>

          <hr style={{ margin: "15px 0", borderColor: "#eee" }} />

          {/* ===== Comments Section ===== */}
          <div>
            {query?.comments?.length === 0 ? (
              null
            ) : (
              query?.comments?.map((comment) => (
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
        open={editTime}
        onClose={() => setEditTime(false)}
        className="beautiful-dialog"
      >
        <DialogTitle sx={{ fontSize: "16px" }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>Your Query</Grid>
            <Grid size={3} sx={{ width: "fit-content" }}>
              Active {query?.startTime} to {query?.endTime}
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent>
          {/* ===== Main Query Info ===== */}
          <div style={{ marginTop: "10px" }}>
            <p style={{ margin: 0, fontWeight: "500" }}>{query?.description}</p>
            <small style={{ color: "gray" }}>
              {new Date(query?.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>

          <hr style={{ margin: "15px 0", borderColor: "#eee" }} />

          {/* ===== Comments Section ===== */}
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {query?.comments?.length === 0
              ? null
              : query?.comments?.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <p style={{ margin: "0 0 4px 0" }}>{comment.text}</p>
                    <small style={{ color: "gray" }}>{comment.date}</small>
                  </div>
                ))}
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker", "TimePicker"]}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
              />

              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditTime(false)}>Cancel</Button>
          <Button
            disabled={query?.status === "Inactive"}
            onClick={handleEditTimeSubmit}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={agentImagesModel}
        onClose={() => setAgentImagesModel(false)}
        className="beautiful-dialog"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontSize: "16px" }}>
          <Grid container justifyContent="space-between" alignItems="center">
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
          {mediaList && mediaList.length > 0 ? (
            Object.values(groupedByAgent).map((group, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                }}
              >
                {/* ===== SAME HEADER (just data fixed) ===== */}
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Agent Name: {group.agent?.fullName || "Unknown"}
                  </Typography>
                </Box>

                {/* ===== SAME MEDIA STRUCTURE ===== */}
                {group.items.map((item) =>
                  item.mediaControls?.map((control) => (
                    <Box
                      key={control._id}
                      sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}
                    >
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {control.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Location: {control.location}
                        </Typography>
                      </Box>

                      {control.mediaFiles && control.mediaFiles.length > 0 ? (
                        <ImageList
                          sx={{ width: "100%", height: "auto", mt: 1 }}
                          cols={fullScreen ? 2 : isMd ? 3 : 4}
                          rowHeight={fullScreen ? 120 : isMd ? 150 : 164}
                        >
                          {control.mediaFiles.map((mediaFile) => {
                            const fileUrl = `${import.meta.env.VITE_FILE_URL}${mediaFile.file}`;
                            const ext = mediaFile.file
                              .split(".")
                              .pop()
                              .toLowerCase();

                            const isImage = [
                              "jpg",
                              "jpeg",
                              "png",
                              "gif",
                              "webp",
                            ].includes(ext);
                            const isVideo = ["mp4", "webm", "ogg"].includes(
                              ext,
                            );
                            const isPDF = ext === "pdf";

                            return (
                              <ImageListItem key={mediaFile._id}>
                                {isImage ? (
                                  <img
                                    src={fileUrl}
                                    alt=""
                                    loading="lazy"
                                    style={{
                                      objectFit: "cover",
                                      width: "100%",
                                      height: "100%",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleImageClick(fileUrl)}
                                  />
                                ) : isVideo ? (
                                  <Box
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      bgcolor: "#e0e0e0",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleImageClick(fileUrl)}
                                  >
                                    <VideocamIcon sx={{ fontSize: 40 }} />
                                  </Box>
                                ) : isPDF ? (
                                  <Box
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      bgcolor: "#f44336",
                                      color: "white",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleImageClick(fileUrl)}
                                  >
                                    <PictureAsPdfIcon sx={{ fontSize: 40 }} />
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      bgcolor: "#1976d2",
                                      color: "white",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleImageClick(fileUrl)}
                                  >
                                    <InsertDriveFileIcon
                                      sx={{ fontSize: 40 }}
                                    />
                                  </Box>
                                )}
                              </ImageListItem>
                            );
                          })}
                        </ImageList>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                          sx={{ py: 2 }}
                        >
                          No media files available
                        </Typography>
                      )}
                    </Box>
                  )),
                )}
              </Box>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No media data available
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
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
          onClick={() => setSelectedImage(null)}
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
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* Next Button */}
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: 25,
            color: "#fff",
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.4)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

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
          {selectedImage &&
            flatMedia[currentIndex] &&
            (() => {
              const { url, type } = flatMedia[currentIndex];

              const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
                type,
              );
              const isVideo = ["mp4", "webm", "ogg"].includes(type);
              const isPDF = type === "pdf";

              if (isImage) {
                return (
                  <img
                    src={url}
                    alt="preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                );
              }

              if (isVideo) {
                return (
                  <video
                    src={url}
                    controls
                    autoPlay
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  />
                );
              }

              if (isPDF) {
                return (
                  <iframe
                    src={url}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    title="PDF Preview"
                  />
                );
              }

              return (
                <Box sx={{ color: "#fff" }}>
                  <Typography>Preview not supported</Typography>
                  <a href={url} target="_blank" style={{ color: "#90caf9" }}>
                    Download file
                  </a>
                </Box>
              );
            })()}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarBar}
        autoHideDuration={2000}
        onClose={() => setSnackbarBar(false)}
        sx={{ width: "max-content" }}
      >
        <Alert
          onClose={() => setSnackbarBar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            background: "#ffffff",
            borderRadius: 0,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div>Media Control</div>

            <IconButton
              onClick={handleCloseModal}
              style={{
                color: "#615dfa",
                background: "rgba(97,93,250,0.1)",
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>

          {/* MAIN MEDIA AREA */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f8f9fa",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {selectedImages.length > 0 &&
              (() => {
                const currentMedia = selectedImages[currentImageIndex];

                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                  currentMedia.file,
                );
                const isVideo = /\.(mp4|avi|mov|mkv|webm)$/i.test(
                  currentMedia.file,
                );
                const isPDF = /\.pdf$/i.test(currentMedia.file);

                if (isImage) {
                  return (
                    <img
                      src={`${file_url}${currentMedia.file}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  );
                }

                if (isVideo) {
                  return (
                    <video
                      controls
                      autoPlay
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    >
                      <source src={`${file_url}${currentMedia.file}`} />
                    </video>
                  );
                }

                if (isPDF) {
                  return (
                    <iframe
                      src={`${file_url}${currentMedia.file}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                    />
                  );
                }

                return (
                  <a
                    href={`${file_url}${currentMedia.file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download File
                  </a>
                );
              })()}

            {/* NAV BUTTONS */}
            <IconButton
              onClick={handlePrevImage}
              style={{
                position: "absolute",
                left: 20,
                background: "#fff",
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>

            <IconButton
              onClick={handleNextImage}
              style={{
                position: "absolute",
                right: 20,
                background: "#fff",
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>

          {/* THUMBNAILS */}
          {selectedImages.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 10,
                padding: 12,
                overflowX: "auto",
                borderTop: "1px solid #eee",
                background: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedImages.map((media, i) => {
                const isImg = /\.(jpg|jpeg|png|webp)$/i.test(media.file);

                return (
                  <div
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    style={{
                      width: 80,
                      height: 80,
                      border:
                        i === currentImageIndex
                          ? "3px solid #615dfa"
                          : "2px solid #ddd",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    {isImg ? (
                      <img
                        src={`${file_url}${media.file}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          background: "#615dfa",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        FILE
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ChatList;
