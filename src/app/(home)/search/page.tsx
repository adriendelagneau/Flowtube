import { getCategories } from "@/actions/category-actions";
import { fetchVideos } from "@/actions/video-actions";
import { FilterCarousel } from "@/components/filter-carousel";
import { InfiniteScroll } from "@/components/infinite-scroll";

const SearchPage = async ({
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
    </div>
  );
};

export default SearchPage;
