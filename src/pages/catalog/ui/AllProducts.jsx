import BackToTopButton from "../../../shared/ui/BackToTopButton/BackToTopButton";
import AllClothes from "../../../widgets/catalog/ui/AllClothes";
import AllCategories from "../../../widgets/catalog/ui/AllCategories";

const AllProducts = () => {
  return (
    <div>
      <AllCategories />
      <AllClothes />
      <BackToTopButton />
    </div>
  );
};

export default AllProducts;