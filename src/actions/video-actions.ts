"use server";


import Mux from "@mux/mux-node";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";


import { getUser } from "@/lib/auth/auth-session";
// import { Prisma } from "@/lib/generated/prisma";
import { Prisma, PrismaClient, Video } from "@/lib/generated/prisma";
import { inputSchema } from "@/lib/zod";
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


export async function getVideoById(videoId: string): Promise<VideoWithUser | null> {
    if (!videoId) {
        throw new Error("Video ID is missing");
    }

    try {
        const video = await prisma.video.findUnique({
            where: { id: videoId },
            include: {
                channel: {
                    include: {
                        user: true, // This gives you the channel owner's info
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

        return video;
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




// export async function getChannelVideos(slug: string) {
//   const user = await getUser();
//   if (!user) throw new Error("Unauthorized");

//   const channel = await prisma.channel.findUnique({
//     where: { slug },
//     select: { id: true },
//   });
//   if (!channel) throw new Error("Channel not found");

//   return prisma.video.findMany({
//     where: { channelId: channel.id },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       title: true,
//       videoViews: true,
//       duration: true,
//       createdAt: true,
//     },
//   });
// }
export type VideosPageResult = {
  data: Video[];
  hasMore: boolean;
};

export async function getChannelVideosPage(
  slug: string,
  page: number,
  pageSize = 9
): Promise<VideosPageResult> {
  const skip = (page - 1) * pageSize;

  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const videos = await prisma.video.findMany({
    where: {
      channel: {
        slug,
        userId: user.id, // ensures only your channels’ videos
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
    include: {
      channel: true, // optionally include channel metadata
    },
  });

  const hasMore = videos.length === pageSize;
  return { data: videos, hasMore };
}






export async function fetchVideos({
  query,
  page = 1,
  pageSize = 9,
  categorySlug,
  orderBy = "newest",
  user = false,
}: {
  query?: string;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  orderBy?: "newest" | "oldest" | "popular";
  user?: boolean;
}) {
  const skip = (page - 1) * pageSize;

  // Auth is only needed if filtering by user, likes, or history
  const currentUser =  await getUser();
  if (user && !currentUser) {
    throw new Error("User not authenticated");
  }

  // Setup order clause
  const orderClause: Prisma.VideoOrderByWithRelationInput =
    orderBy === "oldest"
      ? { createdAt: "asc" }
      : orderBy === "popular"
      ? { videoViews: "desc" }
      : { createdAt: "desc" };



  const videoWhere: Prisma.VideoWhereInput = {
    ...(query && {
      title: { contains: query, mode: Prisma.QueryMode.insensitive },
    }),
    ...(categorySlug && {
      category: { slug: categorySlug },
    }),
    ...(!user && { visibility: "public" }),
  };

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where: videoWhere,
      orderBy: orderClause,
      skip,
      take: pageSize,
      include: {
        channel: true,
        category: true,
      },
    }),
    prisma.video.count({ where: videoWhere }),
  ]);

  const hasMore = skip + videos.length < total;
  return { videos, hasMore };
}