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
    <img
      className="deleteIcon"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/%D0%98%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0_%D0%BC%D1%83%D1%81%D0%BE%D1%80%D0%BA%D0%B8.svg/512px-%D0%98%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0_%D0%BC%D1%83%D1%81%D0%BE%D1%80%D0%BA%D0%B8.svg.png?20141227234858"
      alt="delete icon"
    />
  </span>
</div>

  );
};
export default CartItem;
