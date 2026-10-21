import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "../../../entities/cart/model/cartSlice";

const getCartKey = (user) =>
  user?.sub ? `cart_${user.sub}` : "cart_guest";

const CartPersistence = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const activeKeyRef = useRef(null);
  const loadedKeyRef = useRef(null);

  const userKey = isAuthenticated && user?.sub
    ? getCartKey(user)
    : !isLoading && !isAuthenticated
      ? "cart_guest"
      : null;

  useEffect(() => {
    if (isLoading || !userKey) return;

    // Не загружаем одну и ту же корзину повторно
    if (loadedKeyRef.current === userKey) return;

    activeKeyRef.current = null;

    let items = [];

    try {
      const saved = localStorage.getItem(userKey);
      const parsed = saved ? JSON.parse(saved) : [];
      items = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Не удалось загрузить корзину:", error);
    }

    dispatch(setCartItems(items));

    // Активируем сохранение только после загрузки
    loadedKeyRef.current = userKey;
    activeKeyRef.current = userKey;
  }, [userKey, isLoading, dispatch]);

  useEffect(() => {
    if (!cartItems || !activeKeyRef.current) return;

    const key = activeKeyRef.current;

    try {
      localStorage.setItem(key, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Не удалось сохранить корзину:", error);
    }
  }, [cartItems]);

  return null;
};

export default CartPersistence;