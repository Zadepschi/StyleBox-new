import formatPrice from "../lib/formatPrice";
import formatDate from "../lib/formatDate";
import getOrderStatus from "../lib/getOrderStatus";
import "./OrderCard.css";

const OrderCard = ({ order }) => {
  return (
    <article className="account-order-card">
      <div className="account-order-header">
        <div>
          <p className="account-order-label">Order</p>

          <h3>
            #{order._id.slice(-8).toUpperCase()}
          </h3>

          <p className="account-order-date">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="account-order-total">
          <strong>
            {formatPrice(order.totalAmount, order.currency)}
          </strong>

          <span
            className={`account-payment-status account-payment-${order.paymentStatus}`}
          >
            {order.paymentStatus === "paid"
              ? "Paid"
              : order.paymentStatus === "pending"
                ? "Payment Pending"
                : "Payment Failed"}
          </span>
        </div>
      </div>

      <div className="account-order-items">
        {(order.items || []).map((item, index) => (
          <div
            className="account-order-item"
            key={`${item.productId}-${index}`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="account-order-product-image"
            />

            <span>{item.name}</span>

            <span>× {item.quantity}</span>

            <strong>
              {formatPrice(
                Math.round(item.price * 100) * item.quantity,
                order.currency
              )}
            </strong>
          </div>
        ))}
      </div>

      <div className="account-order-footer">
        <span>Order Status</span>

        <span
          className={`account-order-status account-status-${(
            order.orderStatus || "new"
          ).toLowerCase()}`}
        >
          {getOrderStatus(order.orderStatus)}
        </span>
      </div>

      {order.orderStatus !== "new" &&
        order.orderStatus !== "cancelled" &&
        order.geologisticsOrderId && (
          <div className="account-order-footer">
            <span>Tracking Number</span>
            <strong>{order.geologisticsOrderId}</strong>
          </div>
        )}
    </article>
  );
};

export default OrderCard;