import { getCategories } from "@/actions/category-actions";


export default async function Home() {

    const categories = await getCategories();
 
  return (
    <div className="w-full">


    </div>
  );
}
