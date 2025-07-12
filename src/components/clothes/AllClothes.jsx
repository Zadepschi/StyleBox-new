import { data } from "../../data/data";
import Clothes from "./Clothes";
import { useSelector } from "react-redux";
import { getSelectedCategory } from "../../redux/clothesSlice";

const AllClothes = () => {
  const selectedCategory = useSelector(getSelectedCategory);
  fetch(`${import.meta.env.VITE_API_URL}/products`)
  .then(res => {
    if (!res.ok) {
      throw new Error(`Ошибка HTTP: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error('Ошибка при получении товаров:', err);
  });


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
