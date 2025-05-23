import { GetCategory } from "@/actions/category-actions";

import { FilterCarousel } from "./components/filter-carousel";

const HomePage = async () => {
  const categories = await GetCategory();

  return (
    <div className="no-scrollbar overflow-y-auto">
      <FilterCarousel categories={categories} />
    </div>
  );
};

export default HomePage;
