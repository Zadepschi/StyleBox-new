
import { useEffect } from "react";
import "./ModComponent.css";

const Modal = ({ active, setActive, children }) => {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, setActive]);

  if (!active) return null;

  return (
    <div
      className="modal active"
      onClick={() => setActive(false)}
    >
      <div
        className="modal_content active"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
