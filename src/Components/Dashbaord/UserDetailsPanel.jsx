import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaMobile,
  FaTrash,
  FaBan,
  FaImage,
  FaStar,
} from "react-icons/fa";
import {
  Rating,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  Chip,
  useTheme,
} from "@mui/material";
import { FaThumbsUp } from "react-icons/fa";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateReviewThunk,
  fetchAgentByIdThunk,
} from "../../features/queryThunks";
import moment from "moment";
const file_url = import.meta.env.VITE_FILE_URL;

const getCurrentChatProfileId = (currentChat) =>
  currentChat?.profile?._id ||
  currentChat?.profileId ||
  currentChat?.agent?.profileId ||
  currentChat?.data?.profile?._id ||
  null;

const getProfilePresence = (currentChat) => ({
  isOnline: currentChat?.profile?.isOnline ?? currentChat?.isOnline ?? false,
  lastSeen: currentChat?.profile?.lastSeen ?? currentChat?.lastSeen ?? null,
});

const UserDetailsPanel = ({
  currentChat,
  mediaControlsFiles,
  showUserDetails,
  onClose,
  onOpenMediaGallery,
}) => {
  if (!showUserDetails) return null;

  return (
    <>
      <div className="userDetailsPanel show">
        <div className="userDetailsHeader">
          <button className="backButton" onClick={onClose}>
            <FaArrowLeft />
          </button>
          <h3>Contact Info</h3>
        </div>

        <div className="userDetailsContent">
          <UserProfileSection currentChat={currentChat} />
          <ContactDetails currentChat={currentChat} />

          <SharedMediaSection
            mediaControlsFiles={mediaControlsFiles}
            onOpenMediaGallery={onOpenMediaGallery}
          />
          <RatingReviewSection currentChat={currentChat} />
        </div>
      </div>
      <div className="userDetailsOverlay" onClick={onClose} />
    </>
  );
};

const RatingReviewSection = ({ currentChat }) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const currentProfileId = getCurrentChatProfileId(currentChat);

  useEffect(() => {
    dispatch(
      fetchAgentByIdThunk({
        agentId: currentChat?.agent?._id,
        profileId: currentProfileId,
      }),
    );
  }, [dispatch, currentChat?.agent?._id, currentProfileId]);
  const { data } = useSelector((state) => state.agentData);

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }

    const rewiewData = {
      rating: userRating,
      review: reviewComment,
      agentId: currentChat?.agent?._id,
      profileId: currentProfileId,
    };

    await dispatch(addOrUpdateReviewThunk(rewiewData));
    dispatch(
      fetchAgentByIdThunk({
        agentId: currentChat?.agent?._id,
        profileId: currentProfileId,
      }),
    );
    // setReviews([newReview, ...reviews]);
    setUserRating(0);
    setReviewComment("");
    setShowReviewForm(false);
    alert("Review submitted successfully!");
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    data?.reviews?.forEach((review) => {
      const star = Math.floor(review?.rating);
      distribution[star]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="userDetailsSection">
      <div className="sectionHeader">
        <h4
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#1a237e",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FaStar style={{ color: "#ffc107" }} />
          Ratings & Reviews
        </h4>
      </div>

      {/* ⭐ Rating Summary */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isXs ? "column" : "row",
          alignItems: "center",
          mb: 3,
          p: 3,
          backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 3,
          color: "#1a237e",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
          },
        }}
      >
        <Box
          sx={{ textAlign: "center", mr: 4, position: "relative", zIndex: 1 }}
        >
          <Typography
            variant="h2"
            component="div"
            fontWeight="bold"
            sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            {data?.rating?.avgRating.toFixed(1)}
          </Typography>
          <Box sx={{ my: 1 }}>
            <Rating
              value={data?.rating?.avgRating}
              readOnly
              precision={0.1}
              size="large"
            />
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
            {data?.rating?.totalReviews}{" "}
            {data?.rating?.totalReviews === 1 ? "Review" : "Reviews"}
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            position: "relative",
            zIndex: 1,
            width: isXs ? "100%" : "auto",
            mt: isXs ? 3 : 0,
          }}
        >
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star];
            const percentage =
              data?.rating?.totalReviews > 0
                ? (count / data?.rating?.totalReviews) * 100
                : 0;

            return (
              <Box
                key={star}
                sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{ minWidth: 20, fontWeight: 600 }}
                >
                  {star}
                </Typography>
                <FaStar color="#faaf00" size={14} style={{ margin: "0 8px" }} />
                <Box sx={{ flexGrow: 1, mx: 1, position: "relative" }}>
                  <Box
                    sx={{
                      height: 10,
                      backgroundColor: "rgba(194, 183, 183, 0.3)",
                      borderRadius: 5,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        background: "#faaf00",
                        width: `${percentage}%`,
                        transition: "width 0.5s ease-in-out",
                        borderRadius: 5,
                      }}
                    />
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ minWidth: 35, fontWeight: 600, textAlign: "right" }}
                >
                  {count}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ⭐ Add Review Button */}
      {!showReviewForm && (
        <Button
          variant="contained"
          fullWidth
          sx={{
            mb: 3,
            py: 1.5,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 2,
            fontSize: "1rem",
            fontWeight: "600",
            textTransform: "none",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.3s ease",
          }}
          onClick={() => setShowReviewForm(true)}
          startIcon={<FaStar style={{ fontSize: "1.2rem" }} />}
        >
          Write a Review
        </Button>
      )}

      {/* ⭐ Review Form */}
      {showReviewForm && (
        <Box
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.05)",
            animation: "slideDown 0.3s ease-out",
            "@keyframes slideDown": {
              from: { opacity: 0, transform: "translateY(-10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 700, color: "#1a237e" }}
          >
            Share Your Experience
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              component="legend"
              sx={{ mb: 1, fontWeight: 600, color: "#37474f" }}
            >
              How would you rate your experience?
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Rating
                name="user-rating"
                value={userRating}
                onChange={(event, newValue) => setUserRating(newValue)}
                onChangeActive={(event, newHover) => setHoverRating(newHover)}
                size="large"
                defaultValue={2.5}
                precision={0.5}
                sx={{
                  fontSize: "2.5rem",
                  "& .MuiRating-iconFilled": {
                    color: "#faaf00",
                  },
                  "& .MuiRating-iconHover": {
                    color: "#faaf00",
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {hoverRating !== -1 ? hoverRating : userRating || 0}/5
              </Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Tell us about your experience... What did you like? What could be improved?"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: 2,
                },
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => setShowReviewForm(false)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                borderColor: "#ddd",
                "&:hover": {
                  borderColor: "#999",
                  backgroundColor: "rgba(0,0,0,0.02)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitReview}
              disabled={userRating === 0}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: "#ccc",
                  transform: "none",
                },
                transition: "all 0.3s ease",
              }}
            >
              Submit Review
            </Button>
          </Box>
        </Box>
      )}

      {/* ⭐ Reviews List */}
      <Box sx={{ mt: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1a237e", mb: 3 }}
        >
          Recent Reviews
        </Typography>

        {data?.reviews?.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 3,
              backgroundColor: "rgba(0,0,0,0.02)",
              borderRadius: 3,
              border: "2px dashed #ddd",
            }}
          >
            <FaStar
              style={{ fontSize: "3rem", color: "#ddd", marginBottom: "1rem" }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Reviews Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to share your experience!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ "& > *": { mb: 2 } }}>
            {data?.reviews?.map((review) => (
              <Box
                key={review._id}
                sx={{
                  p: 3,
                  backgroundColor: "white",
                  borderRadius: 3,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar
                    src={review?.userId?.profileImage}
                    alt={review?.userId?.fullName}
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      border: "3px solid #f0f0f0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="#1a237e"
                      >
                        {review?.userId?.fullName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          backgroundColor: "rgba(0,0,0,0.04)",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          fontWeight: 500,
                        }}
                      >
                        {review.date}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Rating
                        value={review?.rating}
                        readOnly
                        precision={0.5}
                        size="small"
                        sx={{
                          "& .MuiRating-iconFilled": {
                            color: "#ffc107",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        {review?.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    mb: 1,
                    lineHeight: 1.6,
                    color: "#37474f",
                  }}
                >
                  {review?.review}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {review?.isMyReview && (
                    <Chip
                      label="Your Review"
                      size="small"
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </div>
  );
};
const UserProfileSection = ({ currentChat }) => {
  const presence = getProfilePresence(currentChat);

  return (
  <div className="userProfileSection">
    <div className="userAvatarLarge">
      <img
        src={currentChat?.agent?.profileImage || "/images/default-avatar.png"}
        alt={currentChat?.profile?.profileName || "Agent"}
        onError={(e) => {
          e.target.onerror = null; // infinite loop se bachane ke liye
          e.target.src =
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
        }}
      />
    </div>
    <div className="userNameLarge">{currentChat?.profile?.profileName}</div>

    <div className="userStatusText">
      {presence.isOnline && "Online"}

      {!presence.isOnline && presence.lastSeen && (
        <>Last seen {moment(presence.lastSeen).fromNow()}</>
      )}
    </div>
  </div>
  );
};

const ContactDetails = ({ currentChat }) => (
  <div className="userDetailsSection">
    <div className="detailItem">
      <FaMobile className="detailIcon" />
      <div className="detailInfo">
        <div className="detailLabel">Phone</div>
        <div className="detailValue">{currentChat?.agent?.phone}</div>
      </div>
    </div>
  </div>
);

const SharedMediaSection = ({
  mediaControlsFiles,
  onOpenMediaGallery,
}) => {
  const getType = (file) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) return "image";
    if (/\.(mp4|avi|mov|mkv|webm)$/i.test(file)) return "video";
    if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(file)) return "doc";
    return "other";
  };

  return (
    <div className="sharedMediaSection">
      <div className="sectionHeader">
        <h4>Shared Media, Links and Docs</h4>
        <button className="viewAllBtn" onClick={onOpenMediaGallery}>
          View All
        </button>
      </div>

      <div className="mediaGrid">
        {mediaControlsFiles?.slice(0, 3).map((item, index) => {
          const type = getType(item.file);
          const filePath = `${file_url}${item.file}`;

          return (
            <div key={item._id || index} className="mediaItem">
              {/* IMAGE */}
              {type === "image" && (
                <img
                  src={filePath}
                  alt=""
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              )}

              {/* VIDEO */}
              {type === "video" && (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    background: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "28px",
                  }}
                >
                  ▶
                </div>
              )}

              {/* DOCUMENT */}
              {type === "doc" && (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    background: "#615dfa",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  📄
                  <span style={{ fontSize: "11px", marginTop: "6px" }}>
                    Document
                  </span>
                </div>
              )}

              {/* FALLBACK */}
              {type === "other" && (
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    background: "#999",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  File
                </div>
              )}
            </div>
          );
        })}

        {mediaControlsFiles?.length > 3 && (
          <div className="mediaItem moreItems" onClick={onOpenMediaGallery}>
            <span>+{mediaControlsFiles.length - 3}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsPanel;
