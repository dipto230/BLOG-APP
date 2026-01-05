
import { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const createComment = async (payload: {
    content: string,
    authorId: string,
    postId: string,
    parentId?:string
}) => {
    // console.log("create comment service",payload);
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id:payload.postId
        }
    })
    if (payload.parentId) {
        const parentData = await prisma.comment.findUniqueOrThrow({
            where: {
                id:payload.parentId
            }
        })
    }
    return await prisma.comment.create({
        data: {
      ...payload,
      updatedAt: new Date(), 
    },
    })
}

const getCommentById = async (id: string) => {
    //console.log("comment id:", commentId)
    return await prisma.comment.findUnique({
        where: {
            id
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views:true
                }
            }
        }
    })
}

const getCommentsByAuthor = async (authorId:string) => {
    //console.log(authorId)
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                select: {
                    id: true,
                    title:true
                }
            }
        }
    })
}

const deleteComment = async (commentId:string, authorId:string) => {
    //console.log({commentId, authorId})
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id:true
        }
    })
    if (!commentData) {
        throw new Error("Your provided data is invalid")
    }
    //console.log(commentData)
    return await prisma.comment.delete({
        where: {
            id: commentData.id
            
        }
    })
}

const updateComment = async (commentId:string, data:{content?:string, status?:CommentStatus}, authorId:string) => {
    //console.log({commentId,data,authorId})
      const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id:true
        }
    })
    if (!commentData) {
        throw new Error("Your provided data is invalid")
    }
    return await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    })
}

export const commentService = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment 
}