import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

// Load your Stripe Publishable Key
const stripePromise = loadStripe("pk_test_51RIByFRl50WrASI2h2jmqvF2JQMnmB8jJhWDoZeakPWKyEsTBzLNt9a4PNnFSLoNEHfI3ok8cZO9yi2lQub5N47g006bxVMKdi"); // 👈 Replace with your real Stripe Publishable Key

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded.
    }
  
    const cardElement = elements.getElement(CardElement);
  
    if (!cardElement) {
      console.error('CardElement not found!');
      return; // Card input not ready
    }
  
    try {
      // 1. Create PaymentIntent from backend
      const { data } = await axios.post("http://localhost:5004/api/payment/pay", {
        orderId: "66303a9e8b1c8b5e22a6c117",
        userId: "66303a9e8b1c8b5e22a6c118",
        amount: 2000
      });
  
      const clientSecret = data.clientSecret;
  
      // 2. Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement
        }
      });
  
      if (result.error) {
        console.error(result.error.message);
        alert("Payment Failed ❌");
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          console.log("Payment successful! 🎉");
          setPaymentSuccess(true);
        }
      }
    } catch (error) {
      console.error("Payment error:", error.message);
      alert("Something went wrong.");
    }
  };
  

  return (
    <div style={{ width: 400, margin: "auto", marginTop: 100 }}>
      {paymentSuccess ? (
        <h2>Payment Successful! 🎉</h2>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardElement />
          <button type="submit" style={{ marginTop: 20 }}>Pay</button>
        </form>
      )}
    </div>
  );
};

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentPage;
