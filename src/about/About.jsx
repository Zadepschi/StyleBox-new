import { useState } from "react";
import BackToTopButton from "./BackToTopButton";
import { data } from "../data/aboutData";
import "./about.css";

function About() {
 
  const [showText, setShowText] = useState(false);

  

  const showTextClick = (item) => {
    item.showMore = !item.showMore;
    setShowText(!showText);
   
  };


  return (
    <div>
      {data.map((item) => {
        const { id, image, description, showMore, head } = item;
        return (
          <div key={id} className="about">
             <h3 className="head">{head}</h3>
            <div>
              <img src={image} alt="dress" className="aboutPicture" />
            </div>

            <div>
               
              <p className="description">
                {showMore ? description : description.substring(0, 200) + "..."}
                <button
                  className="showMore"
                  onClick={() => showTextClick(item)}
                >
                  {showMore ? "Show less" : "Show more"}{" "}
                </button>{" "}
              </p>
            </div>
          </div>
        );
      })}
      <BackToTopButton />
    </div>
  );
}

export default About;
