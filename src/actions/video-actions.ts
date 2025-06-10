"use server";


import Mux from "@mux/mux-node";
// import { z } from "zod";

import { PrismaClient, Video } from "@/generated";
import { getUser } from "@/lib/auth/auth-session";




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
