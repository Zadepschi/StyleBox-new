import BackToTopButton from "../about/BackToTopButton";
import AllClothes from "../components/clothes/AllClothes";
import AllCategories from "../components/filter/AllCategories";

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