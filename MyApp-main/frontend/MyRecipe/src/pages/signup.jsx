import React from 'react'
import { useState } from 'react'
import { ToastContainer } from "react-toastify"
import "../signup.css"
import { Link, useNavigate } from 'react-router-dom'
import { handleSuccess, handleUpdate, handleError } from '../utility'
import { FaUserCircle } from 'react-icons/fa'

const signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    email: '',
    username: '',
    fullname: '',
    password: '',
    avatar: ''
  })
  const [avatarUrl, setAvatarUrl] = useState(null)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      const avatar = URL.createObjectURL(files[0])
      setAvatarUrl(avatar)
      setSignupInfo({ ...signupInfo, [name]: files[0] })
    } else {
      setSignupInfo({ ...signupInfo, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { username, fullname, password, email } = signupInfo
    if (
      [username, fullname, password, email].some(item => item?.trim() === "")
    ) {
      handleError('some filed are missing')
    }
    if (!avatarUrl) {
      handleError('avatar are missing')
    }
    const formData = new FormData()
    formData.append("username", signupInfo.username)
    formData.append("fullname", signupInfo.fullname)
    formData.append("email", signupInfo.email)
    formData.append("password", signupInfo.password)
    formData.append("avatar", signupInfo.avatar)
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        body: formData,
        credentials: 'include',
      })
      const data = await res.json()
      console.log(data)
      const { success, message, createdUser, error } = data
      if (success) {
        handleSuccess(message)
        setTimeout(() => {
          navigate('/login')
        }, 1000);
      }
      else if (error) {
        const details = error?.details[0].message
        handleError(details)
      }
      else if (!success) {
        handleError(message)
      }

    } catch (error) {
      handleError(error)
    }
  }


  return (
    <div className="body"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100vh",
        background: "#1c1c1c",
        color:'white'
      }}>
      <div className='container'>
        <h2 style={{margin:"5px"}}>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div className="main">
            <div className='avatar'>
              <div className="profile" >
               {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: '100px', height: '100px', border: '2px solid gray', borderRadius: '50%' }} /> :<FaUserCircle size={100}/>} 
              </div>
            </div>
            <div className="btn">
              <label htmlFor='avatarFile' className='label' style={{color:'white',border:"2px solid white"}}>Avatar</label>
              <input type="file" name='avatar' accept='image/*' id='avatarFile' style={{ display: "none" }} onChange={handleChange} />
            </div>
            <div className="cont">
              <label htmlFor='email'>Email:</label>
              <input
                type="email"
                name="email"
                value={signupInfo.email}
                onChange={handleChange}
                placeholder='Enter your email'
                 style={{background:"transparent",border:'none',color:'white',width:"92%",borderRadius:"0px",borderBottom:"1px solid white",outline:"none"}}
              />
            </div>
            <div className="cont">
              <label htmlFor='fullname'>Fullname:</label>
              <input type="text"
                name="fullname"
                value={signupInfo.fullname}
                onChange={handleChange}
                placeholder='Fullname'
                style={{background:"transparent",border:'none',color:'white',width:"92%",borderRadius:"0px",borderBottom:"1px solid white",outline:"none"}}
              />
            </div>
            <div className='cont'>
              <label htmlFor='username'>Username:</label>
              <input type="text"
                name="username"
                value={signupInfo.username}
                placeholder='Username'
                onChange={handleChange}
               style={{background:"transparent",border:'none',color:'white',width:"92%",borderRadius:"0px",borderBottom:"1px solid white",outline:"none"}}
              />
            </div>
            <div className='cont'>
              <label htmlFor='password'>Password:</label>
              <input type="password"
                name="password"
                value={signupInfo.password}
                placeholder='Password'
                onChange={handleChange}
                 style={{background:"transparent",border:'none',color:'white',width:"92%",borderRadius:"0px",borderBottom:"1px solid white",outline:"none"}}
              />
            </div>
            <button type='submit' className='sbtn' style={{background:"linear-gradient(90deg, #ff8a00, #e52e71"}}>Signup</button>
            <span style={{margin:"auto",fontSize:"15px"}}>Already have an account ? &nbsp;
               <Link to='/login' style={{color:"blue"}}>Login</Link>
            </span>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div >
  )
}

export default signup
