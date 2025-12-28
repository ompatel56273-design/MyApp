import React from "react";

const UploadPopup = ({ progress }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3 style={{ marginBottom: "10px" }}>Uploading… {Math.round(progress)}%</h3>

        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backdropFilter: "blur(4px)",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  popup: {
    width: "350px",
    padding: "20px",
    background: "#1e1e1e",
    borderRadius: "14px",
    boxShadow: "0 0 25px rgba(0,0,0,0.6)",
    border: "1px solid #444",
    textAlign: "center",
  },

  progressBar: {
    width: "100%",
    height: "10px",
    background: "#333",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "10px",
  },

  progressFill: {
    height: "100%",
    background: "limegreen",
    transition: "width 0.25s linear",
  },
};

export default UploadPopup;
