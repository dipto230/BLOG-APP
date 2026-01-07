import { CommentStatus, Post, postStatus } from "../../../generated/prisma/client";
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
  authorId,
  page,
  limit,
  skip,
  sortBy,
    sortOrder
}: {
    search: string | undefined,
        tags: string[] | [],
        isFeatured: boolean | undefined,
        status: postStatus | undefined,
    authorId: string | undefined,
    page: number,
    limit: number,
    skip: number,
    sortBy: string ,
    sortOrder: string 
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
    take: limit,
    skip,
    where: {
          AND: addConditions
    },
    orderBy:   {
      [sortBy]:sortOrder
    },
    include: {
      _count: {
        select:{comments:true}
      }
    }
  });
  const total = await prisma.post.count({
    where: {
      AND: addConditions
    }
  })

  return {
    data: allPost,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
};

const getPostById = async (postId:string) => {
  //console.log("get post by id")
  return await prisma.$transaction(async (tx) => {
       await tx.post.update({
    where: {
      id:postId
    },
    data: {
      views: {
        increment: 1
      }
    }
  })
  const postData = await tx.post.findUnique({
    where: {
      id:postId
    },
    include: {
      comments: {
        where: {
          parentId: null,
          status:CommentStatus.APPROVED
        },
        orderBy:{createdAt:"desc"},
        include: {
          replies: {
            where: {
              status:CommentStatus.APPROVED
            },
            orderBy:{createdAt:"asc"},
            include: {
              replies: {
                where: {
                  status:CommentStatus.APPROVED
                },
                orderBy:{createdAt:"asc"}
              }
            }
          }
        }
      },
      _count: {
        select:{comments:true}
      }
    }
  })
    return postData;
   })

}

const getMyPosts = async (authorId: string) => {
 await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status:"ACTIVE"
    },
    select: {
      id: true,
      status:true 
    }
  })

  const result = await prisma.post.findMany({
    where: {
         authorId
    },
    orderBy: {
      createdAt:"desc"
    },
    include: {
      _count: {
        select: {
          comments:true
        }
      }
    }
  })

  const total = await prisma.post.aggregate({
    _count: {
       id:true
    },
     where: {
      authorId
    }
  })
  return {
    data: result,
    total
  }
  
}

const updatePost = async (postId: string, data: Partial<Post>, authorId: string) => {
  // console.log({
  //   postId,
  //   data, authorId
  // })

  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id:postId
    },
    select: {
      id: true,
      authorId:true
    }
  })
  if (postData.authorId !== authorId) {
    throw new Error("you are not the creator of this post!")
  }
  const result = await prisma.post.update({
    where: {
      id:postData.id
    },
    data
  })
  return result
  
}

export const postService = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost
};