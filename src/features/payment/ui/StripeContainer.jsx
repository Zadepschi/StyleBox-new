
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation, Navigate } from "react-router-dom";

import { CheckoutForm } from "./CheckoutForm";

const publicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publicKey) {
  throw new Error("Missing Stripe publishable key");
}

const stripePromise = loadStripe(publicKey);

const Stripe = () => {
  const location = useLocation();
  const shippingAddress = location.state?.shippingAddress;

  // Do not open payment before an address has been provided.
  if (!shippingAddress) {
    return <Navigate to="/checkout" replace />;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm shippingAddress={shippingAddress} />
    </Elements>
  );
};

export default Stripe;
