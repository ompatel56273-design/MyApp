import React from 'react'
import '../styles/watch.css'

const SidebarSkeleton = () => {
    return (
        <div>
            <h3 className="next-videos-title">Next Videos</h3>
            <div className="recommended-videos">
                <div className="video-card-skeleton"></div>
                <div className='into-container'>
                    <div className="video-card-avatar"></div>
                    <div className='title-cont'>
                        <div className="video-card-title"></div>
                        <div className="video-card-username"></div>
                    </div>
                </div>
                <div className="video-card-skeleton"></div>
                <div className='into-container'>
                    <div className="video-card-avatar"></div>
                    <div className='title-cont'>
                        <div className="video-card-title"></div>
                        <div className="video-card-username"></div>
                    </div>
                </div>
                <div className="video-card-skeleton"></div>
                <div className='into-container'>
                    <div className="video-card-avatar"></div>
                    <div className='title-cont'>
                        <div className="video-card-title"></div>
                        <div className="video-card-username"></div>
                    </div>
                </div>
                <div className="video-card-skeleton"></div>
                <div className='into-container'>
                    <div className="video-card-avatar"></div>
                    <div className='title-cont'>
                        <div className="video-card-title"></div>
                        <div className="video-card-username"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SidebarSkeleton
