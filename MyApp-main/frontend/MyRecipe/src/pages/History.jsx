import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { BsThreeDotsVertical } from "react-icons/bs";
import DeletePopUp from "../components/DeletePopUp";
import "../styles/Subscriprion.css";

const History = () => {
    const [history, setHistory] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

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

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/v1/users/history", {
                    credentials: "include",
                });
                const data = await res.json();
                setHistory(data.data || []);
            } catch (err) {
                console.error("History fetch error:", err);
            }
        };

        const fetchLiked = async () => {
            try {
                const res = await fetch(
                    "http://localhost:8000/api/v1/likes/user-liked/videos?page=1&limit=30",
                    { credentials: "include" }
                );
                const data = await res.json();
                console.log("liked", data.data)
                setLikedVideos(data.data || []);
            } catch (err) {
                console.error("Liked fetch error:", err);
            }
        };

        fetchHistory();
        fetchLiked();
    }, []);

    const formatDuration = (seconds) => {
        if (!seconds) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const timeAgo = (timestamp) => {
        if (!timestamp) return "";
        const now = new Date();
        const posted = new Date(timestamp);
        const diff = (now - posted) / 1000;

        if (diff < 60) return `${Math.floor(diff)} sec ago`;
        const mins = diff / 60;
        if (mins < 60) return `${Math.floor(mins)} min ago`;
        const hrs = mins / 60;
        if (hrs < 24) return `${Math.floor(hrs)} hour ago`;
        return `${Math.floor(hrs / 24)} days ago`;
    };

    return (
        <>
            <Navbar />

            <div
                style={{
                    background: "#000000ff",
                    color: "white",
                    padding: "20px",
                }}
            >
                <h2 style={{ marginTop: "0px" }}>History</h2>

                <div className="horizontal-scroll2">
                    {history.length > 0 ? (
                        history.map((item) => (
                            <div
                                key={item._id}
                                className="video-card2"
                            >

                                <img src={item.thumbnail} className="thumbnail2" onClick={() => navigate(`/watch/${item._id}`)} />
                                <span className="duration2">{formatDuration(item.duration)}</span>

                                <div className="details2">
                                    <div className="avatarCont">
                                        <img
                                            src={item.owner?.avatar}
                                            className="avatar2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/channel/${item.owner?.username}`);
                                            }}
                                        />
                                        <div className="userInfo">
                                            <div>
                                                <p className="title2" style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "20px", fontWeight: "500" }}>{item.title}</p>
                                            </div>
                                            <div className="metaRow">
                                                <p className="meta2">
                                                    {item.owner?.username} • {item.view} views • {timeAgo(item.createdAt)}
                                                </p>

                                                <BsThreeDotsVertical className="menu-icon2" size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: "#aaa" }}>No history yet</p>
                    )}
                </div>

                <h2 style={{ marginTop: "35px", marginBottom: "10px" }}>Liked Videos</h2>

                <div className="horizontal-scroll2">
                    {likedVideos.length > 0 ? (
                        likedVideos.map((item) => (
                            <div
                                key={item._id}
                                className="video-card2"
                            >

                                <img src={item.video.thumbnail} className="thumbnail2" onClick={() => navigate(`/watch/${item.video._id}`)} />
                                <span className="duration2">{formatDuration(item.video.duration)}</span>

                                <div className="details2">
                                    <div className="avatarCont">
                                        <img
                                            src={item.owner?.avatar}
                                            className="avatar2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/channel/${item.owner?.username}`);
                                            }}
                                        />
                                        <div className="userInfo">
                                            <div>
                                                <p className="title2" style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "20px", fontWeight: "500" }}>{item.video.title}</p>
                                            </div>
                                            <div className="metaRow">
                                                <p className="meta2">
                                                    {item.owner?.username} • {item.video.view} views • {timeAgo(item.video.createdAt)}
                                                </p>

                                                <BsThreeDotsVertical className="menu-icon2" size={18} />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: "#aaa" }}>No liked videos yet</p>
                    )}
                </div>
            </div>
            
        </>
    );
};

export default History;
