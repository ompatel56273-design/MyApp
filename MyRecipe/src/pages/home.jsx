import React, { useState, useEffect } from 'react'
import Navbar from '../components/navbar'
import { useAuth } from '../context/authContext'
import Video from '../components/Video.jsx'
import InfiniteScroll from 'react-infinite-scroll-component'

const home = () => {
 

  return (
    <div>
      <Navbar/>
      <Video/>
    </div>
  )
}

export default home
