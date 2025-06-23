// app/api/videos/get-videos-paginated/route.ts
import { NextRequest } from "next/server";

import { fetchChannelVideos } from "@/actions/video-actions";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "9", 10);
  const query = searchParams.get("query") || undefined;
  const categorySlug = searchParams.get("categorySlug") || undefined;
  const orderBy = searchParams.get("orderBy") as
    | "newest"
    | "oldest"
    | "popular"
    | undefined;


  const result = await fetchChannelVideos({
    page,
    pageSize,
    query,
    categorySlug,
    orderBy,
    channelId: req.nextUrl.pathname.split("/")[2], // Extract channelId from the path
  });

  return Response.json(result);
}

