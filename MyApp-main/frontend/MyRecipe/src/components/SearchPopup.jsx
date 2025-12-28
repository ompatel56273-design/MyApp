import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/search.css";

const SearchPopup = ({ isOpenSe, setIsOpenSe }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const navigate = useNavigate();

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

  const fetchVideos = async (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/v1/videos?query=${q}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setResults(data.data || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);
    if (query.trim()) {
      const timeout = setTimeout(() => fetchVideos(query), 400);
      setTypingTimeout(timeout);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <>
      {isOpenSe && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={()=>setIsOpenSe(false)}
        />
      )}

      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: isOpenSe ? 0 : "-100%" }}
        transition={{ type: "tween", stiffness: 90 }}
        style={{
          position: "fixed",
          top: 0,
          left: "25%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "600px",
          backgroundColor: "#181818",
          padding: "15px 20px",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.5)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <button
            onClick={() => setIsOpenSe(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "#aaa",
              fontSize: "20px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            <FaTimes />
          </button>
          <input
            type="text"
            placeholder="Search videos, channels..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              padding: "10px 15px",
              borderRadius: "6px",
              border: "1px solid #333",
              backgroundColor: "#121212",
              color: "white",
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>

        {results.length > 0 && (
          <div
            className="scrollable-videos"
            style={{
              width: "100%",
              maxHeight: "350px",
              overflowY: "auto",
              borderTop: "1px solid #333",
              marginTop: "10px",
            }}
          >
            {results.map((v) => (
              <div
                key={v._id}
                onClick={() => {
                  navigate(`/watch/${v._id}`);
                  setIsOpenSe(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 0",
                  borderBottom: "1px solid #333",
                  cursor: "pointer",
                }}
              >
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  style={{
                    width: "100px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>
                    {v.title}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      color: "#aaa",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>{v.ownerDetails?.username}</span>
                    <span>•</span>
                    <span>{v.view} views</span>
                    <span>•</span>
                    <span>{v.createdAt ? timeAgo(v.createdAt) : ""}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <p style={{ color: "#aaa", marginTop: "10px" }}>No results found.</p>
        )}
      </motion.div>
    </>
  );
};

export default SearchPopup;
