import React, { useState, useMemo } from "react";
import {
  FaArrowLeft,
  FaImages,
  FaDownload,
  FaFileAlt,
  FaVideo,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";

const MediaGallery = ({ showMediaGallery, onClose, mediaControlsFiles }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const getFileType = (filename) => {
    if (!filename) return "file";

    const extension = filename.toLowerCase().split(".").pop();
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
    const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm", "wmv", "flv"];
    const documentExtensions = [
      "pdf",
      "doc",
      "docx",
      "txt",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "csv",
    ];

    if (imageExtensions.includes(extension)) return "image";
    if (videoExtensions.includes(extension)) return "video";
    if (documentExtensions.includes(extension)) return "file";

    return "file";
  };

  const processedFiles = useMemo(() => {
    return mediaControlsFiles.map((file, index) => {
      const fileName = file.file;
      const type = getFileType(fileName);
      const fileUrl = `${import.meta.env.VITE_FILE_URL}${fileName}`;
      const nameParts = fileName.split("-");
      const displayName = nameParts.slice(1).join("-");

      return {
        ...file,
        id: file._id || index,
        name: displayName || fileName,
        originalName: fileName,
        type,
        url: fileUrl,
        extension: fileName.split(".").pop(),
      };
    });
  }, [mediaControlsFiles]);

  const filteredFiles = useMemo(() => {
    if (activeFilter === "all") return processedFiles;
    if (activeFilter === "photos")
      return processedFiles.filter((f) => f.type === "image");
    if (activeFilter === "videos")
      return processedFiles.filter((f) => f.type === "video");
    if (activeFilter === "documents")
      return processedFiles.filter((f) => f.type === "file");
    return processedFiles;
  }, [activeFilter, processedFiles]);

  const imageCount = useMemo(
    () => processedFiles.filter((f) => f.type === "image").length,
    [processedFiles],
  );

  const videoCount = useMemo(
    () => processedFiles.filter((f) => f.type === "video").length,
    [processedFiles],
  );

  const handleFileClick = (index) => {
    setSelectedFileIndex(index);
    setPreviewOpen(true);
    setLoading(true);
  };

  const handleNext = () => {
    setSelectedFileIndex((prev) =>
      prev < filteredFiles.length - 1 ? prev + 1 : 0,
    );
  };

  const handlePrev = () => {
    setSelectedFileIndex((prev) =>
      prev > 0 ? prev - 1 : filteredFiles.length - 1,
    );
  };

  const handleDownload = () => {
    const file = filteredFiles[selectedFileIndex];
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(filteredFiles[selectedFileIndex].url, "_blank");
  };

  const selectedFile = filteredFiles[selectedFileIndex];

  if (!showMediaGallery) return null;

  return (
    <>
      <div className="mediaGallery">
        <div className="galleryHeader">
          <button className="backButton" onClick={onClose}>
            <FaArrowLeft />
          </button>
          <h3>Shared Media</h3>
          <div className="galleryStats">
            {imageCount} photos • {videoCount} videos • {processedFiles.length}{" "}
            total
          </div>
        </div>

        <div className="galleryContent">
          <div className="mediaCategories">
            <button
              className={`categoryBtn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button
              className={`categoryBtn ${activeFilter === "photos" ? "active" : ""}`}
              onClick={() => setActiveFilter("photos")}
            >
              Photos
            </button>
            <button
              className={`categoryBtn ${activeFilter === "videos" ? "active" : ""}`}
              onClick={() => setActiveFilter("videos")}
            >
              Videos
            </button>
            <button
              className={`categoryBtn ${activeFilter === "documents" ? "active" : ""}`}
              onClick={() => setActiveFilter("documents")}
            >
              Documents
            </button>
          </div>

          <div className="galleryGrid">
            {filteredFiles.map((file, index) => (
              <div
                key={`${file._id}-${index}`}
                className={`galleryItem ${file.type}`}
                onClick={() => handleFileClick(index)}
                style={{ cursor: "pointer" }}
              >
                {file.type === "image" ? (
                  <img src={file.url} alt={file.name} loading="lazy" />
                ) : file.type === "video" ? (
                  <div className="videoPreview">
                    <FaVideo className="videoIcon" />
                    <span className="fileName">{file.name}</span>
                    <div className="videoIndicator">▶</div>
                  </div>
                ) : (
                  <div className="filePreview">
                    <FaFileAlt className="fileIcon" />
                    <span className="fileName">{file.name}</span>
                    <div className="fileExtension">{file.extension}</div>
                  </div>
                )}

                <div className="mediaOverlay">
                  {file.type === "image" && <FaImages />}
                  {file.type === "video" && <FaVideo />}
                  {file.type === "file" && <FaDownload />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: "#f8f9ff",
            borderRadius: 0,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            backgroundColor: "#f8f9ff",
          }}
        >
          {/* Navigation Buttons */}
          {filteredFiles.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#fff",
                  color: "#615dfa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  "&:hover": {
                    backgroundColor: "#eef0ff",
                  },
                  zIndex: 10,
                }}
              >
                <FaChevronLeft />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#fff",
                  color: "#615dfa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  "&:hover": {
                    backgroundColor: "#eef0ff",
                  },
                  zIndex: 10,
                }}
              >
                <FaChevronRight />
              </IconButton>
            </>
          )}

          {/* Close Button */}
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              backgroundColor: "#fff",
              color: "#615dfa",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "#eef0ff",
              },
              zIndex: 10,
            }}
          >
            ✕
          </IconButton>

          {/* Action Buttons */}
          <div
            style={{
              position: "absolute",
              right: 16,
              bottom: 16,
              display: "flex",
              gap: 8,
              zIndex: 10,
            }}
          >
            <Tooltip title="Open in new tab">
              <IconButton
                onClick={handleOpenInNewTab}
                sx={{
                  backgroundColor: "#fff",
                  color: "#615dfa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  "&:hover": {
                    backgroundColor: "#eef0ff",
                  },
                }}
              >
                <FaExternalLinkAlt />
              </IconButton>
            </Tooltip>
          </div>

          {/* File Counter */}
          {filteredFiles.length > 1 && (
            <div
              style={{
                position: "absolute",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#615dfa",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 500,
                zIndex: 10,
              }}
            >
              {selectedFileIndex + 1} / {filteredFiles.length}
            </div>
          )}

          {/* File Preview */}
          {selectedFile && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              {loading && selectedFile.type === "image" && (
                <CircularProgress
                  sx={{ color: "#615dfa", position: "absolute" }}
                />
              )}

              {selectedFile.type === "image" ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "75vh",
                    objectFit: "contain",
                    opacity: loading ? 0 : 1,
                    transition: "opacity 0.3s",
                    borderRadius: 12,
                    background: "#fff",
                  }}
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                />
              ) : selectedFile.type === "video" ? (
                <video
                  controls
                  autoPlay
                  style={{
                    maxWidth: "100%",
                    maxHeight: "75vh",
                    borderRadius: 12,
                  }}
                >
                  <source
                    src={selectedFile.url}
                    type={`video/${selectedFile.extension}`}
                  />
                </video>
              ) : (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: 40,
                    borderRadius: 12,
                    textAlign: "center",
                    maxWidth: 420,
                    width: "100%",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                  }}
                >
                  <FaFileAlt
                    style={{
                      fontSize: 52,
                      color: "#615dfa",
                      marginBottom: 16,
                    }}
                  />
                  <h4>{selectedFile.name}</h4>
                  <p style={{ color: "#777", marginBottom: 24 }}>
                    Preview not available. Download to view file.
                  </p>
                  <button
                    onClick={handleDownload}
                    style={{
                      backgroundColor: "#615dfa",
                      color: "#fff",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    Download File
                  </button>
                </div>
              )}
            </div>
          )}

          {/* File Info */}
          {selectedFile && (
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                backgroundColor: "#fff",
                color: "#333",
                padding: "8px 16px",
                borderRadius: 6,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                maxWidth: "50%",
              }}
            >
              <div style={{ fontWeight: 600 }}>{selectedFile.name}</div>
              <div style={{ fontSize: 12, color: "#777" }}>
                {selectedFile.extension.toUpperCase()} •{" "}
                {selectedFile.createdAt
                  ? new Date(selectedFile.createdAt).toLocaleDateString()
                  : ""}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="galleryOverlay" onClick={onClose} />
    </>
  );
};

export default MediaGallery;
