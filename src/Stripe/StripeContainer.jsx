import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { CheckoutForm } from "./CheckoutForm";

const PUBLIC_KEY = "pk_test_51MAXGjBxM95TiYl6tzodtrCuLYEEvi2lLv3HLb70MzsMERwMl6OJiofLMbrmdT0hvZIYMDDyBao5SqmYaU9SDxcf00iopnF52c";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Stripe = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Stripe;