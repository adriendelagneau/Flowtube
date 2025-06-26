
import InfiniteScrollSuggestions from "./infinte-scroll-suggestions";

const SuggestionSection = async () => {
  return (
    <div className="no-scrollbar overflow-y-auto">
      <InfiniteScrollSuggestions />
    </div>
  );
};

export default SuggestionSection;
