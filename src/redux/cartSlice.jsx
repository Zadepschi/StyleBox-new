
import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },

    addItemToCart: (state, action) => {
      state.cartItems.push({
        ...action.payload.clothes,
        quantity: action.payload.quantity,
        totalPrice:
          action.payload.quantity * action.payload.clothes.price,
      });
    },

    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.cartItemId
      );
    },

    changeQuantityInCart: (state, action) => {
      state.cartItems = state.cartItems.map((item) => {
        if (item.id === action.payload.clothes.id) {
          const quantity = item.quantity + action.payload.quantity;

          return {
            ...item,
            quantity,
            totalPrice: item.price * quantity,
          };
        }

        return item;
      });
    },

    emptyCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const getTotalPrice = (state) =>
  state.cart.cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

export const getTotalQuantity = (state) =>
  state.cart.cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

export const getCartItems = (state) => state.cart.cartItems;

export const {
  setCartItems,
  addItemToCart,
  removeItemFromCart,
  changeQuantityInCart,
  emptyCart,
} = cartSlice.actions;

export default cartSlice.reducer;
