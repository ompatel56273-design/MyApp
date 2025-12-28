import React from 'react'
import "../styles/deletePopup.css";

const DeletePopUp = ({ show }) => {
   if (!show) return null;

  return (
    <div className="delete-overlay">
      <div className="delete-box">
        <p className="delete-text">Deleting...</p>

        <div className="progress-container">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default DeletePopUp;
