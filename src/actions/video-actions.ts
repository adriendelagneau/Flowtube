"use server";


import Mux from "@mux/mux-node";

import { getUser } from "@/lib/auth/auth-session";
import { Prisma, PrismaClient, Video } from "@/lib/generated";
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

export async function getUserVideos(): Promise<Video[]> {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        const videos = await prisma.video.findMany({
            where: { userId: user.id }, // Fetch only the logged-in user's videos
            orderBy: { createdAt: "desc" }, // Sort by latest videos first
        });

        return videos;
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
        categoryId: string;
    }
) {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        const video = await prisma.video.update({
            where: { id: videoId, userId: user.id },
            data: {
                title: data.title,
                description: data.description,
                visibility: data.visibility,
                categoryId: data.categoryId,
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

export async function fetchVideos({
    query,
    page = 1,
    pageSize = 9,
    categorySlug,
    orderBy = "newest",
    liked = false,
    history = false,
    subscribed = false,
    // playlistId,
}: {
    query?: string;
    page?: number;
    pageSize?: number;
    categorySlug?: string;
    orderBy?: "newest" | "oldest" | "popular";
    liked?: boolean;
    history?: boolean;
    subscribed?: boolean;
    // playlistId?: string;
}) {
    const skip = (page - 1) * pageSize;

    const whereClause: Prisma.VideoWhereInput = {
        visibility: "public",
    };

    if (query) {
        whereClause.title = {
            contains: query,
            mode: Prisma.QueryMode.insensitive,
        };
    }

    if (categorySlug) {
        whereClause.category = {
            slug: categorySlug,
        };
    }

    // 🎯 Handle playlist filter via join table
    // if (playlistId) {
    //     const playlistVideos = await prisma.playlistVideo.findMany({
    //         where: { playlistId },
    //         select: { videoId: true },
    //     });

    //     const videoIds = playlistVideos.map(pv => pv.videoId);
    //     if (videoIds.length === 0) {
    //         return { videos: [], hasMore: false };
    //     }

    //     whereClause.id = { in: videoIds };
    // }

    if (liked || history || subscribed) {
        const currentUser = await getUser();
        if (!currentUser) {
            throw new Error("Unauthorized");
        }

        if (liked) {
            whereClause.likes = {
                some: {
                    userId: currentUser.id,
                },
            };
        }

        // if (history) {
        //     whereClause.watchHistory = {
        //         some: {
        //             userId: currentUser.id,
        //         },
        //     };
        // }

        if (subscribed) {
            const subscriptions = await prisma.subscription.findMany({
                where: { viewerId: currentUser.id },
                select: { creatorId: true },
            });

            const creatorIds = subscriptions.map((sub) => sub.creatorId);
            if (creatorIds.length === 0) {
                return { videos: [], hasMore: false };
            }

            whereClause.userId = { in: creatorIds };
        }
    }

    let orderClause: Prisma.VideoOrderByWithRelationInput = { createdAt: "desc" };
    if (orderBy === "oldest") {
        orderClause = { createdAt: "asc" };
    } else if (orderBy === "popular") {
        orderClause = { videoViews: "desc" };
    }

    const [videos, total] = await Promise.all([
        prisma.video.findMany({
            where: whereClause,
            orderBy: orderClause,
            skip,
            take: pageSize,
            include: {
                user: true,
                category: true,
            },
        }),
        prisma.video.count({ where: whereClause }),
    ]);

    const hasMore = skip + videos.length < total;

    return {
        videos,
        hasMore,
    };
}


