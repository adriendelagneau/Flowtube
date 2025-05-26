"use server";


import Mux from "@mux/mux-node";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

import { getUser } from "@/lib/auth/auth-session";
import { Prisma, PrismaClient, Video } from "@/lib/generated";
import { inputSchema } from "@/lib/zod";
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

export async function revlidateVideo(videoId: string) {

    if (!videoId) throw new Error("videoId is required");
    // Fetch user details

    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const existingVideo = await prisma.video.findFirst({
        where: {
            id: videoId,
            userId: user.id,
        },
    });
    if (!existingVideo || !existingVideo.muxUploadId) {
        throw new Error("Video not found");
    }

    const directUpload = await mux.video.uploads.retrieve(existingVideo.muxUploadId);
    if (!directUpload || !directUpload.asset_id) {
        throw new Error("Bad request");
    }

    const asset = await mux.video.assets.retrieve(directUpload.asset_id);
    if (!asset) {
        throw new Error("Bad request");
    }


    const playbackId = asset.playback_ids?.[0].id;
    const duration = asset.duration ? Math.round(asset.duration * 1000) : 0;


    // TODO: find a way to rvalidate track is & track status
    const updatedVideo = await prisma.video.update({
        where: { id: videoId, userId: user.id },
        data: {
            muxStatus: asset.status,
            muxPlaybackId: playbackId,
            muxAssetId: asset.id,
            duration: duration
        }
    });

    return updatedVideo;
}

