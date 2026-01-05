import express, { Router } from 'express'
import { commentController } from './comment.controller';
import auth, { UserRole } from '../../middleware/auth';
const router = express.Router()

router.get(
    "/author/:authorId",
    commentController.getCommentsByAuthor
)
router.get(
    "/:commentId",
    commentController.getCommentById
)
router.post(
    "/",
    auth(UserRole.USER, UserRole.ADMIN),
    commentController.createComment
)

router.delete(
    "/:commentId",
    auth(UserRole.USER, UserRole.ADMIN),
    commentController.deleteComment

)

router.patch(
    "/:commentId",
    commentController.updateComment
)
export const CommentRouter: Router = router;