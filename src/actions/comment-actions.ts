"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth/auth-session";
import { PrismaClient } from "@/lib/generated/prisma";
import { commentSchema } from "@/lib/zod";


const prisma = new PrismaClient();


export async function getCommentsByVideoId(videoId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        videoId: videoId,
        parentId: null, // only top-level comments
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        user: true,
        commentLikes: true,
        commentDislikes: true,
        _count: {
          select: {
            commentLikes: true,
            commentDislikes: true,
          },
        },
        replies: {
          include: {
            user: true,
            commentLikes: true,
            commentDislikes: true,
            _count: {
              select: {
                commentLikes: true,
                commentDislikes: true,
              },
            },
            replies: { // second level nesting (can be expanded further if needed)
              include: {
                user: true,
                commentLikes: true,
                commentDislikes: true,
                _count: {
                  select: {
                    commentLikes: true,
                    commentDislikes: true,
                  },
                },
                replies: true, // stop nesting further here to avoid infinite loop
              },
            },
          },
        },
      },
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}

export async function addComment(videoId: string, content: string, parentId?: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }


  const parsed = commentSchema.safeParse({ videoId, content, parentId });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input");
  }

  const { videoId: validVideoId, content: validContent, parentId: validParentId } = parsed.data;

  const newComment = await prisma.comment.create({
    data: {
      content: validContent,
      videoId: validVideoId,
      parentId: validParentId,
      userId: user.id,
    },
  });

  revalidatePath(`/videos/${videoId}`);
  return newComment;
}
// actions/comments-actions.ts
export async function deleteComment(commentId: string) {
  const user = await getUser(); // Get the currently logged-in user

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch the comment to ensure the user is the owner
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { replies: true }, // Include child comments
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  // Check if the current user is the owner of the comment
  if (comment.userId !== user.id) {
    throw new Error("You can only delete your own comments");
  }

  try {
    // Recursively delete child comments first
    await deleteChildComments(comment.id);

    // Then delete the parent comment
    await prisma.comment.delete({
      where: { id: comment.id },
    });

    revalidatePath(`/videos/${comment.videoId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// Helper function to delete child comments recursively
async function deleteChildComments(parentId: string) {
  const replies = await prisma.comment.findMany({
    where: { parentId },
  });

  for (const reply of replies) {
    await deleteChildComments(reply.id); // Recursively delete replies
    await prisma.comment.delete({
      where: { id: reply.id },
    });
  }
}


export async function likeCommentAction(commentId: string, videoId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  const existingDislike = await prisma.commentDislike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (existingLike) {
    await prisma.commentLike.delete({
      where: { userId_commentId: { userId, commentId } },
    });


  } else {
    if (existingDislike) {
      await prisma.commentDislike.delete({
        where: { userId_commentId: { userId, commentId } },
      });
    }
    await prisma.commentLike.create({
      data: { userId, commentId },
    });


  }
  revalidatePath(`/videos/${videoId}`);

}

export async function dislikeCommentAction(commentId: string, videoId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;

  const existingDislike = await prisma.commentDislike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (existingDislike) {
    await prisma.commentDislike.delete({
      where: { userId_commentId: { userId, commentId } },
    });
  } else {
    if (existingLike) {
      await prisma.commentLike.delete({
        where: { userId_commentId: { userId, commentId } },
      });


    }
    await prisma.commentDislike.create({
      data: { userId, commentId },
    });

  }

  revalidatePath(`/videos/${videoId}`);

}





