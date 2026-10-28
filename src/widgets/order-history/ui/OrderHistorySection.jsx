
import OrderCard from "../../../entities/order/ui/OrderCard";
import "./OrderHistorySection.css";

const OrderHistorySection = ({
  orders,
  ordersLoading,
  ordersError,
  visibleOrders,
  onShowMore,
}) => {
  return (
    <section className="account-section account-orders-section">
      <h2>Order History</h2>

      {ordersLoading && (
        <p>Loading orders...</p>
      )}

      {!ordersLoading && ordersError && (
        <p className="account-error">{ordersError}</p>
      )}

      {!ordersLoading &&
        !ordersError &&
        orders.length === 0 && (
          <p>You have no orders yet.</p>
        )}

      {!ordersLoading &&
        !ordersError &&
        orders.length > 0 && (
          <>
            <div className="account-orders-list">
              {orders
                .slice(0, visibleOrders)
                .map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                  />
                ))}
            </div>

            {visibleOrders < orders.length && (
              <button
                type="button"
                className="account-show-more"
                onClick={onShowMore}
              >
                Show More
              </button>
            )}
          </>
        )}
    </section>
  );
};

export default OrderHistorySection;
