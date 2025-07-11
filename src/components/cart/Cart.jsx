import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../../modComp/ModComponent";
import {
  emptyCart,
  getCartItems,
  getTotalPrice,
  getTotalQuantity,
} from "../../redux/cartSlice";
import CartItem from "./CartItem";
import "./Cart.css";

const Cart = () => {
  const cartItems = useSelector(getCartItems);
  const totalPrice = useSelector(getTotalPrice);
  const totalQuantity = useSelector(getTotalQuantity);
  const dispatch = useDispatch();
  const [modalActive, setModalActive] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setModalActive(false);
    navigate("/checkout");
  };

  return (
    <div className="deleteAllDiv">
      <div onClick={() => setModalActive(true)} className="shop-cart">
        <svg
          className="shop-cart__icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.6 17h9.8a2 2 0 0 0 1.94-1.44L23 6H6"></path>
        </svg>
        <span className="shop-cart__badge">{totalQuantity}</span>
      </div>

      <Modal active={modalActive} setActive={setModalActive} cartItems={cartItems}>
        <div className="cartModalContent">
          <div className="cartHeader">
            <div className="cartTotals">
              <p><strong>🛍 Total items:</strong> {totalQuantity}</p>
              <p><strong>💰 Total price:</strong> ${totalPrice}</p>
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

          {/* КНОПКА CHECKOUT */}
          {cartItems.length > 0 && (
            <div className="checkout-container">
              <button className="checkout-button" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
