import { NextRequest } from "next/server";

import { addVideoToPlaylist } from "@/actions/playlists-actions";

export async function POST(req: NextRequest) {
    const { playlistId, videoId } = await req.json();
    try {
        await addVideoToPlaylist(playlistId, videoId);
        return new Response(null, { status: 200 });
    } catch {
        return new Response("Error", { status: 500 });
    }
}
