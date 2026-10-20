import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getTotalPrice, getCartItems, emptyCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckoutForm.css";

const API_URL = "https://stylebox-backend.onrender.com";

export const CheckoutForm = () => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  const totalPrice = useSelector(getTotalPrice);
  const cartItems = useSelector(getCartItems);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!stripe || !elements) {
      setErrorMessage("Payment system is not ready. Please try again.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage("Please enter your card details.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create a Stripe PaymentIntent
      const { data } = await axios.post(
        `${API_URL}/stripe/create-payment-intent`,
        {
          amount: Math.round(totalPrice * 100),
        }
      );

      const clientSecret = data.clientSecret;

      if (!clientSecret) {
        throw new Error("Unable to initialize payment.");
      }

      // Step 2: Confirm the card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setErrorMessage(
          result.error.message || "Payment failed. Please try again."
        );
        return;
      }

      if (result.paymentIntent.status !== "succeeded") {
        setErrorMessage(
          `Payment was not completed. Status: ${result.paymentIntent.status}`
        );
        return;
      }

      // Step 3: Get an Auth0 access token
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://stylebox-api",
        },
      });

      // Step 4: Save the paid order in the backend
      await axios.post(
        `${API_URL}/api/orders`,
        {
          paymentIntentId: result.paymentIntent.id,
          items: cartItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 5: Clear the cart and navigate to the success page
      dispatch(emptyCart());
      navigate("/success");
    } catch (error) {
      console.error("Checkout error:", error);

      const serverMessage = error.response?.data?.error;

      if (error.response?.status === 401) {
        setErrorMessage("Your session has expired. Please sign in again.");
      } else if (error.response?.status === 403) {
        setErrorMessage("You are not authorized to save this order.");
      } else if (serverMessage) {
        setErrorMessage(serverMessage);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Something went wrong during checkout. Please contact support if you were charged."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="test-card">
        <div className="card-mock">
          <div className="card-chip"></div>

          <div className="card-number">
            4242 4242 4242 4242

            <button
              type="button"
              className="copy-btn"
              onClick={() => {
                navigator.clipboard
                  .writeText("4242 4242 4242 4242")
                  .catch((error) => {
                    console.error("Unable to copy test card number:", error);
                  });
              }}
              title="Copy to clipboard"
              aria-label="Copy test card number"
            >
              📋
            </button>
          </div>

          <div className="card-details">
            <span>12/34</span>
            <span>CVC: 123</span>
          </div>

          <div className="card-holder">TEST USER</div>
        </div>

        <p className="card-note">
          ⚠️ This is a <strong>test card</strong> for demo purposes.
          Do not enter real payment data.
        </p>
      </div>

      <h2 className="title">Order Payment</h2>

      <div className="total-amount">
        Total amount: <strong>${totalPrice.toFixed(2)}</strong>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <label className="card-label" htmlFor="card-element">
          Enter card details
        </label>

        <div className="card-element-wrapper">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  fontFamily:
                    '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                  "::placeholder": {
                    color: "#a0aec0",
                  },
                },
                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />
        </div>

        {errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          className="pay-btn"
          disabled={!stripe || loading}
        >
          {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};