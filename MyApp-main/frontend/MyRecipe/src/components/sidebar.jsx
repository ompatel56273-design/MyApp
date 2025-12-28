import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AiFillHome } from 'react-icons/ai'
import { MdOutlineSubscriptions, MdVideoLibrary, MdHistory, MdUpload } from 'react-icons/md'
import { useAuth } from '../context/authContext'
import { FiLogOut, FiYoutube, FiX } from 'react-icons/fi'
import '../styles/subscription.css'
import { Navigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom';

const categories = [
    { name: 'Home', path: "/home", icon: <AiFillHome size={22} /> },
    { name: 'subscriptions', path: "/subscriptions", icon: <MdOutlineSubscriptions size={22} /> },
    { name: 'History', path: "/history", icon: <MdHistory size={22} /> },
    { name: 'Library', path: "/library", icon: <MdVideoLibrary size={22} /> },
    { name: 'Upload', path: '/upload', icon: <MdUpload size={22} /> },
]

const sidebar = ({ isOpen, setIsOpen }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate()
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/api/v1/subscriptions/subscribed-channels/${user?._id}`,
                    { method: "GET", credentials: "include" }
                );
                const data = await res.json();
                console.log("data:", data.data.channels);
                setSubscriptions(data.data.channels || []);
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            }
        };

        if (user?._id) fetchSubscriptions();
    }, [user?._id]);

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        zIndex: "1000",
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
                />
            )}
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: isOpen ? 0 : "-100%" }}
                transition={{ type: 'tween', stiffness: 90 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: '240px',
                    backgroundColor: '#000000ff',
                    color: 'white',
                    padding: '20px',
                    zIndex: 1000
                }}
            >
                <div className='logo'
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px"
                        }}
                    >
                        <FiYoutube size={25} color='red' />
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            margin: "0px",
                        }}>YouTube</h2>
                    </div>
                    <FiX size={20} color='white'
                        onClick={() => setIsOpen(false)}
                        style={{
                            color: 'white',
                            backgroundColor: "transparent",
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: "7px",
                            borderRadius: '50%'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#333")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    />
                </div>
                <div className="sep" style={{ height: "2px", background: "gray", width: "100%" }}></div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: "10px" }}>
                    {categories.map((item) => (
                        <li key={item.name} className='navig' style={{ marginBottom: '15px' }}>

                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive ? "nav-item active" : "nav-item"
                                }
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>

                        </li>
                    ))}

                    {user && (
                        <li>
                            <NavLink
                                to="/login"
                                className="nav-item"
                                onClick={() => logout()}
                            >
                                <FiLogOut size={22} />
                                <span>Logout</span>
                            </NavLink>
                        </li>
                    )}
                </ul>

                <h2 style={{
                    borderTop: '1px solid #333',
                    fontSize: '20px',
                    marginTop: '8px',
                    fontWeight: 'bold',
                    marginBottom: '26px',
                    padding: '10px 0px 10px',
                    borderBottom: '1px solid #333',
                }}>Subscription</h2>
                {subscriptions.length > 0 && (
                    <ul className='contsub' style={{ listStyle: 'none', padding: "10px", border: "1px solid #333", height: "120px", overflowY: "auto", borderRadius: "6px" }}>

                        {subscriptions.map((item) => (
                            item.channel ? (
                                <li key={item._id}>
                                    <Link
                                        to={`/channel/${item.channel.username}`}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "#333")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        style={{ color: 'white', textDecoration: 'none', display: 'flex', gap: '10px', alignItems: 'center', padding: '5px', borderRadius: "6px" }}
                                    >
                                        <img
                                            src={item.channel.avatar}
                                            alt={item.channel.username}
                                            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: "cover" }}
                                        />
                                        <span>{item.channel.username}</span>
                                    </Link>
                                </li>
                            ) : null
                        ))}
                    </ul>
                )}
                {user && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            height: "45px",
                            background: "#000000ff",
                            width: "220px",
                            position: "absolute",
                            bottom: "40px",
                            left: 0,
                            padding: "2px 30px",
                            cursor: "pointer"
                        }}
                        onClick={() => {
                            setTimeout(() => {
                                navigate(`/channel/${user.username}`)
                            }, 1000);
                        }}
                    >
                        <img src={user.avatar} about={"user"}
                            style={{
                                height: "35px",
                                width: "35px",
                                border: "none",
                                objectFit: "cover",
                                borderRadius: "50%"
                            }}
                        />
                        <h3 style={{ margin: "0", color: "white" }}>{user.fullname}</h3>
                    </div>
                )}

            </motion.div >
        </>
    )
}

export default sidebar
