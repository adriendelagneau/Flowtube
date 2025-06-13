import { getCategories } from "@/actions/category-actions";
import { fetchVideos } from "@/actions/video-actions";
import { FilterCarousel } from "@/components/filter-carousel";
// import TestButton from "@/components/test-button";
// import TestReceiver from "@/components/test-receiver";

import InfiniteScroll from "./infinite-scroll";

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
      <InfiniteScroll
        initalVideos={res.videos}
        hasMoreInitial={res.hasMore}
        variant="home-main"
        initialQuery={query}
        initialCategorySlug={categorySlug}
        initialOrderBy="newest"
        />
        {/* <TestButton />
        <TestReceiver /> */}
   
    </div>
  );
};

export default HomePage;
