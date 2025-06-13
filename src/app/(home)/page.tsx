import { getCategories } from "@/actions/category-actions";
import { fetchVideos } from "@/actions/video-actions";
import { FilterCarousel } from "@/components/filter-carousel";
import { InfiniteScroll } from "@/components/infinite-scroll";


const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ categorySlug: string }>;
}) => {
  const { categorySlug } = await searchParams;

  const categories = await getCategories();

  const res = await fetchVideos({
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
        initialCategorySlug={categorySlug}
        initialOrderBy="newest"
        />
    </div>
  );
};

export default HomePage;
