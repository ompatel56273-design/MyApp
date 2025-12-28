import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import Navbar from "./navbar";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import "../styles/channelProfile.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion } from "framer-motion";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { FiDownload, FiTrash2, FiSave, FiBookmark, FiEdit2 } from "react-icons/fi";
import { handleSuccess, handleError } from "../utility";
import { ToastContainer } from "react-toastify";
import About from "./About";
import Playlist from "./Playlist";
import MenuItem from "./MenuItem";
import DeletePopUp from "./DeletePopUp";

const ChannelProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { uname } = useParams();
  const buttonRef = useRef(null);
  const avatarRef = useRef(null);
  const coverRef = useRef(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [showControls, setShowControls] = useState(false);
  const [showCoverControls, setShowCoverControls] = useState(false)
  const [deleting, setDeleting] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    avatar: ''
  })
  const [coverInfo, setCoverInfo] = useState({
    coverImage: ''
  })

  const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hrs > 0
      ? `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMenuClick = (videoId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    console.log(rect)
    setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setMenuOpenId(menuOpenId === videoId ? null : videoId);
  };

  const handleAvatarUpdate = () => {
    avatarRef.current.click()
  }

  const handleCoverUpdate = () => {
    coverRef.current.click()
  }

  const handleEdit = (videoId) => navigate(`/edit/${videoId}`);
  const handleDelete = async (videoId) => {
    setDeleting(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/videos/${videoId}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        setDeleting(false);
        return;
      }

      setVideos(prev => prev.filter(v => v._id !== videoId));

      setMenuOpenId(null);

    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setTimeout(() => setDeleting(false), 800);
    }
  };
  const handleSave = (videoId) => console.log("Saved video", videoId);

  const handleDownload = async (videoId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/videos/download/${videoId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to get download link");

      const downloadUrl = data.data.downloadUrl;

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSignupInfo({ avatar: file });

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:8000/api/v1/users/update-avatar", {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      const { success, message, error } = data;

      if (success) {
        handleSuccess(message);

        setUserProfile((prev) => ({
          ...prev,
          avatar: URL.createObjectURL(file),
        }));
      } else {
        handleError(error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      handleError("Avatar upload failed");
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      return;
    }
    setCoverInfo({ coverImage: file })
    const formData = new FormData()
    formData.append("coverImage", file)
    try {
      const res = await fetch('http://localhost:8000/api/v1/users/update-coverImage', {
        method: "PATCH",
        body: formData,
        credentials: "include"
      })
      const data = await res.json()
      const { message, success, error } = data
      if (success) {
        handleSuccess(message);

        setUserProfile((prev) => ({
          ...prev,
          coverImage: URL.createObjectURL(file),
        }));
      } else {
        handleError(error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Avatar upload failed:", err);
      handleError("Avatar upload failed");
    }
  }

  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const posted = new Date(timestamp);
    const seconds = Math.floor((now - posted) / 1000);
    if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);

        const res = await fetch(`http://localhost:8000/api/v1/users/c/${uname}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
        const data = await res.json();
        setUserProfile(data.data);
        console.log("userProfile::", data.data)
        const videoRes = await fetch(
          `http://localhost:8000/api/v1/videos/user/${data.data._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (videoRes.ok) {
          const videoData = await videoRes.json();
          console.log("videoProfile::", videoData.data)
          setVideos(videoData.data || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [uname]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!userProfile?._id) return;
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/subscriptions/is-subscribed/${userProfile._id}`,
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        setSubscribed(data.data.subscribed);
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

    checkSubscription();
  }, [userProfile?._id]);

  const handleSubscribe = async () => {
    if (!userProfile?._id) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/subscriptions/c/${userProfile._id}`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json();

      if (data.success) {
        setSubscribed(data.data.subscribed);
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  if (loading || !userProfile) return <Loading />;

  return (
    <div className="channel-page">
      <Navbar />

      <div className="channel-cover"
        onMouseEnter={() => setShowCoverControls(true)}
        onMouseLeave={() => setShowCoverControls(false)}
        style={{ position: "relative" }}>
        <img
          src={
            userProfile.coverImage ||
            userProfile.avatar
          }
          alt="Channel Cover"
        />
        {user && user._id === userProfile._id && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={showCoverControls ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              position: "absolute",
              bottom: '5px',
              right: '5px',
              background: "#000000b0",
              borderRadius: "50%",
              padding: '8px',
              cursor: "pointer"
            }}
            onClick={() => handleCoverUpdate()}
          >
            <FiEdit2 size={18} color="#fff" />
            <input type="file" name="coverImage" ref={coverRef} style={{ display: "none" }} accept='image/*' id="cid" onChange={handleCoverChange} />
          </motion.div>
        )}
      </div>

      <div className="channel-info">
        <div className="channel-avatar"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          style={{ position: "relative", height: '100px', width: '100px' }}
        >
          {userProfile.avatar ? (
            <img src={userProfile.avatar} alt="Channel Avatar" />
          ) : (
            <FaUserCircle size={100} color="#ccc" />
          )}
          {user && user._id === userProfile._id && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={showControls ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                position: "absolute",
                bottom: '5px',
                right: '5px',
                background: "#000000b0",
                borderRadius: "50%",
                padding: '8px',
                cursor: "pointer"
              }}
              onClick={() => handleAvatarUpdate()}
            >
              <FiEdit2 size={18} color="#fff" />
              <input type="file" name="avatar" ref={avatarRef} style={{ display: "none" }} accept='image/*' id="avatarId" onChange={handleChange} />
            </motion.div>
          )}
        </div>

        <div className="channel-details">
          <h2 className="channel-name">
            {userProfile.fullname || userProfile.fullName}
          </h2>
          <p className="channel-username">@{userProfile.username}</p>
          <p className="channel-stats">
            {userProfile.subscribersCount || 0} subscribers • {videos.length} videos
          </p>
        </div>

        {
          user && user._id !== userProfile._id && (
            <button className="subscribe-btn"
              onClick={() => handleSubscribe()}
              style={{
                background: subscribed ? "#333" : "red",
                color: "white",
                border: "none",
                fontWeight: "bold",
                borderRadius: "20px",
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              {subscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          )
        }
      </div>

      <div className="channel-tabs">
        <button
          className={`tab ${activeTab === "videos" ? "active" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </button>
        <button
          className={`tab ${activeTab === "playlists" ? "active" : ""}`}
          onClick={() => setActiveTab("playlists")}
        >
          Playlists
        </button>
        <button
          className={`tab ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          About
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "videos" && <div className="video-grid">
          {videos && videos.length > 0 ? (
            videos.map(item => (
              <div key={item._id} style={{ background: "#0f0f0f", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "relative", cursor: 'pointer' }}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ height: "180px", width: "100%", objectFit: "cover", borderRadius: "10px" }}
                    onClick={() => navigate(`/watch/${item._id}`)}
                  />
                  <div style={{ position: "absolute", bottom: "9px", right: "4px", padding: "2px 6px", borderRadius: "4px", background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "12px" }}>
                    {formatDuration(item.duration)}
                  </div>
                </div>

                <div style={{ padding: "10px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "20px", fontWeight: "500" }}>{item.title}</p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "6px", fontSize: "13px", color: "#aaa", flexWrap: "wrap" }}>

                          <span>{item.view} views</span>
                          <span>•</span>
                          <span>{item.createdAt ? timeAgo(item.createdAt) : ""}</span>
                        </div>

                        <div>
                          <BsThreeDotsVertical size={20} color="white" ref={buttonRef}
                            onClick={(e) => handleMenuClick(item._id, e)}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#333"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                            style={{ background: "transparent", border: "none", cursor: "pointer", borderRadius: "50%", padding: '7px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-videos">No videos uploaded yet</p>
          )}
        </div>}
        {
          activeTab === "playlists" && <Playlist />
        }
        {
          activeTab === "about" && <About />
        }
      </div>
      <DeletePopUp show={deleting} />
      {menuOpenId && (() => {
        const item = videos.find(v => v._id === menuOpenId);

        return (
          <>
            <div
              onClick={(e) => handleMenuClick(item._id, e)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'transparent',
                zIndex: 900
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: "absolute",
                top: menuPosition.top,
                left: menuPosition.left - 160,
                background: "#282828",
                borderRadius: "10px",
                width: "200px",
                padding: "6px 0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                zIndex: 1000,
                overflow: "hidden",
              }}
            >

              <MenuItem text="Save" icon={<FiBookmark size={18} color="#fff" />} onClick={handleSave} />

              <MenuItem
                text="Download"
                icon={<FiDownload size={18} color="#fff" />}
                onClick={() => handleDownload(item._id)}
              />
              {item.owner === user?._id && (
                <>
                  <MenuItem text="Edit" icon={<FiEdit2 size={18} color="#fff" />} onClick={() => handleEdit(item._id)} />
                  <MenuItem text="Delete" icon={<FiTrash2 size={18} color="red" />} textColor="red" onClick={() => handleDelete(item._id)} />
                </>
              )}

            </motion.div>
          </>
        );
      })()}

      <ToastContainer />
    </div>
  );
};

export default ChannelProfile;
