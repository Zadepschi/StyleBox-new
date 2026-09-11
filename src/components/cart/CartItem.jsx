import React from "react";
import { useDispatch } from "react-redux";
import { data } from "../../data/data";
import { removeItemFromCart } from "../../redux/cartSlice";

const CartItem = ({ cartItem }) => {
  const dispatch = useDispatch();
  const photos = data.find((item) => item.id === cartItem.id);
  return (
   <div className="modalCart cart-item">
  <img src={photos.image} alt={photos.name} className="cart-item__image" />

  <div className="cart-item__info">
    <p className="cart-item__name">{cartItem.name}</p>
    <p className="cart-item__quantity">Qty: {cartItem.quantity}</p>
    <p className="cart-item__price">${cartItem.price * cartItem.quantity}</p>
  </div>

  <span
  className="cart-item__delete"
  onClick={() =>
    dispatch(removeItemFromCart({ cartItemId: cartItem.id }))
  }
>
  🗑️
</span>
</div>

  );
};
export default CartItem;
