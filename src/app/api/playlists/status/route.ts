import { NextRequest } from "next/server";

import { getPlaylistsWithVideoStatus } from "@/actions/playlists-actions";

export async function GET(req: NextRequest) {
    const videoId = req.nextUrl.searchParams.get("videoId");

    if (!videoId) {
        return new Response("Missing videoId", { status: 400 });
    }

    try {
        const playlists = await getPlaylistsWithVideoStatus(videoId);
        return Response.json(playlists);
    } catch {
        return new Response("Error fetching playlists", { status: 500 });
    }
}
