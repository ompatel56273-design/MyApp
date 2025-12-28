import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postImageSchema = new Schema(
    {
        imageUrl:{
            type:String,
            required:true
        },
        caption:{
            type:String,
            required:true
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        timestamps:true
    }
)

postImageSchema.plugin(mongooseAggregatePaginate)

export const PostImg = mongoose.model("PostImg",postImageSchema)