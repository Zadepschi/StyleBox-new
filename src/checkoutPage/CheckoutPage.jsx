// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  getCartItems,
  getTotalPrice,
  getTotalQuantity,
} from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

import "./CheckoutPage.css";

const CheckoutPage = () => {
  const cartItems = useSelector(getCartItems);
  const totalPrice = useSelector(getTotalPrice);
  const totalQuantity = useSelector(getTotalQuantity);
  const navigate = useNavigate();

  const [showStripeForm, setShowStripeForm] = useState(false); // 👈 для показа формы

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="checkout-summary">
            <p><strong>Total items:</strong> {totalQuantity}</p>
            <p><strong>Total price:</strong> ${totalPrice}</p>
          </div>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

        
      <button className="pay-now" onClick={() => navigate("/checkout-form")}>
     Pay Now
     </button>
     
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
