"use server";


import Mux from "@mux/mux-node";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

import { Prisma, PrismaClient, Video } from "@/generated";
import { getUser } from "@/lib/auth/auth-session";
import { inputSchema, videoIdSchema } from "@/lib/zod";
import { VideoWithUser } from "@/types";


const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const prisma = new PrismaClient();

export async function createVideo() {

    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const userId = user.id;

    try {
        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policy: ["public"],
                input: [{ generated_subtitles: [{ language_code: "en", name: "English" }] }],
            },
            cors_origin: "*", // In production, set this to your domain
        });

        const video = await prisma.video.create({
            data: {
                userId,
                title: "Untitled",
                muxStatus: "waiting",
                muxUploadId: upload.id,
            },
        });

        return { video, url: upload.url };
    } catch (error) {
        console.error("Error creating video:", error);
        throw new Error("Failed to create video");
    }
}

export async function getUserVideos({
    page = 1,
    pageSize = 9,
}: {
    page?: number;
    pageSize?: number;
}) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const skip = (page - 1) * pageSize;

    try {
        const [videos, total] = await Promise.all([
            prisma.video.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: "desc" },
                skip,
                take: pageSize,
                // Optionally include related data:
                // include: { category: true, user: true },
            }),
            prisma.video.count({
                where: { userId: user.id },
            }),
        ]);

        const hasMore = skip + videos.length < total;

        return {
            videos,
            hasMore,
        };
    } catch (error) {
        console.error("Error fetching videos:", error);
        throw new Error("Failed to fetch videos");
    }
}

export async function updateVideo(
    videoId: string,
    data: {
        title: string;
        description: string;
        visibility: "public" | "private";
        categoryId?: string;
    }
) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        // Validate categoryId if provided
        if (data.categoryId) {
            const categoryExists = await prisma.category.findUnique({
                where: { id: data.categoryId },
            });

            if (!categoryExists) {
                throw new Error("Invalid categoryId");
            }
        }

        const video = await prisma.video.update({
            where: { id: videoId, userId: user.id },
            data: {
                title: data.title,
                description: data.description,
                visibility: data.visibility,
                categoryId: data.categoryId || null, // Allow unsetting
            },
        });

        return video;
    } catch (error) {
        console.error("Error updating video:", error);
        throw new Error("Unable to update video");
    }
}

export async function removeVideo(videoId: string) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        const video = await prisma.video.delete({
            where: { id: videoId, userId: user.id },
        });
        return video;
    } catch (error) {
        console.error("Error deleting video:", error);
        throw new Error("Unable to delete video");
    }
}

export async function updateVideoThumbnail(videoId: string, thumbnailUrl: string) {
    try {
        await prisma.video.update({
            where: { id: videoId },
            data: { thumbnailUrl },
        });
    } catch (error) {
        console.error("Failed to update video thumbnail:", error);
        throw new Error("Failed to update video thumbnail");
    }
}

export async function getVideoById(videoId: string): Promise<VideoWithUser | null> {

    if (!videoId) {
        throw new Error("Video ID is missing");
    }

    try {
        const video = await prisma.video.findUnique({
            where: { id: videoId },
            include: {
                user: true,
                likes: true,
                dislikes: true,
                _count: true,
            },
        });

        if (!video) {
            throw new Error("Video not found");
        }

        return video;
    } catch (error) {
        console.error("Error fetching video:", error);
        throw new Error("Failed to fetch video");
    }
}

export async function restoreThumbnail(formData: FormData): Promise<Video> {
    const parsed = inputSchema.safeParse({
        id: formData.get("id"),
    });

    if (!parsed.success) {
        throw new Error("Invalid input");
    }

    const { id } = parsed.data;
    const user = await getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const existingVideo = await prisma.video.findFirst({
        where: {
            id,
            userId: user.id,
        },
    });

    if (!existingVideo) {
        throw new Error("Video not found");
    }

    // Delete existing thumbnail if it exists
    if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();
        await utapi.deleteFiles(existingVideo.thumbnailKey);

        await prisma.video.update({
            where: {
                id: existingVideo.id,
            },
            data: {
                thumbnailKey: null,
                thumbnailUrl: null,
            },
        });
    }

    if (!existingVideo.muxPlaybackId) {
        throw new Error("Missing Mux playback ID");
    }

    const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;

    const utapi = new UTApi();
    const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

    if (!uploadedThumbnail.data) {
        throw new Error("Thumbnail upload failed");
    }

    const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;

    const updatedVideo = await prisma.video.update({
        where: {
            id: existingVideo.id,
        },
        data: {
            thumbnailKey,
            thumbnailUrl,
        },
    });
    revalidatePath(`/video/${existingVideo.id}`);

    return updatedVideo;
}




export async function fetchVideos({
  query,
  page = 1,
  pageSize = 9,
  categorySlug,
  orderBy = "newest",
  user = false,
  isPrivate = false,
  isLiked = false,
  isHistory = false,
}: {
  query?: string;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  orderBy?: "newest" | "oldest" | "popular";
  user?: boolean;
  isPrivate?: boolean;
  isLiked?: boolean;
  isHistory?: boolean;
}) {
  const skip = (page - 1) * pageSize;

  // Auth is only needed if filtering by user, likes, or history
  const currentUser = (user || isLiked || isHistory) ? await getUser() : null;
  if ((user || isLiked || isHistory) && !currentUser) {
    throw new Error("User not authenticated");
  }

  // Setup order clause
  const orderClause: Prisma.VideoOrderByWithRelationInput =
    orderBy === "oldest"
      ? { createdAt: "asc" }
      : orderBy === "popular"
      ? { videoViews: "desc" }
      : { createdAt: "desc" };

  // CASE 1 — Fetch from watch history
  if (isHistory) {
    const historyWhere: Prisma.WatchHistoryWhereInput = {
      userId: currentUser!.id,
      video: {
        ...(query && {
          title: { contains: query, mode: Prisma.QueryMode.insensitive },
        }),
        ...(categorySlug && {
          category: { slug: categorySlug },
        }),
        ...(isLiked && {
          likes: { some: { userId: currentUser!.id } },
        }),
        ...(user
          ? {  visibility: isPrivate ? "private" : "public" }
          : { visibility: "public" }),
      },
    };

    const [watchHistory, total] = await Promise.all([
      prisma.watchHistory.findMany({
        where: historyWhere,
        orderBy: { lastWatchedAt: "desc" },
        skip,
        take: pageSize,
        include: {
          video: {
            include: {
              user: true,
              category: true,
            },
          },
        },
      }),
      prisma.watchHistory.count({ where: historyWhere }),
    ]);

    const videos = watchHistory.map((entry) => entry.video);
    const hasMore = skip + videos.length < total;
    return { videos, hasMore };
  }

  // CASE 2 — Regular video fetch
  const videoWhere: Prisma.VideoWhereInput = {
    ...(query && {
      title: { contains: query, mode: Prisma.QueryMode.insensitive },
    }),
    ...(categorySlug && {
      category: { slug: categorySlug },
    }),
    ...(user && {
      userId: currentUser!.id,
      visibility: isPrivate ? "private" : "public",
    }),
    ...(!user && { visibility: "public" }),
    ...(isLiked && {
      likes: { some: { userId: currentUser!.id } },
    }),
  };

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where: videoWhere,
      orderBy: orderClause,
      skip,
      take: pageSize,
      include: {
        user: true,
        category: true,
      },
    }),
    prisma.video.count({ where: videoWhere }),
  ]);

  const hasMore = skip + videos.length < total;
  return { videos, hasMore };
}



export async function likeVideoAction(videoId: string) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const userId = user.id;

    const existingLike = await prisma.like.findUnique({
        where: {
            userId_videoId: {
                userId,
                videoId,
            },
        },
    });

    const existingDislike = await prisma.dislike.findUnique({
        where: {
            userId_videoId: {
                userId,
                videoId,
            },
        },
    });

    // Toggle like
    if (existingLike) {
        await prisma.like.delete({
            where: { userId_videoId: { userId, videoId } },
        });
    } else {
        if (existingDislike) {
            await prisma.dislike.delete({
                where: { userId_videoId: { userId, videoId } },
            });
        }
        await prisma.like.create({
            data: { userId, videoId },
        });
    }
    revalidatePath(`/video/${videoId}`);
}

export async function dislikeVideoAction(videoId: string) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const userId = user.id;

    const existingDislike = await prisma.dislike.findUnique({
        where: {
            userId_videoId: {
                userId,
                videoId,
            },
        },
    });

    const existingLike = await prisma.like.findUnique({
        where: {
            userId_videoId: {
                userId,
                videoId,
            },
        },
    });

    // Toggle dislike
    if (existingDislike) {
        await prisma.dislike.delete({
            where: { userId_videoId: { userId, videoId } },
        });
    } else {
        if (existingLike) {
            await prisma.like.delete({
                where: { userId_videoId: { userId, videoId } },
            });
        }
        await prisma.dislike.create({
            data: { userId, videoId },
        });
    }

    revalidatePath(`/video/${videoId}`);
}

/***************************/

export const incrementVideoView = async (videoId: string) => {
    const parsed = videoIdSchema.safeParse(videoId);

    if (!parsed.success) {
        console.error("Invalid videoId:", parsed.error.format());
        throw new Error("Invalid video ID");
    }

    try {
        const updatedVideo = await prisma.video.update({
            where: {
                id: parsed.data,
            },
            data: {
                videoViews: {
                    increment: 1,
                },
            },
        });

        revalidatePath("/videos"); // Or more specific: `/videos/${videoId}`
        return updatedVideo;
    } catch (error) {
        console.error("Error incrementing video views:", error);
        throw new Error("Failed to increment video views");
    }
};

export const updateWatchHistory = async (
    videoId: string,
    watchedDuration: number,
    progressPercentage: number,
    completed: boolean
) => {

    const currentUser = await getUser();
    if (!currentUser) {
        throw new Error("Unauthorized");
    }


    await prisma.watchHistory.upsert({
        where: {
            userId_videoId: {
                userId: currentUser.id, // handle auth context
                videoId,
            },
        },
        update: {
            watchedDuration,
            progressPercentage,
            completed,
        },
        create: {
            userId: currentUser.id,
            videoId,
            watchedDuration,
            progressPercentage,
            completed,
        },
    });
};
