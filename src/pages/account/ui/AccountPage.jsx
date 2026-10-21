
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AddressAutofill } from "@mapbox/search-js-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getCartItems,
  getTotalPrice,
  getTotalQuantity,
} from "../../../entities/cart/model/cartSlice";

import CartItem from "../../../widgets/cart/ui/CartItem";
import "./AccountPage.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? "";
const API_URL =
  import.meta.env.VITE_API_URL ??
  "https://stylebox-backend.onrender.com";

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

  const [shippingAddress, setShippingAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);

  const [addressDraft, setAddressDraft] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    latitude: null,
    longitude: null,
  });

  // Load order history.
  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load orders.");
        }

        const data = await response.json();

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

  // Load the saved shipping address, including coordinates if available.
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setShippingAddress(null);
      setAddressLoading(false);
      return;
    }

    let cancelled = false;

    const fetchShippingAddress = async () => {
      setAddressLoading(true);
      setAddressError("");

      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://stylebox-api",
          },
        });

        const response = await fetch(
          `${API_URL}/api/me/shipping-address`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load shipping address.");
        }

        const data = await response.json();

        if (!cancelled) {
          const savedAddress = data?.address ?? null;

          setShippingAddress(savedAddress);

          if (savedAddress) {
            setAddressDraft({
              address: savedAddress.address || "",
              city: savedAddress.city || "",
              state: savedAddress.state || "",
              postalCode: savedAddress.postalCode || "",
              country: savedAddress.country || "United States",
              latitude: Number.isFinite(savedAddress.latitude)
                ? savedAddress.latitude
                : null,
              longitude: Number.isFinite(savedAddress.longitude)
                ? savedAddress.longitude
                : null,
            });
          }
        }
      } catch (error) {
        console.error("Shipping address loading error:", error);

        if (!cancelled) {
          setAddressError("Unable to load your shipping address.");
        }
      } finally {
        if (!cancelled) {
          setAddressLoading(false);
        }
      }
    };

    fetchShippingAddress();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  // Open the inline address editor.
  const handleEditAddress = () => {
    setAddressDraft({
      address: shippingAddress?.address || "",
      city: shippingAddress?.city || "",
      state: shippingAddress?.state || "",
      postalCode: shippingAddress?.postalCode || "",
      country: shippingAddress?.country || "United States",
      latitude: Number.isFinite(shippingAddress?.latitude)
        ? shippingAddress.latitude
        : null,
      longitude: Number.isFinite(shippingAddress?.longitude)
        ? shippingAddress.longitude
        : null,
    });

    setAddressError("");
    setIsEditingAddress(true);
  };

  // Any manual edit invalidates the old coordinates.
 const handleAddressFieldChange = (event) => {
  const { name, value } = event.target;

  setAddressDraft((previous) => ({
    ...previous,
    [name]: value,
  }));

  setAddressError("");
};

  // Fill address fields and coordinates from the selected Mapbox result.
  const handleAddressRetrieve = (response) => {
    const feature = response?.features?.[0];
    const properties = feature?.properties;
    const coordinates = feature?.geometry?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      !Number.isFinite(coordinates[0]) ||
      !Number.isFinite(coordinates[1])
    ) {
      setAddressDraft((previous) => ({
        ...previous,
        latitude: null,
        longitude: null,
      }));

      setAddressError(
        "Please select a valid address from the Mapbox suggestions."
      );
      return;
    }

    const context = properties?.context ?? {};

    const getContextName = (prefix) => {
      const entry = Object.entries(context).find(([key]) =>
        key.startsWith(prefix)
      );

      return entry?.[1]?.name ?? "";
    };

    const streetAddress = [
      properties?.address,
      properties?.name,
    ]
      .filter(Boolean)
      .join(" ");

    setAddressDraft((previous) => ({
      ...previous,
      address:
        streetAddress ||
        properties?.full_address ||
        previous.address,
      city:
        getContextName("place") ||
        getContextName("locality") ||
        previous.city,
      state: getContextName("region") || previous.state,
      postalCode: getContextName("postcode") || previous.postalCode,
      country: "United States",

      // Mapbox coordinate order is [longitude, latitude].
      longitude: coordinates[0],
      latitude: coordinates[1],
    }));

    setAddressError("");
  };

  // Save the address and its Mapbox coordinates.
  const handleSaveAddress = async (event) => {
    event.preventDefault();
    setAddressError("");

    if (!MAPBOX_TOKEN) {
      setAddressError(
        "Address search is not configured. Check VITE_MAPBOX_TOKEN."
      );
      return;
    }

    if (
      !addressDraft.address.trim() ||
      !addressDraft.city.trim() ||
      !addressDraft.state.trim() ||
      !addressDraft.postalCode.trim()
    ) {
      setAddressError("Please complete all address fields.");
      return;
    }

    if (
      !Number.isFinite(addressDraft.latitude) ||
      !Number.isFinite(addressDraft.longitude)
    ) {
      setAddressError(
        "Please select your address from the Mapbox suggestions before saving."
      );
      return;
    }

    setAddressSaving(true);

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://stylebox-api",
        },
      });

      const payload = {
        ...addressDraft,
        country: "United States",
      };

      const response = await fetch(
        `${API_URL}/api/me/shipping-address`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to save shipping address."
        );
      }

      const savedAddress = {
        ...payload,
        ...(data.address ?? {}),
      };

      setShippingAddress(savedAddress);
      setAddressDraft(savedAddress);
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Saving shipping address failed:", error);

      setAddressError(
        error.message || "Unable to save shipping address."
      );
    } finally {
      setAddressSaving(false);
    }
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const formatPrice = (amount, currency = "usd") => {
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
          <strong>
            {user?.email_verified ? "Yes" : "Not verified"}
          </strong>
        </div>
      </section>

      {/* Shipping address */}
      <section className="account-shipping-address">
        <div className="account-section-heading">
          <div>
            <p className="account-eyebrow">DELIVERY DETAILS</p>
            <h2>Shipping Address</h2>
          </div>

          {!addressLoading && !addressError && (
            <button
              type="button"
              className="account-primary-button"
              onClick={() => {
                if (isEditingAddress) {
                  setIsEditingAddress(false);
                  setAddressError("");
                } else {
                  handleEditAddress();
                }
              }}
              disabled={addressSaving}
            >
              {isEditingAddress
                ? "Cancel"
                : shippingAddress
                  ? "Edit Address"
                  : "Add Address"}
            </button>
          )}
        </div>

        {addressLoading ? (
          <p>Loading your shipping address...</p>
        ) : addressError && !isEditingAddress ? (
          <p role="alert">{addressError}</p>
        ) : isEditingAddress ? (
          <form
            onSubmit={handleSaveAddress}
            className="account-address-form"
          >
            <p>We currently ship within the United States only.</p>

            {!MAPBOX_TOKEN && (
              <p role="alert" className="account-address-error">
                Address search is not configured. Add VITE_MAPBOX_TOKEN
                to your frontend environment variables.
              </p>
            )}

            <AddressAutofill
              accessToken={MAPBOX_TOKEN}
              options={{
                country: "us",
                language: "en",
                limit: 8,
                streets: true,
              }}
              browserAutofillEnabled={false}
              onRetrieve={handleAddressRetrieve}
              onSuggestError={(error) => {
                console.error("Mapbox suggestions error:", error);
                setAddressError(
                  "Address suggestions failed. Please check the Mapbox token and try again."
                );
              }}
            >
              <label htmlFor="account-shipping-address">
                Street address
                <input
                  id="account-shipping-address"
                  name="address"
                  value={addressDraft.address}
                  onChange={handleAddressFieldChange}
                  autoComplete="address-line1"
                  placeholder="Start typing your US address"
                  required
                />
              </label>

              <label htmlFor="account-shipping-city">
                City
                <input
                  id="account-shipping-city"
                  name="city"
                  value={addressDraft.city}
                  onChange={handleAddressFieldChange}
                  autoComplete="address-level2"
                  required
                />
              </label>

              <label htmlFor="account-shipping-state">
                State
                <input
                  id="account-shipping-state"
                  name="state"
                  value={addressDraft.state}
                  onChange={handleAddressFieldChange}
                  autoComplete="address-level1"
                  required
                />
              </label>

              <label htmlFor="account-shipping-postal">
                ZIP code
                <input
                  id="account-shipping-postal"
                  name="postalCode"
                  value={addressDraft.postalCode}
                  onChange={handleAddressFieldChange}
                  autoComplete="postal-code"
                  required
                />
              </label>
            </AddressAutofill>

            <label htmlFor="account-shipping-country">
              Country
              <input
                id="account-shipping-country"
                name="country"
                value="United States"
                autoComplete="country-name"
                readOnly
              />
            </label>

            {addressError && (
              <p role="alert" className="account-address-error">
                {addressError}
              </p>
            )}

            <button
              type="submit"
              className="account-primary-button"
              disabled={addressSaving || !MAPBOX_TOKEN}
            >
              {addressSaving ? "Saving..." : "Save Address"}
            </button>
          </form>
        ) : shippingAddress ? (
          <div className="account-address-details">
            <p>{shippingAddress.address}</p>
            <p>
              {[
                shippingAddress.city,
                shippingAddress.state,
                shippingAddress.postalCode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>{shippingAddress.country || "United States"}</p>
          </div>
        ) : (
          <p>No shipping address saved yet.</p>
        )}
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
            <p className="account-orders-message">
              Loading your orders...
            </p>
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
