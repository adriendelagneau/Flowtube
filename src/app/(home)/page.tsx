import { getCategories } from "@/actions/category-actions";
import { fetchVideos } from "@/actions/video-actions";
import InfiniteScrollMovies from "@/components/infinite-scrool-videos";

import { FilterCarousel } from "./components/filter-carousel";

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query: string; categorySlug: string }>;
}) => {
  const { query, categorySlug } = await searchParams;

  const categories = await getCategories();

  const res = await fetchVideos({
    query,
    page: 1,
    pageSize: 9,
    categorySlug,
  });

  return (
    <div className="no-scrollbar overflow-y-auto">
      <FilterCarousel categories={categories} />
      <InfiniteScrollMovies initialVideos={res.videos} hasMore={res.hasMore} />
    </div>
  );
};

export default HomePage;
