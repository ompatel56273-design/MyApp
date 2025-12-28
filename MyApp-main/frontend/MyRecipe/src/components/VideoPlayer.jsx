import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPause, FaExpand, FaCompress, } from "react-icons/fa";
import { FaCog } from "react-icons/fa"; 
import "../styles/youtubePlayer.css";

const YouTubePlayer = ({ src }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [speedMenu, setSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [overlay, setOverlay] = useState(null);
  const [tooltipTime, setTooltipTime] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(0);
  const [bufferedWidth, setBufferedWidth] = useState(0);
  const [playOverlay, setPlayOverlay] = useState(null); 


  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
      setPlayOverlay({ type: "pause", text: "||" });
    } else {
      video.play();
      setPlayOverlay({ type: "play", text: "▶" });
    }
    setIsPlaying(!isPlaying);

    setTimeout(() => setPlayOverlay(null), 400);
  };


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  const formatTime = (time) => {
    if (!time) return "00:00";
    const hrs = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = Math.floor(time % 60);
    return hrs > 0
      ? `${hrs}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
      : `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const video = videoRef.current;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBufferedWidth((bufferedEnd / video.duration) * 100);
      }
    };
    const setDur = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", setDur);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", setDur);
    };
  }, []);

  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => setShowControls(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  const handleDoubleClick = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    if (clickX < rect.width / 2) {
      video.currentTime = Math.max(video.currentTime - 10, 0);
      setOverlay({ type: "backward", text: "« 10s" });
    } else {
      video.currentTime = Math.min(video.currentTime + 10, video.duration);
      setOverlay({ type: "forward", text: "10s »" });
    }

    setTimeout(() => setOverlay(null), 600);
  };


  const handleSeekbar = (e) => {
    const video = videoRef.current;
    const newTime = (e.target.value / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleSeekHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    const time = (percent / 100) * duration;
    setTooltipTime(formatTime(time));
    setTooltipPos(percent);
  };

  return (
    <div
      ref={containerRef}
      className="videoContainer"
      onMouseMove={() => setShowControls(true)}
      style={{ position: "relative", width: "100%", maxWidth: "800px", aspectRatio: "16/9", background: "#0f0f0f", borderRadius: "10px", overflow: "hidden" }}
    >
      <video
        ref={videoRef}
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
        onClick={togglePlay}
        onDoubleClick={handleDoubleClick}
      />
      <AnimatePresence>
        {playOverlay && (
          <motion.div
            key={playOverlay.text}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: "42%",
              left: "48%",
              transform: "translate(-75%, -60%)",
              fontSize: "50px",
              color: "white",
              fontWeight: "bold",
              pointerEvents: "none",
            }}
          >
            {playOverlay.text}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {overlay && (
          <motion.div
            key={overlay.text}
            initial={{
              opacity: 0,
              x: overlay.type === "forward" ? 10 : overlay.type === "backward" ? -10 : 0,
              scale: 1,
            }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: overlay.type === "forward" ? 10 : overlay.type === "backward" ? -10 : 0,
              scale: 1,
            }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute",
              top: "40%",
              left: overlay.type === "forward" ? "58%" : overlay.type === "backward" ? "10%" : "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "40px",
              color: "white",
              fontWeight: "bold",
              background: "rgba(0, 0, 0, 0)",
              padding: "10px 30px",
              borderRadius: "10px",
              pointerEvents: "none",
            }}
          >
            {overlay.text}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", bottom: 0, width: "100%", background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))", padding: "10px", display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <div className="seekbar-container" onMouseMove={handleSeekHover}>
              <div className="buffered" style={{ width: `${bufferedWidth}%` }}></div>
              <div className="played" style={{ width: `${progress}%` }}></div>
              <input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeekbar} className="seekbar-input" />
              {tooltipTime && <div className="seekbar-tooltip" style={{ left: `${tooltipPos}%` }}>{tooltipTime}</div>}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", width: "98%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={togglePlay} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
                  {isPlaying ? <FaPause size={25} /> : <FaPlay size={25} />}
                </button>
                <span style={{ fontSize: "14px" }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
                <button onClick={() => setSpeedMenu(!speedMenu)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}><FaCog size={20} /></button>
                {speedMenu && (
                  <div style={{ position: "absolute", bottom: "40px", background: "rgba(0,0,0,0.8)", borderRadius: "5px", padding: "5px", right: 0 }}>
                    {[0.5, 1, 1.25, 1.5, 2].map(rate => (
                      <div key={rate} onClick={() => { videoRef.current.playbackRate = rate; setPlaybackRate(rate); setSpeedMenu(false) }} style={{ padding: "5px 10px", cursor: "pointer", background: rate === playbackRate ? "rgba(255,255,255,0.2)" : "transparent" }}>{rate}x</div>
                    ))}
                  </div>
                )}
                <button onClick={toggleFullscreen} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
                  {isFullscreen ? <FaCompress size={22} /> : <FaExpand size={22} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
};

export default YouTubePlayer;
