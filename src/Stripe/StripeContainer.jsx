import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { CheckoutForm } from "./CheckoutForm";

const publicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publicKey) {
  throw new Error("Missing Stripe publishable key");
}

const stripePromise = loadStripe(publicKey);

const Stripe = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Stripe;