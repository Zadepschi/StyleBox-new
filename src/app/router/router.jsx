
import { Routes, Route } from "react-router-dom";

import Home from "../../pages/home/ui/Home";
import About from "../../pages/about/ui/About";
import Login from "../../pages/login/ui/login";
import AccountPage from "../../pages/account/ui/AccountPage";
import AllProducts from "../../pages/catalog/ui/AllProducts";
import CheckoutPage from "../../pages/checkout/ui/CheckoutPage";
import SuccessPage from "../../pages/payment-success/ui/SuccessPage";
import StripeContainer from "../../features/payment/ui/StripeContainer";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<AllProducts />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout-form" element={<StripeContainer />} />
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  );
}
