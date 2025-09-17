import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getTotalPrice } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckoutForm.css";
import { useDispatch } from "react-redux";
import { emptyCart } from "../redux/cartSlice";

export const CheckoutForm = () => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const totalPrice = useSelector(getTotalPrice);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      
        const { data } = await axios.post(
  "https://stylebox-backend.onrender.com/stripe/create-payment-intent",
  {
    amount: Math.round(totalPrice * 100),
  }
);

      const clientSecret = data.clientSecret;

      if (!clientSecret) {
        throw new Error("Не получен clientSecret от сервера");
      }

     
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error(result.error);
        setErrorMessage(result.error.message || "Payment failed");
      } else {
       if (result.paymentIntent.status === "succeeded") {
  console.log("Payment succeeded!");
  dispatch(emptyCart()); 
  navigate("/success");
}
 else {
          setErrorMessage("Оплата не прошла. Статус: " + result.paymentIntent.status);
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Произошла ошибка при оплате");
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
              className="copy-btn"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText("4242 4242 4242 4242");
              }}
              title="Copy to clipboard"
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
          ⚠️ This is a <strong>test card</strong> for demo purposes. Do not enter real payment data.
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
                  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                  "::placeholder": { color: "#a0aec0" },
                },
                invalid: { color: "#fa755a" },
              },
            }}
          />
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          className="pay-btn"
          disabled={!stripe || loading}
        >
          {loading ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};
