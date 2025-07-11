import { useEffect, useState } from "react";
import ok from "/pictures/ok.png";
import "./about.css"



const BackToTopButton = () => {
  const [backToTopButton, setBackToTopBautton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setBackToTopBautton(true);
      } else {
        setBackToTopBautton(false);
      }
    });
  }, []);

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {backToTopButton && (
        <img
          src={ok}
          onClick={scrollUp}
          className="ok"
          alt="icon"
        />
      )}
    </div>
  );
};
export default BackToTopButton;
