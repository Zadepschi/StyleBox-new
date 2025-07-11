import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    addItemToCart: (state, action) => {
      //const timeId = new Date().getTime()
      state.cartItems.push({
        // id: timeId,
        //clothesId: action.payload.clothes.id,
        ...action.payload.clothes,
        quantity: action.payload.quantity,
        totalPrice: action.payload.quantity * action.payload.clothes.price,
      });
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.cartItemId
      );
    },

    changeQuantityInCart: (state, action) => {
      const newCart = [];
      state.cartItems.forEach((item) => {
        if (item.id === action.payload.clothes.id) {
          let countNew = item.quantity + action.payload.quantity;
          let totalSum = item.price * countNew;
          const changeCart = {
            ...item,
            quantity: countNew,
            totalPrice: totalSum,
          };
          newCart.push(changeCart);
        } else {
          newCart.push(item);
        }
      });
      state.cartItems = newCart;
    },
    emptyCart: (state, action) => {
      state.cartItems = [];
    },
  },
});

export const getTotalPrice = (state) => {
  return state.cart.cartItems.reduce((total, cartItems) => {
    return cartItems.totalPrice + total;
  }, 0);
};
export const getTotalQuantity = (state) => {
  return state.cart.cartItems.reduce((total, cartItems) => {
    return cartItems.quantity + total;
  }, 0);
};

export const getCartItems = (state) => state.cart.cartItems;
export const {
  addItemToCart,
  removeItemFromCart,
  changeQuantityInCart,
  emptyCart,
} = cartSlice.actions;
export default cartSlice.reducer;
