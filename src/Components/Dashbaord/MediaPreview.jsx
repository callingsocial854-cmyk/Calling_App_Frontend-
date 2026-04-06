// components/MediaPreview.jsx
import React, { useEffect } from "react";
import {
  FaTimes,
  FaDownload,
  FaEllipsisH,
  FaArrowLeft,
  FaArrowRight,
  FaVideo,
  FaFileAlt,
} from "react-icons/fa";

const MediaPreview = ({
  selectedMedia,
  currentMediaIndex,
  mediaControlsFiles,
  onClose,
  onNavigate,
}) => {
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedMedia) {
        if (e.key === "Escape") {
          onClose();
        } else if (e.key === "ArrowRight") {
          onNavigate("next");
        } else if (e.key === "ArrowLeft") {
          onNavigate("prev");
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [selectedMedia, onClose, onNavigate]);

  if (!selectedMedia) return null;

  const canNavigatePrev = currentMediaIndex > 0;
  const canNavigateNext = currentMediaIndex < mediaControlsFiles.length - 1;

  // Format date function
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="mediaPreview">
        <div className="previewHeader">
          <div className="previewTitle">
            {selectedMedia.type === "image"
              ? "Photo"
              : selectedMedia.type === "video"
                ? "Video"
                : "Document"}
            Preview
          </div>
          <div className="previewActions">
            {selectedMedia.type !== "file" && (
              <a
                href={selectedMedia.url}
                download={selectedMedia.name}
                className="actionBtn downloadBtn"
                title="Download"
              >
                <FaDownload />
              </a>
            )}
            <button className="actionBtn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="previewContent">
          {selectedMedia.type === "image" ? (
            <div className="imageContainer">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.name}
                className="previewImage"
              />
            </div>
          ) : selectedMedia?.type === "video" ? (
            <div className="videoContainer">
              <div className="videoIconLarge">
                <FaVideo />
              </div>
              <video src={selectedMedia?.url} controls className="previewVideo">
                Your browser does not support the video tag.
              </video>
              <div className="videoInfo">
                <p>Video: {selectedMedia?.name}</p>
              </div>
            </div>
          ) : (
            <div className="documentContainer">
              <div className="documentIconLarge">
                <FaFileAlt />
              </div>
              <div className="documentInfo">
                <p className="documentName">{selectedMedia?.name}</p>
                <p className="documentType">
                  {selectedMedia?.name} Document
                </p>
              </div>
              <a
                href={selectedMedia?.url}
                download={selectedMedia?.name}
                className="downloadDocumentBtn"
              >
                <FaDownload /> Download Document
              </a>
            </div>
          )}

          {(selectedMedia.type === "image" ||
            selectedMedia.type === "video") && (
            <>
              <button
                className={`navButton prev ${!canNavigatePrev ? "disabled" : ""}`}
                onClick={() => canNavigatePrev && onNavigate("prev")}
                disabled={!canNavigatePrev}
              >
                <FaArrowLeft />
              </button>
              <button
                className={`navButton next ${!canNavigateNext ? "disabled" : ""}`}
                onClick={() => canNavigateNext && onNavigate("next")}
                disabled={!canNavigateNext}
              >
                <FaArrowRight />
              </button>
            </>
          )}

          <div className="mediaCounter">
            {currentMediaIndex + 1} / {mediaControlsFiles.length}
          </div>
        </div>

        <div className="previewFooter">
          <div className="mediaInfo">
            <div className="mediaName">
              {selectedMedia.type === "image" && "📷 "}
              {selectedMedia.type === "video" && "🎬 "}
              {selectedMedia.type === "file" && "📄 "}
              {selectedMedia.name}
            </div>
            <div className="mediaMeta">
              <span className="mediaType">
                {selectedMedia?.type}
              </span>
              <span className="mediaSize">
                {/* यदि size data available है तो यहाँ add कर सकते हैं */}
              </span>
              <span className="mediaDate">
                {selectedMedia.date
                  ? `Shared on ${selectedMedia.date}`
                  : selectedMedia.uploadedAt
                    ? formatDate(selectedMedia.uploadedAt)
                    : "Date not available"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="previewOverlay" onClick={onClose} />
    </>
  );
};

export default MediaPreview;
