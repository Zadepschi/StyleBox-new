import Filter from "./Filter";
import "./buttons.css"

const AllCategories = () => {
  return (
    <div className="cont">
      {[
        "all",
        "dress",
        "skirt",
        "pants",
        "pijamas",
        "shoes",
        "tunic",
        "shirt",
      ].map((category, index) => (
        <Filter key={index} category={category} className={`btnCategory ${category}`} />
      ))}
    </div>
  );
};
export default AllCategories;
