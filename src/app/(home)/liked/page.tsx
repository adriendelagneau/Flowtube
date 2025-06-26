import { notFound } from "next/navigation";
import React from "react";

import { getCategories } from "@/actions/category-actions";
import { fetchVideos } from "@/actions/video-actions";
import { FilterCarousel } from "@/components/filter-carousel";

import { InfiniteScrollLiked } from "./infinite-scroll-liked";

const LikedPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ categorySlug: string }>;
}) => {
  const { videos: initialData, hasMore: hasMoreInitial } = await fetchVideos({
    page: 1,
    pageSize: 9,
    query: "",
    categorySlug: (await searchParams).categorySlug || "",
    orderBy: "newest",
    liked: true, // Ensure we only fetch liked videos
  });
  if (!initialData) notFound();

  const { categorySlug } = await searchParams;

  const categories = await getCategories();

  return (
    <div className="no-scrollbar overflow-y-auto">
      <FilterCarousel categories={categories} />
      <InfiniteScrollLiked
        initalVideos={initialData}
        hasMoreInitial={hasMoreInitial}
        variant="home-main"
        initialOrderBy="newest"
        initialCategorySlug={categorySlug}
      />
    </div>
  );
};

export default LikedPage;
