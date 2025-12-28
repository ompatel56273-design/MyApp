import mongoose, { Schema } from "mongoose";

const dislikeSchema = new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        videoId:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
    },
    {
        timestamps:true
    }
)

export const Dislike = mongoose.model("Dislike",dislikeSchema)