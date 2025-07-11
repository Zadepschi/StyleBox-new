import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  emptyCart,
  getCartItems,
  getTotalPrice,
  getTotalQuantity,
} from "../redux/cartSlice";
import CartItem from "../components/cart/CartItem";
import "../components/cart/Cart.css";
import LoginButton from "./LoginButton";

const Secret = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const cartItems = useSelector(getCartItems);
  const totalPrice = useSelector(getTotalPrice);
  const totalQuantity = useSelector(getTotalQuantity);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (isLoading) return <div>Loading user info...</div>;
  if (!isAuthenticated) return <div>Please log in to view this page.</div>;

  return (
    <div className="secret-container">
        
   <div className="user-info">
    <img src={user.picture} alt={user.name} className="secret-avatar" />
    <h2 className="secret-name">{user.name}</h2>
    <p className="secret-nickname">Nickname: <span>{user.nickname}</span></p>
    <p className="secret-email">Email: <span>{user.email}</span></p>
  </div>


      <div className="cartModalContent">
        <div className="cartHeader">
          <div className="cartTotals">
            <p>
              <strong>🛍 Total items:</strong> {totalQuantity}
            </p>
            <p>
              <strong>💰 Total price:</strong> ${totalPrice}
            </p>
          </div>
          <button className="clearCartBtn" onClick={() => dispatch(emptyCart())}>
            🗑 Clear
          </button>
        </div>

        <div className="cartItemsList">
          {cartItems.length > 0 ? (
            cartItems.map((cartItem, index) => (
              <CartItem key={index} cartItem={cartItem} />
            ))
          ) : (
            <p className="emptyMessage">Your cart is empty 😢</p>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="checkout-container">
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Secret;
