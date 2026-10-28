const getOrderStatus = (status) => {
  const statuses = {
    new: "New",
    processing: "Processing",
    in_progress: "In Progress",
    shipped: "Shipped",
    completed: "Completed",
    cancelled: "Cancelled",
    delayed: "Delayed",
  };

  return statuses[status] || status || "New";
};

export default getOrderStatus;