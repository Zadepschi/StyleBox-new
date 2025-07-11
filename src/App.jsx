import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ClockApp from './clock/ClockApp';
import Home from "./home/Home";
import About from "./about/About";
import Login from "./login/login";
import AllProducts from "./allProducts/AllProducts";
import Cart from "./components/cart/Cart";
import "./App.css";
import CheckoutPage from "./checkoutPage/CheckoutPage";
import Stripe from "./Stripe/StripeContainer";
import { useDispatch } from "react-redux";
import { filterCategory } from "./redux/clothesSlice";
import SuccessPage from "./Stripe/SuccessPage";
import LoginButton from "./login/LoginButton"



export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownActive, setDropdownActive] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownActive(prev => !prev);
  const closeDropdown = () => setDropdownActive(false);

  const handleClick = (category) => {
    dispatch(filterCategory(category));
    closeDropdown();
    setMenuOpen(false);
    navigate("/products");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="clockFix">
        <ClockApp />
      </div>
     
      <nav className="navbar">
       <div className="logo">
    <Link to="/" onClick={() => { setMenuOpen(false); closeDropdown(); }} style={{ textDecoration: 'none' }}>
      <span className="style-dark">Style</span>
      <span className="box-dark">BOX</span>
    </Link>
  </div>
        <input
          type="checkbox"
          id="menu-toggle"
          className="menu-toggle"
          checked={menuOpen}
          onChange={toggleMenu}
        />
        <label htmlFor="menu-toggle" className="hamburger">&#9776;</label>

        <ul className="nav-links">
          <li>
            <Link to="/" onClick={() => { setMenuOpen(false); closeDropdown(); }}>Home</Link>
          </li>

          <li ref={dropdownRef} className={`dropdown ${dropdownActive ? "active" : ""}`}>
            <span onClick={toggleDropdown}>
              Collections
            </span>
            <ul className="dropdown-menu">
               <li><span onClick={() => handleClick("all")}>All Products</span></li>
              <li><span onClick={() => handleClick("dress")}>Dress</span></li>
              <li><span onClick={() => handleClick("skirt")}>Skirt</span></li>
              <li><span onClick={() => handleClick("pants")}>Pants</span></li>
              <li><span onClick={() => handleClick("pijamas")}>Pijamas</span></li>
              <li><span onClick={() => handleClick("shoes")}>shoes</span></li>
              <li><span onClick={() => handleClick("tunic")}>tunic</span></li>
              <li><span onClick={() => handleClick("shirt")}>shirt</span></li>
            </ul>
          </li>

          <li>
            <Link to="/about" onClick={() => { setMenuOpen(false); closeDropdown(); }}>About</Link>
          </li>

         <li>
  <LoginButton setMenuOpen={setMenuOpen} closeDropdown={closeDropdown} />
</li>
        </ul>

        <Cart />
      </nav>
  
      <Routes>
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout-form" element={<Stripe />} />

      </Routes>
    </div>
  );
}
