import React from "react";

const VideoSkeleton = () => {
  const skeletonItems = Array.from({ length: 8 });

  const shimmer = {
    background: `linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)`,
    backgroundSize: "400% 100%",
    animation: "shimmer 2.85s infinite",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1rem",
        marginTop: "1rem",
      }}
    >
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          style={{
            background: "#0f0f0f",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "220px",
              width: "100%",
              borderRadius: "10px",
              ...shimmer,
            }}
          ></div>

          <div style={{ padding: "10px", display: "flex", gap: "10px" }}>
            <div
              style={{
                height: "45px",
                width: "45px",
                borderRadius: "50%",
                flexShrink: 0,
                ...shimmer,
              }}
            ></div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: "16px",
                  width: "90%",
                  borderRadius: "4px",
                  marginBottom: "6px",
                  ...shimmer,
                }}
              ></div>
              <div
                style={{
                  height: "16px",
                  width: "70%",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  ...shimmer,
                }}
              ></div>

              <div
                style={{
                  height: "12px",
                  width: "60%",
                  borderRadius: "4px",
                  ...shimmer,
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}

      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -400px 0;
            }
            100% {
              background-position: 400px 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default VideoSkeleton;
