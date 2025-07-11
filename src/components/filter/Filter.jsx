import { useDispatch, useSelector } from "react-redux";
import { filterCategory, getSelectedCategory } from "../../redux/clothesSlice";

const Filter = ({ category, className }) => {
  const selectedCategory = useSelector(getSelectedCategory);
  const dispatch = useDispatch();
  return (
    <div className="change">
      <p
        onClick={() => dispatch(filterCategory(category))}
        className={`${className} ${selectedCategory === category ? "categoryButtonSelected" : ""}`}
      >
        {category}
      </p>
    </div>
  );
};
export default Filter;
