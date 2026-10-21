
import { data } from "../../../entities/product/model/productsData";
import Clothes from "./Clothes";
import { useSelector } from "react-redux";
import { getSelectedCategory } from "../../../entities/product/model/clothesSlice";

const AllClothes = () => {
  const selectedCategory = useSelector(getSelectedCategory);

  return (
    <div className="container1">
      {data
        .filter((clothes) => {
          if (selectedCategory === "all") return true;
          return selectedCategory === clothes.searchTerm;
        })
        .map((element, index) => (
          <Clothes key={index} clothes={element} />
        ))}
    </div>
  );
};

export default AllClothes;
