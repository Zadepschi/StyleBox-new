import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChangeQuantity from "../cart/ChangeQuantity";
import {
  addItemToCart,
  getCartItems,
  changeQuantityInCart,
} from "../../redux/cartSlice";
import "./Clothes.css"

const Clothes = ({ clothes }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const cartItems = useSelector(getCartItems);
  const clothesInCart = cartItems.some((item) => item.id === clothes.id);

  const AddToCart = () => {
    if (!clothesInCart) {
      dispatch(addItemToCart({ clothes, quantity }));
    } else {
      dispatch(changeQuantityInCart({ clothes, quantity }));
    }
  };

  return (
    <div className="containerSmall">
      <div>
        <img className="catalog" src={clothes.image} alt="pic" />
      </div>
      <div className="clothesName">
        <h2> {clothes.name} </h2>
      </div>
      <div className="clothesPrice">
        <h2> $ {clothes.price} </h2>
      </div>
      <div className="minusPlus">
        <ChangeQuantity quantity={quantity} setQuantity={setQuantity} />
      </div>
      <div className="addToCartButton">
        <button onClick={AddToCart}>Add to cart</button>
      </div>
    </div>
  );
};
export default Clothes;
