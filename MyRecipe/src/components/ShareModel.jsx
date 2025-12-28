import React from "react";
import { FaLink, FaWhatsapp, FaFacebook, FaXTwitter } from "react-icons/fa6";
import "../styles/share.css";

const ShareModal = ({ videoUrl, close }) => {
  const copyLink = () => {
    navigator.clipboard.writeText(videoUrl);
    alert("Link Copied!");
  };

  return (
    <div className="share-overlay" onClick={close}>
      <div
        className="share-box"
        onClick={(e) => e.stopPropagation()} 
      >
        <h3>Share</h3>

        <div className="share-options">
          <div className="share-item" onClick={copyLink}>
            <FaLink size={22} />
            <span>Copy Link</span>
          </div>

          <a
            className="share-item"
            href={`https://wa.me/?text=${encodeURIComponent(videoUrl)}`}
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp size={22} color="#25D366" />
            <span>WhatsApp</span>
          </a>

          <a
            className="share-item"
            href={`https://www.facebook.com/sharer/sharer.php?u=${videoUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebook size={22} color="#4267B2" />
            <span>Facebook</span>
          </a>

          <a
            className="share-item"
            href={`https://twitter.com/intent/tweet?url=${videoUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            <FaXTwitter size={22} />
            <span>Twitter</span>
          </a>
        </div>

        <button className="close-btn" onClick={close}>Close</button>
      </div>
    </div>
  );
};

export default ShareModal;
