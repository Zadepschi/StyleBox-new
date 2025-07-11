// src/redux/store.jsx
import { configureStore } from "@reduxjs/toolkit";
import clothes from "./clothesSlice";
import cart from "./cartSlice";

// Загружаем состояние корзины из localStorage
const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    return serializedCart ? JSON.parse(serializedCart) : undefined;
  } catch (e) {
    console.warn("❌ Could not load cart from localStorage", e);
    return undefined;
  }
};

// Сохраняем состояние корзины в localStorage
const saveCartToLocalStorage = (cartState) => {
  try {
    const serializedCart = JSON.stringify(cartState);
    localStorage.setItem("cart", serializedCart);
  } catch (e) {
    console.warn("❌ Could not save cart to localStorage", e);
  }
};

// Начальное состояние только для корзины
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

// Подписываемся на изменения состояния и сохраняем cart в localStorage
store.subscribe(() => {
  const state = store.getState();
  saveCartToLocalStorage(state.cart);
});

export default store;
