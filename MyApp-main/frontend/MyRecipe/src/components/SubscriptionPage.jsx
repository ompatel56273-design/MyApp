import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/Subscription.css";
import Navbar from "./navbar";
import ChannelVideos from "../pages/ChannelVideos";

const SubscriptionPage = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/subscriptions/subscribed-channels/${user?._id}`,
          { method: "GET", credentials: "include" }
        );

        const data = await res.json();
        setSubscriptions(data.data.channels[1].channel|| []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };
    if (user?._id) fetchSubscriptions();
  }, [user?._id]);
  
  console.log("njdsbjk",subscriptions.username)
  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#000",
          height: "100vh",
          width: "100vw",
          padding: 0,
          margin: 0,
        }}
      >
        <div
          style={{
            background: "#000",
            height: "25vh",
            width: "100vw",
            borderBottom: "1px solid #333",
          }}
        >
          {subscriptions.length > 0 && (
            <ul
              className="contsub"
              style={{
                listStyle: "none",
                margin: 0,
                display: "flex",
                overflowX: "auto",
                overflowY: "hidden",
                gap: "10px",
              }}
            >
              {subscriptions.map((item) =>
                item.channel ? (
                  <li key={item._id}>
                    <Link
                      to={`/user/${item.username}`} 
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#333")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      style={{
                        color: "white",
                        textDecoration: "none",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        flexDirection: "column",
                        padding: "10px",
                        margin: "10px",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={item.avatar}
                        alt={item.username}
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <span>{item.username}</span>
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          )}
          <ChannelVideos uname={subscriptions.username}/>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;