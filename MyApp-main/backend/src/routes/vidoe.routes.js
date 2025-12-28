import { Router } from "express"
import { upload } from "../middleware/multer.middleware.js"
import {
    deleteVideo,
    getAllVideos,
    getVidoeById,
    publishVideo,
    togglePublishStatus,
    updateVideo,
    getAllVideosByUserId,
    downloadVideos
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/").get(getAllVideos)
router.route("/user/:userId").get(verifyJWT,getAllVideosByUserId)
router.route("/up").post(verifyJWT, upload.fields([
        {
            name: "videoUrl",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        }
    ]),
        publishVideo
    )
router
    .route("/:videoId")
    .get(verifyJWT, getVidoeById)
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo)

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus)
router.route("/download/:videoId").get(verifyJWT,downloadVideos)
export default router