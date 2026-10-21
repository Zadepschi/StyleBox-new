
import { configureStore } from "@reduxjs/toolkit";
import clothes from "../../entities/product/model/clothesSlice";
import cart from "../../entities/cart/model/cartSlice";

const store = configureStore({
  reducer: {
    clothes,
    cart,
  },
});

export default store;
