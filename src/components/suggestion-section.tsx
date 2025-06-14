import { fetchVideos } from "@/actions/video-actions";
import { InfiniteScroll } from "@/components/infinite-scroll";

const SuggestionSection = async () => {
  const res = await fetchVideos({
    page: 1,
    pageSize: 9,
  });

  return (
    <div className="no-scrollbar overflow-y-auto">
      <InfiniteScroll
        initalVideos={res.videos}
        hasMoreInitial={res.hasMore}
        variant="search-main"
        initialOrderBy="newest"
      />
    </div>
  );
};

export default SuggestionSection;
