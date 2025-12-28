import { useState } from 'react'
import { Route, Router, Routes, Navigate } from 'react-router-dom'
import Signup from './pages/signup'
import Login from './pages/login'
import Home from './pages/home'
import { AuthProvider } from './context/authContext'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import Upload from './pages/Upload'
import Loading from './components/Loading'
import Watch from './pages/Watch'
import ChannelProfile from './components/channelProfile'
import './styles/All.css'
import Navbar from './components/navbar'
import SubscriptionPage from './components/SubscriptionPage'
import History from './pages/History'
import ChannelVideos from "./pages/ChannelVideos"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='App'>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Navigate to='/login' />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/home' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/loading' element={<Loading />} />
            <Route path='/upload' element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path='/watch/:videoId' element={<Watch />} />
            <Route path='/channel/:uname' element={<ChannelProfile />} />
            <Route path='/subscriptions' element={<SubscriptionPage />} />
            <Route path='/history' element={<History />} />
            <Route path="/user/:userId" element={<ChannelVideos />} />
            <Route path='*' element={<h1>404 Not Found</h1>} />
          </Routes>
        </AuthProvider>
      </div>
    </>
  )
}

export default App
