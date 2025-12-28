import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion } from "framer-motion";
import VideoSkeleton from "./VideoSkeleton";
import { FiDownload, FiTrash2, FiSave, FiBookmark, FiEdit2 } from "react-icons/fi"
import MenuItem from "./MenuItem"
import { AiFillHome } from 'react-icons/ai'
import { MdOutlineSubscriptions, MdVideoLibrary, MdHistory, MdUpload } from 'react-icons/md'
import DeletePopUp from "./DeletePopUp";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const [popupMsg, setPopupMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const showPopup = (msg) => {
    setPopupMsg(msg);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };


  useEffect(() => {
    fetchVideos();
  }, []);

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


  const fetchVideos = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/videos?page=${page}&limit=9`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await res.json();
      const newVideos = result?.data || [];
      if (newVideos.length === 0) {
        setHasMore(false);
        return;
      }
      setVideos(prev => [...prev, ...newVideos]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

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

  return (
    <div style={{ padding: "1rem", background: "#000000ff", minHeight: "100vh", color: "#fff" }}>
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchVideos}
        hasMore={hasMore}
        loader={<VideoSkeleton />}
        endMessage={<p>All Videos loaded</p>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1rem", marginTop: "1rem" }}>
          {videos.map(item => (
            <div key={item._id} style={{ background: "#000000ff", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "relative", cursor: 'pointer' }}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  style={{ height: "220px", width: "100%", objectFit: "cover", borderRadius: "10px" }}
                  onClick={() => navigate(`/watch/${item._id}`)}
                />
                <div style={{ position: "absolute", bottom: "9px", right: "4px", padding: "2px 6px", borderRadius: "4px", background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "12px" }}>
                  {formatDuration(item.duration)}
                </div>
              </div>

              <div style={{ padding: "10px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <img src={item.ownerDetails.avatar} onClick={() => navigate(`/channel/${item.ownerDetails.username}`)} style={{ height: "45px", width: "45px", borderRadius: "50%", objectFit: "cover", cursor: 'pointer' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "20px", fontWeight: "500" }}>{item.title}</p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "6px", fontSize: "13px", color: "#aaa", flexWrap: "wrap" }}>
                        <span>{item.ownerDetails?.username}</span>
                        <span>•</span>
                        <span>{item.view} views</span>
                        <span>•</span>
                        <span>{item.createdAt ? timeAgo(item.createdAt) : ""}</span>
                      </div>

                      <div>
                        <BsThreeDotsVertical size={20} color="white" ref={buttonRef}
                          onClick={(e) => handleMenuClick(item._id, e)}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#2a2929ff"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          style={{ background: "transparent", border: "none", cursor: "pointer", borderRadius: "50%", padding: "10px" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      <DeletePopUp show={deleting} />

      {menuOpenId && (() => {
        const item = videos.find(v => v._id === menuOpenId);
        if (!item) return null; 
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
              <MenuItem text="Download" icon={<FiDownload size={18} color="#fff" />} onClick={() => handleDownload(item._id)} />

              {item.ownerDetails?._id === user?._id && (
                <>
                  <MenuItem text="Edit" icon={<FiEdit2 size={18} color="#fff" />} onClick={() => handleEdit(item._id)} />
                  <MenuItem text="Delete" icon={<FiTrash2 size={18} color="red" />} textColor="red" onClick={() => handleDelete(item._id)} />
                </>
              )}

            </motion.div>
          </>
        );
      })()}

    </div >
  );
};

export default Home;
