"use server";

import { Prisma, PrismaClient } from "@/generated";
import { getUser } from "@/lib/auth/auth-session";


const prisma = new PrismaClient();

export async function fetchVideos({
    query,
    page = 1,
    pageSize = 9,
    categorySlug,
    orderBy = "newest",
    user = false,
    isPrivate = false,
    isLiked = false, /////
}: {
    query?: string;
    page?: number;
    pageSize?: number;
    categorySlug?: string;
    orderBy?: "newest" | "oldest" | "popular";
    user?: boolean;
    isPrivate?: boolean;
    isLiked?: boolean;
}) {
    const skip = (page - 1) * pageSize;

    // Step 1: Build WHERE clause
    const whereClause: Prisma.VideoWhereInput = {};

    if (user) {
        const currentUser = await getUser();
        if (!currentUser) throw new Error("User not authenticated");
        whereClause.userId = currentUser.id;
        whereClause.visibility = isPrivate ? "private" : "public";
    } else {
        whereClause.visibility = "public";
    }

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

    // Step 2: Build ORDER clause
    let orderClause: Prisma.VideoOrderByWithRelationInput = { createdAt: "desc" };
    if (orderBy === "oldest") orderClause = { createdAt: "asc" };
    if (orderBy === "popular") orderClause = { videoViews: "desc" };

    // Step 3: Handle isLiked videos
    if (isLiked) {
        const currentUser = await getUser();
        if (!currentUser) throw new Error("User not authenticated");

        const [videos, total] = await Promise.all([
            prisma.video.findMany({
                where: {
                    ...whereClause,
                    likes: {
                        some: {
                            userId: currentUser.id,
                        },
                    },
                },
                orderBy: orderClause,
                skip,
                take: pageSize,
                include: {
                    user: true,
                    category: true,
                },
            }),
            prisma.video.count({
                where: {
                    ...whereClause,
                    likes: {
                        some: {
                            userId: currentUser.id,
                        },
                    },
                },
            }),
        ]);

        const hasMore = skip + videos.length < total;
        return { videos, hasMore };
    }

    // Step 4: Default fetch
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
    return { videos, hasMore };
}
