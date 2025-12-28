import {
    addComment,
    addRelpyComment,
    getReplies,
    getVideoComments,
    toggleCommentLike
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { Router } from "express"

const router = Router()

router.route("/add-comment/:videoId").post(verifyJWT, addComment)
router.route("/:videoId").get(verifyJWT, getVideoComments)
router.route("/:commentId").post(verifyJWT, toggleCommentLike)
router.route("/reply/:commentId").post(verifyJWT, addRelpyComment)
router.route("/reply/:commentId").get(verifyJWT,getReplies)

export default router