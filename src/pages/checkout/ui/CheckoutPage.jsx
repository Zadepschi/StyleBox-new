import React from "react";
import { useSelector } from "react-redux";
import {
  getCartItems,
  getTotalPrice,
  getTotalQuantity,
} from "../../../entities/cart/model/cartSlice";
import { useNavigate } from "react-router-dom";

import { ShippingAddressForm } from "../../../features/payment/ui/ShippingAddressForm";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const cartItems = useSelector(getCartItems);
  const totalPrice = useSelector(getTotalPrice);
  const totalQuantity = useSelector(getTotalQuantity);
  const navigate = useNavigate();

  const handleAddressContinue = (shippingAddress) => {
    if (!shippingAddress) return;

    navigate("/checkout-form", {
      state: { shippingAddress },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>

        <button
          type="button"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-summary">
        <p>
          <strong>Total items:</strong> {totalQuantity}
        </p>

        <p>
          <strong>Total price:</strong>{" "}
          ${Number(totalPrice).toFixed(2)}
        </p>
      </div>

      <div className="checkout-items">
        {cartItems.map((item) => (
          <div key={item.id} className="checkout-item">
            <img src={item.image} alt={item.name} />

            <div>
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>

              <p>
                Price: $
                {(
                  Number(item.price) *
                  Number(item.quantity)
                ).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <ShippingAddressForm
        onContinue={handleAddressContinue}
        onBack={() => navigate(-1)}
      />
    </div>
  );
};

export default CheckoutPage;