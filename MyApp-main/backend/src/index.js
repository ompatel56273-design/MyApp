import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose"
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})

const connectDB = async () => {
    try {
        const connectionInatance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`MongoDB connected ${process.env.DB_NAME} || DB HOST:${connectionInatance.connection.host}`)
    } catch (error) {
        console.log('MongoDb connection Failed...', error);
    }
}

connectDB()
    .then(() => {
        app.listen(process.env.PORT,() => {
            console.log(`server running on ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log('Mongo db connection faild...');
    })