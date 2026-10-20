
import { configureStore } from "@reduxjs/toolkit";
import clothes from "./clothesSlice";
import cart from "./cartSlice";

const store = configureStore({
  reducer: {
    clothes,
    cart,
  },
});

export default store;
