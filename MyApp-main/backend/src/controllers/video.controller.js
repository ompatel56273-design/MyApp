import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

  // Base match object
  const matchStage = {};

  if (userId) {
    matchStage.owner = new mongoose.Types.ObjectId(userId);
  }

  // Base aggregation pipeline
  const pipeline = [
    {
      $lookup: {
        from: "users", // ✅ correct collection name (plural)
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
  ];

  // Apply text search filter
  if (query) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { "ownerDetails.username": { $regex: query, $options: "i" } },
        ],
      },
    });
  }

  // Filter by user if provided
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // Sort + Pagination
  pipeline.push(
    { $sort: { [sortBy]: sortType === "desc" ? -1 : 1 } },
    { $skip: (page - 1) * parseInt(limit) },
    { $limit: parseInt(limit) }
  );

  // Project final fields (to include username & avatar)
  pipeline.push({
    $project: {
      _id: 1,
      title: 1,
      description: 1,
      videoUrl: 1,
      thumbnail: 1,
      view: "$view", // agar field ka naam 'view' hai
      createdAt: 1,
      duration: 1,
      "ownerDetails.username": 1,
      "ownerDetails.avatar": 1,
      "ownerDetails._id": 1,
    },
  });

  const videos = await Video.aggregate(pipeline);

  return res.status(200).json(
    new ApiResponse(
      200,
      videos,
      "Videos fetched successfully"
    )
  );
});


const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title && !description) {
    throw new ApiError(400, "title and descreption fileds are required")
  }
  let videoLocalPath;
  console.log('video:', req.files.videoUrl[0].path);
  videoLocalPath = req.files.videoUrl[0].path;
  let thumbnailLocalPath;
  if (req.files.thumbnail && req.files.thumbnail[0]?.path) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }
  if (!videoLocalPath) {
    throw new ApiError(400, "video is required")
  }
  const video = await uploadOnCloudinary(videoLocalPath)
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
  if (!video) {
    throw new ApiError(500, "something went wrong during uploading video")
  }
  console.log("FILES:", req.files, "BODY:", req.body);

  const createdVideo = await Video.create({
    videoUrl: video.url,
    description,
    title,
    thumbnail: thumbnail?.url || "",
    duration: video.duration,
    owner: req.user?._id
  })
  return res.status(201).json(
    new ApiResponse(201, createdVideo, "Video successfully uploded")
  )
})

const getVidoeById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!videoId) {
    throw new ApiError(404, "Video ID not found");
  }

  // 🔹 Step 1: Find the video and populate owner info
  const video = await Video.findById(videoId).populate("owner", "username avatar");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 🔹 Step 2: Update view count (only once per user)
  if (!video.viewedBy.includes(userId)) {
    video.view += 1;
    video.viewedBy.push(userId);
    await video.save();
  }

  // 🔹 Step 3: Add to user's watch history (if logged in)
  if (userId) {
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { watchHistory: new mongoose.Types.ObjectId(videoId) } // prevents duplicates
      },
      { new: true }
    );
  }

  // 🔹 Step 4: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched & view count updated successfully"));
});


const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  const { title, description } = req.body
  if (!title && !description) {
    throw new ApiError(400, "title or description are empty")
  }
  let thumbnailLocalPath;
  if (req.file?.path) {
    thumbnailLocalPath = req.file?.path
  }
  const video = await Video.findById(videoId)
  const publicId = await video?.thumbnail.split('/').pop().split('.')[0];
  await deleteOnCloudinary(publicId)
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
  const updatedVideo = await Video.findById(
    videoId,
    {
      title,
      description,
      thumbnail: thumbnail?.url || ""
    },
    {
      new: true
    }
  )
  return res.status(200)
    .json(
      200,
      { updatedVideo },
      "video updated successfully"
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const videoPublicId = video.videoUrl.split("/").slice(-1)[0].split(".")[0];
  const thumbnailPublicId = video.thumbnail.split("/").slice(-1)[0].split(".")[0];

  await deleteOnCloudinary(videoPublicId);        
  await deleteOnCloudinary(thumbnailPublicId);   

  await Video.findByIdAndDelete(videoId);

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Video successfully deleted!"
    )
  );
});


const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  const userId = req.user?._id
  const video = await Video.findById(videoId)
  if (!video) {
    throw new ApiError(403, "video are not found")
  }
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to update this video")
  }
  video.isPublished = !video.isPublished
  video.save()
  return res.status(200).json(200, {}, "Video publish status updated")
})
const getAllVideosByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const video = await Video.find({ owner: userId }).sort({ createdAt: -1 })
  return res.status(200).json(new ApiResponse(200, video, "Videos fetched successfully"))
})

const downloadVideos = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!video.videoUrl) {
    throw new ApiError(400, "Video file URL is missing");
  }

  let secureUrl = video.videoUrl.replace("http://", "https://");

  const downloadUrl = secureUrl.replace("/upload/", "/upload/fl_attachment/");

  return res
    .status(200)
    .json(new ApiResponse(200, { downloadUrl }, "Download link ready"));
})
export {
  getAllVideos,
  publishVideo,
  getVidoeById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllVideosByUserId,
  downloadVideos
}