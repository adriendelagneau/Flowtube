import { NextRequest } from "next/server";

import { fetchVideos } from "@/actions/video-actions";

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

  const user = searchParams.get("user") === "true";    


  const result = await fetchVideos({
    page,
    pageSize,
    query,
    categorySlug,
    orderBy,
    user,

  });

  return Response.json(result);
}

