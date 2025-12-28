import React from 'react'
import { useAuth } from '../context/authContext'
import Navbar from '../components/navbar'

const Profile = () => {
  const { user } = useAuth()
  return (
    <div style={{ background: "#202020", height: '100vh', width: "100vw", color: "white", margin: '0', padding: '0px' }}>
      <Navbar />
      <div style={{
        padding: "20px",
        display: 'flex',
        alignItems: 'center',
        gap: "20px",
      }}>
        <img src={user.avatar} alt="avatar" style={{
          width: "150px",
          height: '150px',
          borderRadius: "50%",
          display: "block",
          border: "1px solid gray",
          objectFit: "cover",
        }} />
        <div>
          <h1 style={{ }}>{user.username}</h1>
          <p style={{ color: "gray" }}>{user.email}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
