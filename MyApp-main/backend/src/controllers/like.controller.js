import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
    } else {
        await Like.create({ video: videoId, likedBy: userId });
    }

    const result = await Like.aggregate([
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        {
            $group: {
                _id: "$video",
                totalLikes: { $sum: 1 },
                likedUsers: { $addToSet: "$likedBy" },
            },
        },
        {
            $addFields: {
                isLiked: { $in: [userId, "$likedUsers"] },
            },
        },
        {
            $project: {
                _id: 0,
                totalLikes: 1,
                isLiked: 1,
            },
        },
    ]);

    const likeData = result[0] || { totalLikes: 0, isLiked: false };

    res.status(200).json(
        new ApiResponse(
            200,
            likeData,
            existingLike ? "Unliked successfully" : "Liked successfully"
        )
    );
});

const getVideoLikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    const result = await Like.aggregate([
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        {
            $group: {
                _id: "$video",
                totalLikes: { $sum: 1 },
                likedUsers: { $addToSet: "$likedBy" },
            },
        },
    ]);

    const totalLikes = result.length > 0 ? result[0].totalLikes : 0;
    const likedUsers = result.length > 0 ? result[0].likedUsers : [];

    const isLiked = likedUsers.some(
        (id) => id.toString() === userId.toString()
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { totalLikes, isLiked }, "Like info fetched"));
});

const getUserLikedVideos = asyncHandler(async (req,res) => {
    let { page=1,limit=10} = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const skip = (page-1)*limit
    const userId = req.user?._id
    const getVideos = await Like.aggregate([
        {
            $match:{
                likedBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
           $sort:{createdAt:-1}
        },
        {
            $skip:skip
        },
        {
            $limit:limit
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:'_id',
                as:"video"
            }
        },
        {
            $unwind:"$video"
        },
        {
            $lookup:{
                from:"users",
                localField:"video.owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            avatar:1,
                            username:1,
                            fullname:1
                        }
                    }
                ]
            }
        },
        {$addFields:{owner:{$first:"$owner"}}},
        {
            $project:{
                video:1,
                owner:1,
                likedAt:"$createdAt"
            }
        }
    ])
    return res.status(200).json(
        new ApiResponse(
            200,
            getVideos,
            "User liked videos are fetched successfully"
        )
    )
})

export {
    toggleVideoLike,
    getVideoLikes,
    getUserLikedVideos
};
