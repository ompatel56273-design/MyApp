import React from 'react'
import { useState } from 'react'
import { ToastContainer } from "react-toastify"
import "../signup.css"
import { Link, useNavigate } from 'react-router-dom'
import { handleSuccess, handleUpdate, handleError } from '../utility'
import { useAuth } from '../context/authContext'

const login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginInfo({ ...loginInfo, [name]: value })
    console.log(name, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { password, email } = loginInfo
    if (
      [password, email].some(item => item?.trim() === "")
    ) {
      handleError('some filed are missing')
    }
    const formData = new FormData()
    formData.append("email", loginInfo.email)
    formData.append("password", loginInfo.password)
    try {
      const data = await login(loginInfo.email, loginInfo.password)
      const { success, message, error } = data
      if (success) {
        handleSuccess(message)
        setTimeout(() => {
          navigate('/home')
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
      <div className='container' style={{maxWidth:"300px"}}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="main">
            <div className="cont">
              <label htmlFor='email'>Email:</label>
              <input
                type="email"
                name="email"
                value={loginInfo.email}
                onChange={handleChange}
                placeholder='Enter your email'
               style={{background:"transparent",border:'none',color:'white',width:"92%",borderRadius:"0px",borderBottom:"1px solid white",outline:"none"}}
              />
            </div>
            <div className='cont'>
              <label htmlFor='password'>Password:</label>
              <input type="password"
                name="password"
                value={loginInfo.password}
                placeholder='Password'
                onChange={handleChange}
               style={{background:"transparent",border:'none',color:'white',width:"92%",borderRadius:"0px",borderBottom:"1px solid white",outline:"none"}}
              />
            </div>
            <button type='submit' className='sbtn' style={{background:"linear-gradient(90deg, #ff8a00, #e52e71"}}>Login</button>
            <span style={{margin:"auto",fontSize:"15px"}}>does't have an account ?&nbsp;
              <Link to='/signup' style={{color:'blue'}}>register</Link>
            </span>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}

export default login
