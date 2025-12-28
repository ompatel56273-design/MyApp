import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ChannelVideos.css";

const ChannelVideos = ({uname}) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 2592000)}mo ago`;
  };

  useEffect(() => {
    const fetchChannelAndVideos = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/users/c/${uname}`, {
          credentials: "include",
        });
        const data = await res.json();
        setChannel(data.data);

        const vidRes = await fetch(
          `http://localhost:8000/api/v1/videos/user/${data.data._id}`,
          { credentials: "include" }
        );
        const vidData = await vidRes.json();
        setVideos(vidData.data || []);
      } catch (error) {
        console.error("Error loading channel videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelAndVideos();
  }, [uname]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <div className="channelVideosPage">
        {channel && (
          <div className="channelHeader">
            <img
              src={channel.avatar}
              alt={channel.username}
              className="channelAvatar"
            />
            <div>
              <h2>{channel.fullname || channel.fullName}</h2>
              <p>@{channel.username}</p>
              <span>
                {channel.subscribersCount || 0} subscribers • {videos.length} videos
              </span>
            </div>
          </div>
        )}

        <div className="videosGrid">
          {videos.length > 0 ? (
            videos.map((v) => (
              <div
                key={v._id}
                className="videoCard"
                onClick={() => navigate(`/watch/${v._id}`)}
              >
                <div className="thumbnailWrapper">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="videoThumbnail"
                  />
                  <span className="duration">
                    {v.duration
                      ? new Date(v.duration * 1000).toISOString().substr(14, 5)
                      : "00:00"}
                  </span>
                </div>
                <div className="videoInfo">
                  <h3 className="videoTitle">{v.title}</h3>
                  <p className="videoMeta">
                    {v.views || 0} views • {timeAgo(v.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="noVideos">No videos found </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChannelVideos;