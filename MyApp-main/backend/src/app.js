import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

const app = express()
dotenv.config({
    path: './.env'
})

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"50kb"}))
app.use(cookieParser())
app.use(express.static("public"))

import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/vidoe.routes.js"
import subscriptionRouter from "./routes/subscrition.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/likes",likeRouter)


export {
    app
}