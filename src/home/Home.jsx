import { useState } from "react";
import { data } from "../data/dataSlides";
import "./Home.css";
import left from "/pictures/left.png";
import next from "/pictures/next.png";
import { Link } from "react-router-dom";

function Home() {
  const [firstPage, setFirstPage] = useState(0);
  const { id, image, name, par } = data[firstPage];

  const previousButton = () => {
    setFirstPage((firstPage) => {
      firstPage--;
      if (firstPage < 0) {
        return data.length - 1;
      }
      return firstPage;
    });
  };

  const nextButton = () => {
    setFirstPage((firstPage) => {
      firstPage++;
      if (firstPage > data.length - 1) {
        firstPage = 0;
      }
      return firstPage;
    });
  };

  return (
    <div key={id}>
    <div className="main">
  <div className="bottom">
    <h1>{name}</h1>
    <p>{par}</p>
    <Link to="/products">
      <button>SHOP NOW</button>
    </Link>
  </div>
</div>

       
      <div>
        <img className="slidePicture" src={image} alt="clothes" />
      </div>
      <div className="buttons">
        <div className="buttonContainer">
          <button className="prevButton" onClick={previousButton}>
            {<img className="prevImg" src={left} alt="ok" />}
          </button>
          <button className="nextButton" onClick={nextButton}>
            {<img className="nextImg" src={next} alt="ok" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
