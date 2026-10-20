
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getCartItems,
  getTotalPrice,
  getTotalQuantity,
} from "../redux/cartSlice";
import "./Secret.css";
import CartItem from "../components/cart/CartItem";

const Secret = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  const cartItems = useSelector(getCartItems);
  const totalPrice = useSelector(getTotalPrice);
  const totalQuantity = useSelector(getTotalQuantity);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  if (isLoading) {
    return <div className="account-loading">Loading your account...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="account-message">
        <h2>Please log in</h2>
        <p>Sign in to view your Style Box account.</p>
        <button type="button" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    );
  }

  return (
    <main className="account-page">
      <header className="account-heading">
        <p className="account-eyebrow">STYLE BOX</p>
        <h1>My Account</h1>
        <p>Welcome back, {user?.name || "Shopper"}!</p>
      </header>

      <section className="account-profile">
        <div className="account-profile-header">
          {user?.picture ? (
            <img
              src={user.picture}
              alt="Profile"
              className="account-avatar"
            />
          ) : (
            <div className="account-avatar account-avatar-placeholder">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}

          <div className="account-user-details">
            <h2>{user?.name || "Style Box customer"}</h2>
            <p>{user?.email || "Email not available"}</p>
          </div>
        </div>

        <div className="account-divider" />

        <div className="account-detail">
          <span>Nickname</span>
          <strong>{user?.nickname || "—"}</strong>
        </div>

        <div className="account-detail">
          <span>Email verified</span>
          <strong>{user?.email_verified ? "Yes" : "Not verified"}</strong>
        </div>
      </section>

      <section className="account-shopping">
        <div className="account-section-heading">
          <div>
            <p className="account-eyebrow">YOUR SHOPPING</p>
            <h2>My Shopping Bag</h2>
          </div>

          <span className="account-item-count">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="account-shopping-summary">
          <div>
            <span>Total items</span>
            <strong>{totalQuantity}</strong>
          </div>

          <div>
            <span>Total price</span>
            <strong>${Number(totalPrice || 0).toFixed(2)}</strong>
          </div>
        </div>

        <div className="account-cart-items">
          {cartItems.length > 0 ? (
            cartItems.map((cartItem, index) => (
              <CartItem
                key={cartItem.id ?? cartItem._id ?? index}
                cartItem={cartItem}
              />
            ))
          ) : (
            <div className="account-empty-cart">
              <p>Your shopping bag is empty.</p>
              <button
                type="button"
                className="account-primary-button"
                onClick={() => navigate("/products")}
              >
                Explore Collections
              </button>
            </div>
          )}
        </div>

        {totalQuantity > 0 && (
          <button
            type="button"
            className="account-primary-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        )}
      </section>

      <section className="account-settings">
        <div>
          <h2>Account Settings</h2>
          <p>Signed in with your Style Box account.</p>
        </div>

        <button
          type="button"
          className="account-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </section>
    </main>
  );
};

export default Secret;
