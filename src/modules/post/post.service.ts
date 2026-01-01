import { Post, postStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPost = async ({
    search,
    tags,
    isFeatured,
    status,
    authorId
}: {
    search: string | undefined,
        tags: string[] | [],
        isFeatured: boolean | undefined,
        status: postStatus | undefined,
    authorId: string | undefined
}) => {
    const addConditions:PostWhereInput[] = []
    if (search) {
        addConditions.push({
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              tags: {
                has: search,
              },
            },
          ],
        },)
    }
  //console.log("Get all Post")
    //console.log("SEARCH VALUE:", payload.search, typeof payload.search);
    
    if (tags.length > 0) {
        addConditions.push( {
          tags: {
            hasEvery: tags as string[],
          },
        },)
    }

    if (typeof isFeatured === 'boolean') {
        addConditions.push({
            isFeatured
        })
    }
    if (status) {
        addConditions.push({
            status
        })
    }
    if (authorId) {
        addConditions.push({
            authorId
        })
    }

  const allPost = await prisma.post.findMany({
    where: {
          AND: addConditions
    },
  });

  return allPost;
};

export const postService = {
  createPost,
  getAllPost,
};
