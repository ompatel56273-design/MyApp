import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utility";
import { useNavigate } from "react-router-dom";
import UploadPopup from "../components/UploadPopup";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { MdUpload } from "react-icons/md";

const Upload = () => {
  const navigate = useNavigate();

  const [uploadVideo, setUploadVideo] = useState({
    title: "",
    description: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [progress, setProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const progressInterval = useRef(null);
  const fileInputRef = useRef(null);

  const startFakeProgress = () => {
    let p = 0;
    setShowPopup(true);

    progressInterval.current = setInterval(() => {
      p += Math.random() * 2;
      if (p < 90) setProgress(p);
      else clearInterval(progressInterval.current);
    }, 200);
  };

  const finishProgress = () => {
    clearInterval(progressInterval.current);
    setProgress(100);

    setTimeout(() => {
      setShowPopup(false);
      setProgress(0);
    }, 700);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUploadVideo((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("video/"))
      return handleError("Invalid video");

    setVideoFile(file);
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/"))
      return handleError("Invalid thumbnail");

    setThumbnail(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return handleError("Select a video first!");

    startFakeProgress();

    const formData = new FormData();
    formData.append("videoUrl", videoFile);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("title", uploadVideo.title);
    formData.append("description", uploadVideo.description);

    try {
      await axios.post("http://localhost:8000/api/v1/videos/up", formData, {
        withCredentials: true,
      });

      handleSuccess("Upload Completed");
      finishProgress();

      setUploadVideo({ title: "", description: "" });
      setVideoFile(null);
      setThumbnail(null);
    } catch (err) {
      finishProgress();
      handleError("Failed to upload");
    }
  };

  return (
    <div style={styles.page}>
      <button
        onClick={() => navigate(-1)}
        style={styles.backBtn}
      >
        <FaArrowLeft size={26} />
      </button>

      <div style={styles.container} onClick={!videoFile ? () => fileInputRef.current.click() : null}>
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleVideo}
        />

        {!videoFile ? (
          <div style={styles.center}>
            <FaPlus size={50} color="#777" />
            <p>Click to Upload Video</p>
          </div>
        ) : (
          <div style={styles.previewBox}>
            <video
              controls
              style={{ width: "100%", height: "100%", borderRadius: "10px" }}
            >
              <source src={URL.createObjectURL(videoFile)} />
            </video>

            <button style={styles.removeBtn} onClick={() => setVideoFile(null)}>
              Remove
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Enter Title..."
          value={uploadVideo.title}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="description"
          placeholder="Enter Description..."
          value={uploadVideo.description}
          onChange={handleChange}
          style={styles.input}
        />

        <label htmlFor="thumb" style={styles.thumbnailLabel}>
          Choose Thumbnail
        </label>
        <input
          id="thumb"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleThumbnail}
        />

        <button type="submit" style={styles.uploadBtn}>
          <MdUpload size={25} /> Upload
        </button>
      </form>

      {showPopup && <UploadPopup progress={progress} />}

      <ToastContainer />
    </div>
  );
};

const styles = {
  page: {
    height: "100vh",
    background: "#000",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    top: "10px",
    left: "10px",
    border: "none",
    padding: "5px",
    background: "transparent",
    color: "gray",
    cursor: "pointer",
  },
  container: {
    width: "400px",
    height: "230px",
    background: "#202020",
    border: "2px dashed #555",
    borderRadius: "12px",
    marginTop: "70px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    overflow: "hidden",
  },

  center: { textAlign: "center" },

  previewBox: {
    width: "100%",
    height: "100%",
    position: "relative",
  },

  removeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  form: { marginTop: "20px", display: "flex", flexDirection: "column" },

  input: {
    width: "390px",
    background: "transparent",
    border: "2px solid #444",
    borderRadius: "5px",
    padding: "7px",
    color: "white",
    margin: "8px 0",
  },

  thumbnailLabel: {
    width: "380px",
    padding: "10px",
    border: "2px solid #444",
    color: "gray",
    textAlign: "center",
    cursor: "pointer",
  },

  uploadBtn: {
    background: "green",
    padding: "10px",
    width: "405px",
    borderRadius: "8px",
    marginTop: "12px",
    border: "none",
    color: "white",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
};

export default Upload;
