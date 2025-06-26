"use server";


import Mux from "@mux/mux-node";
import { revalidatePath, revalidateTag } from "next/cache";
import { UTApi } from "uploadthing/server";


import { getUser } from "@/lib/auth/auth-session";
// import { Prisma } from "@/lib/generated/prisma";
import { NotificationType, NotifyLevel, Prisma, PrismaClient, Video } from "@/lib/generated/prisma";
import { inputSchema, videoIdSchema } from "@/lib/zod";
import { VideoWithUser } from "@/types";


const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const prisma = new PrismaClient();

export async function createVideo(channelId: string) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        // Validate that the channel belongs to the authenticated user
        const channel = await prisma.channel.findFirst({
            where: {
                id: channelId,
                userId: user.id,
            },
        });

        if (!channel) {
            throw new Error("Invalid channel");
        }

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: user.id,
                playback_policy: ["public"],
                input: [{ generated_subtitles: [{ language_code: "en", name: "English" }] }],
            },
            cors_origin: "*", // Set this to your actual domain in production
        });

        const video = await prisma.video.create({
            data: {
                title: "Untitled",
                muxStatus: "waiting",
                muxUploadId: upload.id,
                userId: user.id,
                channelId: channel.id,
            },
        });

        await createNotificationsForNewVideo(
            video.id,
            video.channelId,
            `${user.name || "Someone"} uploaded a new video: ${video.title}`
        );

        return { video, url: upload.url };
    } catch (error) {
        console.error("Error creating video:", error);
        throw new Error("Failed to create video");
    }
}

// export async function getUserVideos({
//     page = 1,
//     pageSize = 9,
// }: {
//     page?: number;
//     pageSize?: number;
// }) {
//     const user = await getUser();
//     if (!user) {
//         throw new Error("Unauthorized");
//     }

//     const skip = (page - 1) * pageSize;

//     try {
//         const [videos, total] = await Promise.all([
//             prisma.video.findMany({
//                 where: { userId: user.id },
//                 orderBy: { createdAt: "desc" },
//                 skip,
//                 take: pageSize,
//                 // Optionally include related data:
//                 // include: { category: true, user: true },
//             }),
//             prisma.video.count({
//                 where: { userId: user.id },
//             }),
//         ]);

//         const hasMore = skip + videos.length < total;

//         return {
//             videos,
//             hasMore,
//         };
//     } catch (error) {
//         console.error("Error fetching videos:", error);
//         throw new Error("Failed to fetch videos");
//     }
// }


export async function getVideoById(
    videoId: string
): Promise<VideoWithUser & { subscription: boolean; notifyLevel?: "ALL" | "PERSONALIZED" | "NONE" } | null> {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    if (!videoId) {
        throw new Error("Video ID is missing");
    }

    const currentUserId = user.id;

    try {
        const video = await prisma.video.findUnique({
            where: { id: videoId },
            include: {
                channel: {
                    include: {
                        user: true,
                    },
                },
                likes: true,
                dislikes: true,
                _count: true,
            },
        });

        if (!video) {
            throw new Error("Video not found");
        }

        let isSubscribed = false;
        let notifyLevel: "ALL" | "PERSONALIZED" | "NONE" | undefined;

        const subscription = await prisma.subscription.findUnique({
            where: {
                userId_channelId: {
                    userId: currentUserId,
                    channelId: video.channelId,
                },
            },
        });

        if (subscription) {
            isSubscribed = true;
            notifyLevel = subscription.notifyLevel;
        }

        return {
            ...video,
            subscription: isSubscribed,
            notifyLevel,
        };
    } catch (error) {
        console.error("Error fetching video:", error);
        throw new Error("Failed to fetch video");
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






export async function fetchVideos({
    query,
    page = 1,
    pageSize = 9,
    categorySlug,
    orderBy = "newest",
    liked = false, // ← NEW
}: {
    query?: string;
    page?: number;
    pageSize?: number;
    categorySlug?: string;
    orderBy?: "newest" | "oldest" | "popular";
    liked?: boolean; // ← NEW

}): Promise<{ videos: Video[]; hasMore: boolean }> {
    const skip = (page - 1) * pageSize;

    // verify user is authenticated
    const user = await getUser();
    if (!user && liked) {
        throw new Error("Unauthorized");
    }


    const orderClause: Prisma.VideoOrderByWithRelationInput =
        orderBy === "oldest"
            ? { createdAt: "asc" }
            : orderBy === "popular"
                ? { videoViews: "desc" }
                : { createdAt: "desc" };

    const where: Prisma.VideoWhereInput = {
        ...(query && { title: { contains: query, mode: "insensitive" } }),
        ...(categorySlug && { category: { slug: categorySlug } }),
        ...(liked && user && {
            likes: {
                some: { userId: user.id },
            },
        }),

    };

    const [videos, total] = await Promise.all([
        prisma.video.findMany({
            where,
            orderBy: orderClause,
            skip,
            take: pageSize,
            include: { channel: true, category: true },
        }),
        prisma.video.count({ where }),
    ]);

    return {
        videos,
        hasMore: skip + videos.length < total,
    };
}

export async function fetchChannelVideos({
    query,
    page = 1,
    pageSize = 9,
    categorySlug,
    orderBy = "newest",
    channelId,       // adjust your input type accordingly
}: {
    query?: string;
    page?: number;
    pageSize?: number;
    categorySlug?: string;
    orderBy?: "newest" | "oldest" | "popular";
    channelId?: string;
}): Promise<{ videos: Video[]; hasMore: boolean }> {

    // verify user is authenticated
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    if (!channelId) {
        throw new Error("Channel ID is required");
    }
    // user.id must be egal to channel.userId
    const channel = await prisma.channel.findUnique({
        where: { id: channelId, userId: user.id },
    });
    if (!channel) {
        throw new Error("Channel not found or does not belong to the user");
    }

    const skip = (page - 1) * pageSize;

    const orderClause: Prisma.VideoOrderByWithRelationInput =
        orderBy === "oldest"
            ? { createdAt: "asc" }
            : orderBy === "popular"
                ? { videoViews: "desc" }
                : { createdAt: "desc" };

    const where: Prisma.VideoWhereInput = {
        ...(query && { title: { contains: query, mode: "insensitive" } }),
        ...(categorySlug && { category: { slug: categorySlug } }),
        ...(channelId && {
            channel: { id: channelId },
        }),
        ...(channelId && {
            channel: { userId: user.id },
        }),

    };

    const [videos, total] = await Promise.all([
        prisma.video.findMany({
            where,
            orderBy: orderClause,
            skip,
            take: pageSize,
            include: { channel: true, category: true },
        }),
        prisma.video.count({ where }),
    ]);

    return {
        videos,
        hasMore: skip + videos.length < total,
    };
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




export async function getSubscriptionStatus(videoId: string) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const userId = user.id;

    const video = await prisma.video.findUnique({
        where: { id: videoId },
        select: { channelId: true },
    });

    if (!video) {
        throw new Error("Video not found");
    }

    const subscription = await prisma.subscription.findUnique({
        where: {
            userId_channelId: {
                userId: userId,
                channelId: video.channelId,
            },
        },
    });

    return { isSubscribed: !!subscription };
}

// Toggle subscription for the viewer and creator
export async function toggleSubscription(channelId: string) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    const userId = user.id;

    const existingSubscription = await prisma.subscription.findUnique({
        where: {
            userId_channelId: {
                userId: userId,
                channelId,
            },
        },
    });

    if (existingSubscription) {
        // If already subscribed, unsubscribe
        await prisma.subscription.delete({
            where: {
                userId_channelId: {
                    userId: userId,
                    channelId,
                },
            },
        });
    } else {
        // If not subscribed, subscribe
        await prisma.subscription.create({
            data: {
                userId: userId,
                channelId,
            },
        });
    }

    // Invalidate cache related to subscriptions
    revalidateTag("subscription-status");
}

export async function updateNotificationLevel(
    channelId: string,
    level: "ALL" | "PERSONALIZED" | "NONE"
): Promise<void> {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.subscription.update({
            where: {
                userId_channelId: {
                    userId: user.id,
                    channelId,
                },
            },
            data: {
                notifyLevel: level,
            },
        });

        // Optional: refresh cache for the current channel or user page
        revalidateTag("subscription-status");
    } catch (error) {
        console.error("Failed to update notification level:", error);
        throw new Error("Unable to update notification preference.");
    }
}



export async function createNotificationsForNewVideo(videoId: string, channelId: string, message: string) {
    try {
        // Get all subscriptions to the channel with notifyLevel ALL
        const subscriptions = await prisma.subscription.findMany({
            where: {
                channelId,
                notifyLevel: NotifyLevel.ALL,
            },
        });

        if (!subscriptions.length) return;

        const notifications = subscriptions.map((sub) => ({
            userId: sub.userId,
            type: NotificationType.NEW_VIDEO,
            message,
            videoId,
            channelId,
        }));

        // Bulk create notifications
        await prisma.notification.createMany({
            data: notifications,
            skipDuplicates: true,
        });
    } catch (error) {
        console.error("Failed to create video notifications", error);
    }
}