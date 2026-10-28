
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderHistorySection from "../../../widgets/order-history/ui/OrderHistorySection";
import AccountHeader from "../sections/AccountHeader";
import ProfileSection from "../sections/ProfileSection";
import ShoppingBagSection from "../sections/ShoppingBagSection";
import ShippingAddressSection from "../sections/ShippingAddressSection";
import useMyOrders from "../../../entities/order/model/useMyOrders";
import useShippingAddress from "../../../entities/shipping-address/model/useShippingAddress";

import {
  getCartItems,
  getTotalPrice,
  getTotalQuantity,
} from "../../../entities/cart/model/cartSlice";

import "./AccountPage.css";

const AccountPage = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
  } = useAuth0();

  const cartItems = useSelector(getCartItems);
  const totalPrice = useSelector(getTotalPrice);
  const totalQuantity = useSelector(getTotalQuantity);
  const navigate = useNavigate();
const {
  orders,
  ordersLoading,
  ordersError,
  refetchOrders,
} = useMyOrders(isAuthenticated);

const [visibleOrders, setVisibleOrders] = useState(3);
  

const {
  shippingAddress,
  addressLoading,
  addressError,
  isEditingAddress,
  addressSaving,
  addressDraft,
  mapboxToken,
  setIsEditingAddress,
  setAddressError,
  handleEditAddress,
  handleAddressFieldChange,
  handleAddressRetrieve,
  handleSaveAddress,
} = useShippingAddress(isAuthenticated, isLoading);


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
          Log In
        </button>
      </div>
    );
  }

 
  return (
    <main className="account-page">
      <AccountHeader
        user={user}
        onLogout={handleLogout}
      />

      <div className="account-left-column">
        <ProfileSection user={user} />

        <ShippingAddressSection
          addressLoading={addressLoading}
          addressError={addressError}
          isEditingAddress={isEditingAddress}
          shippingAddress={shippingAddress}
          addressSaving={addressSaving}
          addressDraft={addressDraft}
          mapboxToken={mapboxToken}
          onToggleEditAddress={() => {
            if (isEditingAddress) {
              setIsEditingAddress(false);
              setAddressError("");
            } else {
              handleEditAddress();
            }
          }}
          onAddressFieldChange={handleAddressFieldChange}
          onAddressRetrieve={handleAddressRetrieve}
          onSuggestError={(error) => {
            console.error("Address suggestion error:", error);
          }}
          onSaveAddress={handleSaveAddress}
        />
      </div>

      <div className="account-right-column">
        <ShoppingBagSection
          cartItems={cartItems}
          totalPrice={totalPrice}
          totalQuantity={totalQuantity}
          onExploreCollections={() => navigate("/products")}
          onCheckout={() => navigate("/checkout")}
        />

        <OrderHistorySection
          orders={orders}
          ordersLoading={ordersLoading}
          ordersError={ordersError}
          visibleOrders={visibleOrders}
          onShowMore={() =>
            setVisibleOrders((prev) => prev + 5)
          }
          onRetry={refetchOrders}
          onStartShopping={() => navigate("/products")}
        />
      </div>
    </main>
  );

};

export default AccountPage;
