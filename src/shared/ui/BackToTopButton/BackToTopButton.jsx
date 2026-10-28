import { useEffect, useState } from "react";
import ok from "/pictures/ok.png";
import "./BackToTopButton.css";



const BackToTopButton = () => {
  const [backToTopButton, setBackToTopBautton] = useState(false);

 
useEffect(() => {
  const handleScroll = () => {
    setBackToTopBautton(window.scrollY > 100);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
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
