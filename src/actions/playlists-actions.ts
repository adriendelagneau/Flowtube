"use server";


import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { Playlist, PlaylistVideo, PrismaClient, Video } from "@/generated";
import { getUser } from "@/lib/auth/auth-session";



const prisma = new PrismaClient();


export interface PlaylistWithVideos extends Playlist {
  videos: (PlaylistVideo & {
    video: Pick<Video, "id" | "title" | "thumbnailUrl" | "duration" | "visibility">;
  })[];
};

export async function createPlaylist(name: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;
  try {

    const playlist = await prisma.playlist.create({
      data: {
        userId,
        name
      }
    });

    return playlist;
  } catch (err) {
    console.error("Error creating video:", err);
    throw new Error("Failed to create playlist");
  }
};

export async function getUserPlaylists() {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        userId: user.id,
      },
      include: {
        videos: {
          include: {
            video: {
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                duration: true,
                visibility: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return playlists;
  } catch (err) {
    console.error("Error fetching user playlists:", err);
    throw new Error("Failed to get playlists");
  }
};

export async function addVideoToPlaylist(playlistId: string, videoId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Ensure the playlist belongs to the current user
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
    select: { userId: true },
  });

  if (!playlist || playlist.userId !== user.id) {
    throw new Error("Forbidden");
  }

  try {
    // Get current max position in the playlist
    const lastVideo = await prisma.playlistVideo.findFirst({
      where: { playlistId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastVideo ? lastVideo.position + 1 : 0;

    const added = await prisma.playlistVideo.create({
      data: {
        playlistId,
        videoId,
        position: newPosition,
      },
    });




    return added;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Video is already in this playlist");
    }
    console.error("Failed to add video to playlist:", err);
    throw new Error("Could not add video to playlist");
  }
};

export async function removeVideoFromPlaylist(playlistId: string, videoId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Ensure the playlist belongs to the user
  const playlist = await prisma.playlist.findUnique({
    where: { id: playlistId },
    select: { userId: true },
  });

  if (!playlist || playlist.userId !== user.id) {
    throw new Error("Forbidden");
  }

  try {
    await prisma.playlistVideo.delete({
      where: {
        playlistId_videoId: {
          playlistId,
          videoId,
        },
      },
    });


    return { success: true };
  } catch (err) {
    console.error("Failed to remove video from playlist:", err);
    throw new Error("Could not remove video from playlist");
  }
};

export async function getPlaylistsWithVideoStatus(videoId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        userId: user.id,
      },
      include: {
        videos: {
          where: {
            videoId,
          },
          select: {
            id: true, // just to know it exists
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add a boolean field to each playlist indicating inclusion
    const result = playlists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
      videoIncluded: playlist.videos.length > 0,
    }));
    revalidatePath(`/video/${videoId}`);
    return result;
  } catch (err) {
    console.error("Error checking playlists for video:", err);
    throw new Error("Could not fetch playlist statuses");
  }
};

export async function POST(req: Request) {
  const { playlistVideoId, direction } = await req.json(); // direction = "up" | "down"

  if (!["up", "down"].includes(direction)) {
    return NextResponse.json({ error: "Invalid direction" }, { status: 400 });
  }

  const target = await prisma.playlistVideo.findUnique({
    where: { id: playlistVideoId },
  });

  if (!target) {
    return NextResponse.json({ error: "PlaylistVideo not found" }, { status: 404 });
  }

  const newPosition = direction === "up" ? target.position - 1 : target.position + 1;

  // Find the adjacent video
  const adjacent = await prisma.playlistVideo.findFirst({
    where: {
      playlistId: target.playlistId,
      position: newPosition,
    },
  });

  // If there's no video to swap with, abort
  if (!adjacent) {
    return NextResponse.json({ error: "Cannot move in that direction" }, { status: 400 });
  }

  // Perform the swap
  await prisma.$transaction([
    prisma.playlistVideo.update({
      where: { id: target.id },
      data: { position: newPosition },
    }),
    prisma.playlistVideo.update({
      where: { id: adjacent.id },
      data: { position: target.position },
    }),
  ]);

  return NextResponse.json({ success: true });
};
