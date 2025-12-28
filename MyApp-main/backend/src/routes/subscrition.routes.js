import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { 
    toggleSubscription,
    getChannelSubscribers,
    isSubscribed,
    getSubscribedChannels
 } from "../controllers/subscriber.controller.js";

const router = Router();

router.route("/c/:channelId").post(verifyJWT, toggleSubscription);
router.route("/subscriber/:channelId").get(verifyJWT, getChannelSubscribers);
router.route("/is-subscribed/:channelId").get(verifyJWT, isSubscribed);
router.route("/subscribed-channels/:subscriberId").get(verifyJWT, getSubscribedChannels);

export default router;
