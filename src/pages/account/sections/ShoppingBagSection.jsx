
import CartItem from "../../../widgets/cart/ui/CartItem";
import "./ShoppingBagSection.css";

const ShoppingBagSection = ({
  cartItems,
  totalPrice,
  totalQuantity,
  onExploreCollections,
  onCheckout,
}) => {
  return (
    <section className="account-shopping">
      <div className="account-section-heading">
        <div>
          <p className="account-eyebrow">YOUR SHOPPING</p>
          <h2>My Shopping Bag</h2>
        </div>

        <span className="account-item-count">
          {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="account-shopping-summary">
        <div>
          <span>Total Items</span>
          <strong>{totalQuantity}</strong>
        </div>

        <div>
          <span>Total Price</span>
          <strong>${Number(totalPrice || 0).toFixed(2)}</strong>
        </div>
      </div>

      <div className="account-cart-items">
        {cartItems.length > 0 ? (
          cartItems.map((cartItem, index) => (
            <CartItem
              key={cartItem.id ?? cartItem._id ?? index}
              cartItem={cartItem}
            />
          ))
        ) : (
          <div className="account-empty-cart">
            <p>Your shopping bag is empty.</p>
            <button
              type="button"
              className="account-primary-button"
              onClick={onExploreCollections}
            >
              Explore Collections
            </button>
          </div>
        )}
      </div>

      {totalQuantity > 0 && (
        <button
          type="button"
          className="account-primary-button"
          onClick={onCheckout}
        >
          Proceed to Checkout
        </button>
      )}
    </section>
  );
};

export default ShoppingBagSection;
