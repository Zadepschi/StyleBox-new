
import React from "react";
import { useDispatch } from "react-redux";
import { data } from "../../data/data";
import {
  removeItemFromCart,
  changeQuantityInCart,
} from "../../redux/cartSlice";

const CartItem = ({ cartItem }) => {
  const dispatch = useDispatch();
  const photos = data.find((item) => item.id === cartItem.id);

  const changeQuantity = (amount) => {
    if (cartItem.quantity + amount < 1) return;

    dispatch(
      changeQuantityInCart({
        clothes: cartItem,
        quantity: amount,
      })
    );
  };

  return (
    <div className="modalCart cart-item">
      <img
        src={photos?.image}
        alt={photos?.name || cartItem.name}
        className="cart-item__image"
      />

      <div className="cart-item__info">
        <p className="cart-item__name">{cartItem.name}</p>

        <p className="cart-item__price">
          ${(Number(cartItem.price) * cartItem.quantity).toFixed(2)}
        </p>

        <div className="cart-item__bottom">
          <div className="quantity-control">
            <button
              type="button"
              onClick={() => changeQuantity(-1)}
              disabled={cartItem.quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span>{cartItem.quantity}</span>

            <button
              type="button"
              onClick={() => changeQuantity(1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="cart-item__delete"
        onClick={() =>
          dispatch(removeItemFromCart({ cartItemId: cartItem.id }))
        }
        aria-label={`Remove ${cartItem.name} from cart`}
        title="Remove item"
      >
        🗑
      </button>
    </div>
  );
};

export default CartItem;
