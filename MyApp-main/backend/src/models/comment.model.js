import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: [true, "Comment content is required"],
            trim: true,
            minlength: [1, "Comment cannot be empty"],
        },

        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: [true, "Video reference is required"],
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment", // reply bhi ek comment hi hoti hai
            },
        ],
    },
    {
        timestamps: true
    }
)

commentSchema.plugin(mongooseAggregatePaginate)

commentSchema.virtual("likesCount").get(function (){
    return this.likes.length
})

commentSchema.virtual("repliesCount").get(function (){
    return this.replies.length
})

export const Comment = mongoose.model("Comment", commentSchema)