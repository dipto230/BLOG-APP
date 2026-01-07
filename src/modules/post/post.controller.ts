import { Request, Response } from "express";
import { postService } from "./post.service";
import { postStatus } from "../../../generated/prisma/enums";
import paginationAndSortingHelper from "../../helpers/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const result = await postService.createPost(req.body, user.id as string)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
    }
}

const getAllPost = async (req:Request, res:Response) => {
    try {
        const { search } = req.query
        //console.log("Search value",search)
        const searchString = typeof search === 'string' ? search : undefined
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
          // true or false
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined
       
        const status = req.query.status as postStatus | undefined
        const authorId = req.query.authorId as string | undefined
        // const page = Number(req.query.page ?? 1)
        // const limit = Number(req.query.limit ?? 10)
        // const skip = (page - 1) * limit
        // const sortBy = req.query.sortBy as string | undefined
        // const sortOrder = req.query.sortOrder as string | undefined
        const {page,limit,skip,sortBy,sortOrder} = paginationAndSortingHelper(req.query)
        // console.log("options:",options)
        const result = await postService.getAllPost({ search: searchString, tags,isFeatured, status, authorId, page,limit,skip, sortBy, sortOrder })
        
        res.status(200).json(result)
        
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details:e
            
        })
    }
}

const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        //console.log({postId})
        if (!postId) {
            throw new Error("Post ID is required");
        }
        const result = await postService.getPostById(postId)
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details:e
            
        })
    }
}

const getMyPosts = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            throw new Error ("you are trying to access from unauthorized ")
        }
        console.log("user data", user)
        const result = await postService.getMyPosts(user.id);
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "failed to retrieve your post",
            details:e
        })
        
    }
}


const updatePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("you are not authorized")
        }
        const { postId } = req.params;
        const result = await postService.updatePost(postId as string, req.body, user.id);
        res.status(200).json(result)
        
    } catch (e) {
        res.status(400).json({
            error: "failed to edit your post",
            details:e
        })
    }
}

export const PostController = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatePost
}