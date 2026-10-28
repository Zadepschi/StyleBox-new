import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SuccessPage.css";

const SuccessPage = () => {
const navigate = useNavigate();

useEffect(() => {
const timer = setTimeout(() => {
navigate("/account");
}, 3000);

return () => clearTimeout(timer);

}, [navigate]);

return (
<div className="success-wrapper">
<div className="success-card">
<svg
       xmlns="http://www.w3.org/2000/svg"
       className="success-icon"
       viewBox="0 0 24 24"
       fill="none"
       stroke="#4BB543"
       strokeWidth="2"
       strokeLinecap="round"
       strokeLinejoin="round"
     >
<path d="M20 6L9 17l-5-5" />
</svg>

    <h1 className="success-title">Payment Successful!</h1>
    <p className="success-message">
      Thank you for your order.
    </p>
    <p className="success-message">
      Redirecting to your account...
    </p>
  </div>
</div>

);
};

export default SuccessPage;