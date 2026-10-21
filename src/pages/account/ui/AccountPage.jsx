
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getCartItems,
  getTotalPrice,
  getTotalQuantity,
} from "../../../entities/cart/model/cartSlice";

import CartItem from "../../../widgets/cart/ui/CartItem";
import "./AccountPage.css";


const AccountPage = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const cartItems = useSelector(getCartItems);
  const totalPrice = useSelector(getTotalPrice);
  const totalQuantity = useSelector(getTotalQuantity);

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );


        if (!response.ok) {
          throw new Error("Failed to load orders.");
        }

        const data = await response.json();


        console.log("6. Orders received by AccountPage:", data.orders);
console.table(
  (data.orders ?? []).flatMap((order) =>
    (order.items ?? []).map((item) => ({
      name: item.name,
      image: item.image,
      hasImage: Boolean(item.image),
    }))
  )
);

        if (!cancelled) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Orders loading error:", error);

        if (!cancelled) {
          setOrdersError(
            "Unable to load your order history. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const formatPrice = (amount, currency = "usd") => {
    // Stripe stores order totals in the smallest currency unit, such as cents.
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(Number(amount || 0) / 100);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getOrderStatus = (status) => {
    const statuses = {
      new: "New",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    return statuses[status] || status;
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
          Log In
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




          {/* Current shopping bag */}
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
            <span>Total Items</span>
            <strong>{totalQuantity}</strong>
          </div>

          <div>
            <span>Total Price</span>
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

      {/* Order history */}

      {orders.length > 0 && (
      <section className="account-orders">
        <div className="account-section-heading">
          <div>
            <p className="account-eyebrow">ORDER HISTORY</p>
            <h2>My Orders</h2>
          </div>

          <span className="account-item-count">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        {ordersLoading ? (
          <p className="account-orders-message">Loading your orders...</p>
        ) : ordersError ? (
          <div className="account-orders-message">
            <p>{ordersError}</p>
            <button
              type="button"
              className="account-primary-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="account-orders-message">
            <p>You haven't placed any orders yet.</p>
            <button
              type="button"
              className="account-primary-button"
              onClick={() => navigate("/products")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="account-orders-list">
            {orders.map((order) => (
              <article className="account-order-card" key={order._id}>
                <div className="account-order-header">
                  <div>
                    <p className="account-order-label">Order</p>
                    <h3>#{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="account-order-date">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="account-order-total">
                    <strong>
                      {formatPrice(order.totalAmount, order.currency)}
                    </strong>

                    <span
                      className={`account-payment-status account-payment-${order.paymentStatus}`}
                    >
                      {order.paymentStatus === "paid"
                        ? "Paid"
                        : order.paymentStatus === "pending"
                          ? "Payment Pending"
                          : "Payment Failed"}
                    </span>
                  </div>
                </div>

                <div className="account-order-items">
                  {order.items.map((item, index) => (
                    <div
                      className="account-order-item"
                      key={`${item.productId}-${index}`}
                    >

                        <img
                           src={item.image}
                          alt={item.name}
                            className="account-order-product-image"
                           />
                      <span>{item.name}</span>
                      <span>× {item.quantity}</span>
                      <strong>
                        {formatPrice(
                          Math.round(item.price * 100) * item.quantity,
                          order.currency
                        )}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="account-order-footer">
                  <span>Order Status</span>
                  <strong>{getOrderStatus(order.orderStatus)}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      )}
  

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
          Log Out
        </button>
      </section>
    </main>
  );
};

export default AccountPage;
