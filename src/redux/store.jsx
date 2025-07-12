
import { configureStore } from "@reduxjs/toolkit";
import clothes from "./clothesSlice";
import cart from "./cartSlice";


const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    return serializedCart ? JSON.parse(serializedCart) : undefined;
  } catch (e) {
    console.warn("❌ Could not load cart from localStorage", e);
    return undefined;
  }
};


const saveCartToLocalStorage = (cartState) => {
  try {
    const serializedCart = JSON.stringify(cartState);
    localStorage.setItem("cart", serializedCart);
  } catch (e) {
    console.warn("❌ Could not save cart to localStorage", e);
  }
};


const preloadedState = {
  cart: loadCartFromLocalStorage(),
};

const store = configureStore({
  reducer: {
    clothes,
    cart,
  },
  preloadedState,
});


store.subscribe(() => {
  const state = store.getState();
  saveCartToLocalStorage(state.cart);
});

export default store;
