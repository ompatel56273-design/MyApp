import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { videoId } = req.params;

    if (!content) throw new ApiError(400, "Comment content is required");

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
    });

    res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    );
})

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const comments = await Comment.find({ video: videoId })
        .populate("owner", "username avatar")
        .populate({
            path: "replies",
            populate: { path: "owner", select: "username avatar" },
        })
        .sort({ createdAt: -1 })
    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user._id
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(400, "Comment are not found")
    }
    const alreadyLiked = await comment.likes.includes(userId)
    if (alreadyLiked) {
        comment.likes.pull(userId);
    } else {
        comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json(
        new ApiResponse(200, { liked: !alreadyLiked }, alreadyLiked ? "Unliked" : "Liked")
    );
})

const addRelpyComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body
    const userId = req.user._id
    if (!content) {
        throw new ApiError(400, "Comment are required!")
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(400, "comment are not found")
    }
    const reply = await Comment.create({
        content,
        video: comment.video,
        owner: userId
    })
    comment.replies.push(reply._id)
    await comment.save()
    const populatedReply = await reply.populate({
        path: "owner",
        select: "username avatar",
    })
    return res.status(201).json(
        new ApiResponse(201, populatedReply, "Reply added successfully")
    )
})

const getReplies = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId)
        .populate({
            path: "replies",
            populate: { path: "owner", select: "username avatar" },
            options: { sort: { createdAt: -1 } },
        });

    if (!comment) throw new ApiError(404, "Comment not found");

    return res
        .status(200)
        .json(new ApiResponse(200, comment.replies, "Fetched replies successfully"));
});


export {
    addComment,
    getVideoComments,
    toggleCommentLike,
    addRelpyComment,
    getReplies
}