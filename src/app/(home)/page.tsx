import { getCategories } from "@/actions/category-actions";
import { FilterCarousel } from "@/components/filter-carousel";

import HomeMain from "./home-main";

const HomePage = async () => {
  const categories = await getCategories();

  return (
    <div className="no-scrollbar overflow-y-auto">
      <FilterCarousel categories={categories} />
      <HomeMain />
    </div>
  );
};

export default HomePage;
