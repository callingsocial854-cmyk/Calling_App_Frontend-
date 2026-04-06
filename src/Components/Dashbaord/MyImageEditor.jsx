import React, { useEffect, useRef } from "react";
import ImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";

const MyImageEditor = ({ imageUrl, onComplete, onCancel }) => {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  // Initialize editor
  useEffect(() => {
    if (editorRef.current) {
      instanceRef.current = new ImageEditor(editorRef.current, {
        includeUI: {
          loadImage: {
            path: imageUrl,
            name: "UploadedImage",
          },
          menu: ["crop", "rotate", "draw", "shape", "text", "filter"],
          initMenu: "crop",
          uiSize: {
            width: "100%",
            height: "700px",
          },
          menuBarPosition: "bottom",
        },
        cssMaxWidth: 700,
        cssMaxHeight: 500,
        usageStatistics: false,
      });
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
      }
    };
  }, [imageUrl]);

  // Return edited image
  const handleDone = () => {
    if (instanceRef.current) {
      const dataURL = instanceRef.current.toDataURL();
      onComplete(dataURL);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div ref={editorRef}></div>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            background: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleDone}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Save Edited Image
        </button>
      </div>
    </div>
  );
};

export default MyImageEditor;