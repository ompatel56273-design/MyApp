import React from 'react'

const MenuItem = ({ text, icon, textColor = "#fff", onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        cursor: "pointer",
        color: textColor,
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#3a3a3a"; 
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {icon}
      {text}
    </div>
  );
}

export default MenuItem
