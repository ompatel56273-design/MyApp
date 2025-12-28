import { useState, React } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from './sidebar'
import { AiOutlineSearch } from "react-icons/ai"
import { FaBars } from 'react-icons/fa'
import '../index.css'
import { useAuth } from '../context/authContext'
import { Navigate } from 'react-router-dom'
import SearchPopup from './SearchPopup'
import { FiYoutube, FiSearch } from 'react-icons/fi'

const sidebar = () => {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenSe, setIsOpenSe] = useState(false)
    const navigate = useNavigate()
    const handleAvatarClick = (uname) => {
        navigate(`/channel/${uname}`)
    }
    return (
        <div>
            <nav
                style={{
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'space-between',
                    padding: '10px 20px',
                    backgroundColor: '#000000ff',
                    color: 'white',
                    borderBottom: '1px solid #333',
                    top: '0',
                    zIndex: '1000',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => setIsOpen(!isOpen)} style={{
                        fontSize: '21px',
                        color: 'white',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: "5px 6px",
                        borderRadius: '6px'
                    }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#333")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                        <FaBars />
                    </button>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <FiYoutube size={30} color={"red"} />
                        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>YouTube</h1>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    <div>
                        <FiSearch size={25} style={{
                            borderRadius: '50%',
                            border: 'none',
                            background: '#000000ff',
                            color: 'white',
                            padding:"7px",
                            cursor: "pointer"
                        }}
                            onClick={() => setIsOpenSe(!isOpenSe)}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#333")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")} />
                    </div>
                    <img src={user.avatar} alt="User" style={{
                        borderRadius: '50%',
                        height: '40px',
                        width: '40px',
                        margin: '0px',
                        cursor: 'pointer',
                        objectFit: 'cover',
                    }} onClick={() => handleAvatarClick(user.username)} />
                </div>
                <SearchPopup
                    isOpenSe={isOpenSe}
                    setIsOpenSe={setIsOpenSe}
                />
            </nav >
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div >

    )
}

export default sidebar
