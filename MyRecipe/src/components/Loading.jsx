import { animate } from 'framer-motion'
import React from 'react'

const Loading = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  )
}
const styles = {
    container:{
        height:"100vh",
        display:"flex",
        flexDirection:'center',
        justifyContent:"center",
        alignItems:"center",
        gap:"10px",
        background:"#0f0f0f",
        color:"#fff",
        fontSize:"18px",
        fontWeight:"500"
    },
    spinner:{
        width:"40px",
        height:"40px",
        border:"6px solid #ddd",
        borderTop:"6px solid #007bff",
        borderRadius:"50%",
        animation:"spin 1s linear infinite"
    }
}
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  "@keyframes spin{ 0% {transform:rotate(0deg)}100%{transform: rotate(360deg)}}",
  styleSheet.cssRules.length
)
export default Loading
