"use server";


import Mux from "@mux/mux-node";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

import { PrismaClient, Video } from "@/generated";
import { getUser } from "@/lib/auth/auth-session";
import { VideoWithUser } from "@/types";
import { inputSchema } from "@/lib/zod";





const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const prisma = new PrismaClient();

export async function createVideo() {
    console.log("create video");
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    const userId = user.id;
    console.log(user, "eser");
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