import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id; 
  const { channelId } = req.params;

  if (subscriberId.toString() === channelId.toString()) {
    return res.status(400).json({ success: false, message: "Cannot subscribe to yourself" });
  }

  const existing = await Subscription.findOne({ subscriber: subscriberId, channel: channelId });

  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, subscribed: false });
  } else {
    await Subscription.create({ subscriber: subscriberId, channel: channelId });
    return res.json({ success: true, subscribed: true });
  }
});

const isSubscribed = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;
  const { channelId } = req.params;

  const subscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { subscribed: !!subscription },
      "Subscription status fetched successfully"
    )
  );
});



const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id")
  }
  const subscriber = await Subscription.find({ channel: channelId }).populate("subscriber", "username email avatar")
  return res.json(new ApiResponse(200, subscriber, "Subscribers fetched successfully"))
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber id")
  }
  const subscriberbedChannels = await Subscription.find({ subscriber: subscriberId }).populate("channel", "username fullname avatar")
  const totalSubscribedChannels = await Subscription.countDocuments({ subscriber: subscriberId })
  return res.json(
    new ApiResponse(
      200,
      { channels: subscriberbedChannels, total: totalSubscribedChannels },
      "Subscribed channels fetched successfully"
    )
  )
})

export {
  toggleSubscription,
  getChannelSubscribers,
  isSubscribed,
  getSubscribedChannels
}